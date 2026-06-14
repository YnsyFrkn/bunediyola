import nodemailer from "nodemailer";

type SendPasswordResetEmailInput = {
  to: string;
  resetUrl: string;
};

type SendWelcomeEmailInput = {
  to: string;
  name?: string | null;
  loginUrl: string;
};

type MailFailureReason =
  | "not_configured"
  | "authentication_failed"
  | "sender_not_verified"
  | "test_recipient_restricted"
  | "invalid_sender"
  | "quota_exceeded"
  | "api_failed"
  | "connection_failed"
  | "timeout"
  | "unknown";

type MailProvider = "resend" | "smtp";

type MailError = Error & {
  code?: string;
  responseCode?: number;
  command?: string;
  reason?: MailFailureReason;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} environment variable is required.`);
  }

  return value;
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

export function isMailConfigured() {
  return isResendConfigured() || isSmtpConfigured();
}

function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM?.trim());
}

function isSmtpConfigured() {
  return ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM"].every((name) =>
    Boolean(process.env[name]?.trim()),
  );
}

function getMailProvider(): MailProvider | null {
  if (isResendConfigured()) {
    return "resend";
  }

  if (isSmtpConfigured()) {
    return "smtp";
  }

  return null;
}

function createMailTransporter() {
  const port = Number(getRequiredEnv("SMTP_PORT"));
  const host = getRequiredEnv("SMTP_HOST").trim();
  const user = getRequiredEnv("SMTP_USER").trim();
  const configuredPassword = getRequiredEnv("SMTP_PASSWORD").trim();
  const password =
    host.toLowerCase() === "smtp.gmail.com"
      ? configuredPassword.replace(/\s+/g, "")
      : configuredPassword;

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT environment variable must be a valid port.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user,
      pass: password,
    },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  });
}

function getMailFailureReason(error: unknown): MailFailureReason {
  const mailError = error as MailError;

  if (mailError.reason) {
    return mailError.reason;
  }

  if (mailError.responseCode === 535 || mailError.code === "EAUTH") {
    return "authentication_failed";
  }

  if (mailError.code === "ETIMEDOUT" || mailError.code === "ESOCKET") {
    return "timeout";
  }

  if (mailError.code === "ECONNECTION" || mailError.code === "ECONNREFUSED") {
    return "connection_failed";
  }

  return "unknown";
}

async function sendWithResend({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getRequiredEnv("RESEND_API_KEY").trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getRequiredEnv("RESEND_FROM").trim(),
      to: [to],
      subject,
      text,
      html,
    }),
    signal: AbortSignal.timeout(20_000),
  });

  if (response.ok) {
    return;
  }

  const body = (await response.json().catch(() => null)) as
    | {
        name?: string;
        message?: string;
      }
    | null;
  const error = new Error(body?.message || `Resend API request failed with ${response.status}.`) as MailError;

  const errorName = body?.name?.toLowerCase();
  const errorMessage = body?.message?.toLowerCase() ?? "";

  if (
    errorName === "validation_error" &&
    errorMessage.includes("only send testing emails")
  ) {
    error.reason = "test_recipient_restricted";
  } else if (
    errorName === "validation_error" &&
    errorMessage.includes("domain") &&
    errorMessage.includes("not verified")
  ) {
    error.reason = "sender_not_verified";
  } else if (errorName === "invalid_from_address") {
    error.reason = "invalid_sender";
  } else if (
    errorName === "monthly_quota_exceeded" ||
    errorName === "daily_quota_exceeded" ||
    errorName === "rate_limit_exceeded"
  ) {
    error.reason = "quota_exceeded";
  } else if (
    errorName === "missing_api_key" ||
    errorName === "invalid_api_key" ||
    response.status === 401
  ) {
    error.reason = "authentication_failed";
  } else {
    error.reason = "api_failed";
  }

  throw error;
}

async function sendMailMessage({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const provider = getMailProvider();

  if (provider === "resend") {
    await sendWithResend({
      to,
      subject,
      text,
      html,
    });
    return;
  }

  if (provider === "smtp") {
    const transporter = createMailTransporter();

    try {
      await transporter.sendMail({
        from: getRequiredEnv("SMTP_FROM"),
        to,
        subject,
        text,
        html,
      });
    } finally {
      transporter.close();
    }
    return;
  }

  const error = new Error("Mail provider is not configured.") as MailError;
  error.reason = "not_configured";
  throw error;
}

export async function verifyMailConnection() {
  const provider = getMailProvider();

  if (!provider) {
    return {
      configured: false,
      connected: false,
      reason: "not_configured" as const,
      provider: null,
    };
  }

  if (provider === "resend") {
    return {
      configured: true,
      connected: true,
      reason: null,
      provider,
    };
  }

  const transporter = createMailTransporter();

  try {
    await transporter.verify();

    return {
      configured: true,
      connected: true,
      reason: null,
      provider,
    };
  } catch (error) {
    console.error("SMTP baglanti dogrulamasi basarisiz", error);

    return {
      configured: true,
      connected: false,
      reason: getMailFailureReason(error),
      provider,
    };
  } finally {
    transporter.close();
  }
}

export async function sendMailHealthTestEmail(to: string) {
  try {
    await sendMailMessage({
      to,
      subject: "bunediyola email testi",
      text: [
        "Merhaba,",
        "",
        "Bu mesaj bunediyola email servisinin calistigini dogrulamak icin gonderildi.",
        "Hos geldin ve sifre sifirlama mailleri artik gonderilebilir.",
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
          <h1 style="font-size: 24px;">Email servisi hazir</h1>
          <p>Bu mesaj bunediyola email servisinin calistigini dogrulamak icin gonderildi.</p>
          <p>Hos geldin ve sifre sifirlama mailleri artik gonderilebilir.</p>
        </div>
      `,
    });

    return {
      sent: true as const,
      reason: null,
    };
  } catch (error) {
    console.error("SMTP test emaili gonderilemedi", error);

    return {
      sent: false as const,
      reason: getMailFailureReason(error),
    };
  }
}

