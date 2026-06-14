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

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} environment variable is required.`);
  }

  return value;
}

export function isMailConfigured() {
  return ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM"].every(
    (name) => Boolean(process.env[name]?.trim()),
  );
}

function createMailTransporter() {
  const port = Number(getRequiredEnv("SMTP_PORT"));

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT environment variable must be a valid port.");
  }

  return nodemailer.createTransport({
    host: getRequiredEnv("SMTP_HOST"),
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: getRequiredEnv("SMTP_USER"),
      pass: getRequiredEnv("SMTP_PASSWORD"),
    },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  });
}

export async function sendPasswordResetEmail({ to, resetUrl }: SendPasswordResetEmailInput) {
  const transporter = createMailTransporter();

  await transporter.sendMail({
    from: getRequiredEnv("SMTP_FROM"),
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
          <a href="${resetUrl}" style="display: inline-block; background: #111827; color: #ffffff; padding: 12px 18px; border-radius: 999px; text-decoration: none; font-weight: 700;">
            Sifremi Sifirla
          </a>
        </p>
        <p>Buton calismazsa bu linki tarayicina yapistir:</p>
        <p style="word-break: break-all;">${resetUrl}</p>
        <p>Bu istegi sen yapmadiysan bu emaili yok sayabilirsin.</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail({ to, name, loginUrl }: SendWelcomeEmailInput) {
  const transporter = createMailTransporter();

  const displayName = name?.trim() || "Merhaba";

  await transporter.sendMail({
    from: getRequiredEnv("SMTP_FROM"),
    to,
    subject: "bunediyola hesabiniz olusturuldu",
    text: [
      `${displayName},`,
      "",
      "bunediyola hesabiniz basariyla olusturuldu.",
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
        <p>${displayName}, hesabiniz basariyla olusturuldu.</p>
        <p><strong>Kayitli email:</strong> ${to}</p>
        <p>Guvenliginiz icin sifreniz email ile gonderilmez ve duz metin olarak saklanmaz.</p>
        <p>
          <a href="${loginUrl}" style="display: inline-block; background: #111827; color: #ffffff; padding: 12px 18px; border-radius: 999px; text-decoration: none; font-weight: 700;">
            Giris Yap
          </a>
        </p>
        <p>Buton calismazsa bu linki tarayicina yapistir:</p>
        <p style="word-break: break-all;">${loginUrl}</p>
      </div>
    `,
  });
}
