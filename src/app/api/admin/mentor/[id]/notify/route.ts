import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { notifyMentorPendingQuestion } from "@/lib/mentor-questions";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const result = await notifyMentorPendingQuestion(id);
    return NextResponse.json({
      success: true,
      mentorReminderSentAt: result.mentorReminderSentAt.toISOString(),
      email: result.email,
    });
  } catch (err) {
    const code = err instanceof Error ? err.message : "";
    if (code === "NOT_FOUND") return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (code === "ALREADY_ANSWERED") {
      return NextResponse.json({ error: "Question is already answered" }, { status: 409 });
    }
    console.error("[admin/mentor/notify]", err);
    return NextResponse.json({ error: "Failed to notify mentor" }, { status: 500 });
  }
}