export async function sendPasswordResetEmail({ to, resetUrl }: SendPasswordResetEmailInput) {
  const safeResetUrl = escapeHtml(resetUrl);

  await sendMailMessage({
    to,
    subject: "bunediyola sifre sifirlama",
    text: [
      "Merhaba,",
      "",
      "bunediyola hesabinin sifresini sifirlamak icin asagidaki linki kullanabilirsin.",
      resetUrl,
      "",
      "Bu link kisa sure sonra gecersiz olur. Bu istegi sen yapmadiysan bu emaili yok sayabilirsin.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
        <h1 style="font-size: 24px;">Sifreni sifirla</h1>
        <p>bunediyola hesabinin sifresini sifirlamak icin asagidaki butonu kullanabilirsin.</p>
        <p>
          <a href="${safeResetUrl}" style="display: inline-block; background: #111827; color: #ffffff; padding: 12px 18px; border-radius: 999px; text-decoration: none; font-weight: 700;">
            Sifremi Sifirla
          </a>
        </p>
        <p>Buton calismazsa bu linki tarayicina yapistir:</p>
        <p style="word-break: break-all;">${safeResetUrl}</p>
        <p>Bu istegi sen yapmadiysan bu emaili yok sayabilirsin.</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail({ to, name, loginUrl }: SendWelcomeEmailInput) {
  const displayName = name?.trim() || "Merhaba";
  const safeDisplayName = escapeHtml(displayName);
  const safeEmail = escapeHtml(to);
  const safeLoginUrl = escapeHtml(loginUrl);

  await sendMailMessage({
    to,
    subject: "bunediyola hesabiniz olusturuldu",
    text: [
      `${displayName},`,
      "",
      "bunediyola hesabiniz basariyla olusturuldu.",
      `Kullanici adiniz: ${displayName}`,
      `Kayitli email adresiniz: ${to}`,
      "",
      "Guvenliginiz icin sifreniz email ile gonderilmez ve duz metin olarak saklanmaz.",
      "Giris yapmak icin asagidaki linki kullanabilirsiniz:",
      loginUrl,
      "",
      "Sifrenizi unutursaniz giris sayfasindaki sifremi unuttum baglantisini kullanabilirsiniz.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
        <h1 style="font-size: 24px;">bunediyola'ya hos geldiniz</h1>
        <p>${safeDisplayName}, hesabiniz basariyla olusturuldu.</p>
        <p><strong>Kullanici adi:</strong> ${safeDisplayName}</p>
        <p><strong>Kayitli email:</strong> ${safeEmail}</p>
        <p>Guvenliginiz icin sifreniz email ile gonderilmez ve duz metin olarak saklanmaz.</p>
        <p>
          <a href="${safeLoginUrl}" style="display: inline-block; background: #111827; color: #ffffff; padding: 12px 18px; border-radius: 999px; text-decoration: none; font-weight: 700;">
            Giris Yap
          </a>
        </p>
        <p>Buton calismazsa bu linki tarayicina yapistir:</p>
        <p style="word-break: break-all;">${safeLoginUrl}</p>
      </div>
    `,
  });
}
