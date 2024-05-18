import { authOptions } from "@/lib/auth_options";
import { markdownToHtml } from "@/lib/markdown";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  subject: string;
  value: string;
};

/** send email */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const json = (await req.json()) as Params;

  if (!json.value || !json.subject) {
    return NextResponse.json({ message: "value is required" }, { status: 400 });
  }

  // markdown to html
  const html = markdownToHtml(json.subject, json.value);
  return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
}
