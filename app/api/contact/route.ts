import { NextResponse } from "next/server";
import { contact } from "@/lib/content";

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  projectType?: string;
  timeline?: string;
  message?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const company = body.company?.trim() ?? "";
  const projectType = body.projectType?.trim() ?? "";
  const timeline = body.timeline?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const subject = `BellBit inquiry — ${company || name}`;
  const formattedMessage = [
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : null,
    `Project focus: ${projectType}`,
    `Timeline: ${timeline}`,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(`https://formsubmit.co/ajax/${contact.email}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      company,
      projectType,
      timeline,
      message: formattedMessage,
      _subject: subject,
      _template: "table",
      _captcha: "false",
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Unable to send message." }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
