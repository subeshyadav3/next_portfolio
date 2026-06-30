import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SITE_URL } from '@/lib/site-config';

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_DOMAIN = SITE_URL.replace('https://', '');

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, message } = body;

  try {
    const data = await resend.emails.send({
      from: `Subesh <info@${SITE_DOMAIN}>`,
      to: 'subeshgaming@gmail.com',
      replyTo: email,
      subject: 'New Contact Form Message',
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
