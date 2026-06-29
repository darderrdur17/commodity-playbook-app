import { NextResponse } from "next/server";
import { listDemoEmails, demoEmailKindLabel } from "@/lib/demo-email-log";

export const dynamic = "force-dynamic";

export async function GET() {
  const emails = await listDemoEmails(25);
  return NextResponse.json(
    emails.map((e) => ({
      id: e.id,
      kind: e.kind,
      kindLabel: demoEmailKindLabel(e.kind),
      to: e.to,
      subject: e.subject,
      bodyText: e.bodyText,
      delivered: e.delivered,
      createdAt: e.createdAt.toISOString(),
    }))
  );
}
