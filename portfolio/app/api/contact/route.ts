import { NextRequest, NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/site-config';

const SITE_DOMAIN = SITE_URL.replace('https://', '');

function getResend() {
  // Lazy init so the build doesn't fail when env var is missing
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Resend } = require('resend');
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const subjectLabels: Record<string, string> = {
      general: 'General Inquiry',
      content: 'Content Request / Suggestion',
      correction: 'Report an Error / Correction',
      collaboration: 'Collaboration / Partnership',
      technical: 'Technical Issue',
      other: 'Other',
    };

    const resend = getResend();
    const data = await resend.emails.send({
      from: `Neb Master Contact <info@${SITE_DOMAIN}>`,
      to: 'subeshgaming@gmail.com',
      replyTo: email,
      subject: `[Neb Master] ${subjectLabels[subject] || subject}: ${name}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Neb Master</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">New Contact Form Submission</p>
  </div>
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 120px;">Name:</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Email:</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;"><a href="mailto:${email}" style="color: #10b981; text-decoration: none;">${email}</a></td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Subject:</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${subjectLabels[subject] || subject}</td>
      </tr>
    </table>
    <div style="margin-top: 24px;">
      <p style="font-weight: 600; color: #374151; margin-bottom: 8px;">Message:</p>
      <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; white-space: pre-wrap; color: #1f2937;">${message}</div>
    </div>
    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
      <p>Sent from <a href="${SITE_URL}/blog/contact" style="color: #10b981;">Neb Master Contact Form</a></p>
      <p>Reply directly to this email to respond to ${name}</p>
    </div>
  </div>
</body>
</html>
      `.trim(),
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
  }
}