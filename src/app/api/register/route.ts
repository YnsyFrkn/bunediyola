import { createUserAccount } from "@/lib/userRegistration";
import { registerSchema } from "@/validations/registerSchema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          message: "Formu kontrol edip tekrar dene.",
          errors: parsed.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const result = await createUserAccount({
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
    });

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: result.message,
          errors: {
            email: [result.message],
          },
        },
        {
          status: 409,
        },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Hesabin olusturuldu.",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Kullanici kaydi olusturulamadi", error);

    return Response.json(
      {
        success: false,
        message: "Hesap olusturulamadi. Lutfen tekrar dene.",
      },
      {
        status: 500,
      },
    );
  }
}
