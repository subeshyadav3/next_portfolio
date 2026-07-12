import { NextResponse } from "next/server";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = emailSchema.parse(body);

    // Placeholder: In production, connect to Resend audience API
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID });

    return NextResponse.json(
      { success: true, message: "Subscribed successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
