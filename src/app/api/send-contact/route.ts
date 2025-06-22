import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { email, message } = await req.json();

  console.log('EMAIL_USER:', process.env.EMAIL_USER); // For debugging
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Loaded' : 'Not Loaded'); // For debugging

  if (!email || !message) {
    return NextResponse.json({ error: "Email and message are required" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Lazify Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Lazify Contact Form Message`,
      text: `From: ${email}\n\n${message}`,
      replyTo: email,
    });
    return NextResponse.json({ ok: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
} 