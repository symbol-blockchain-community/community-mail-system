import { authOptions } from "@/lib/auth_options";
import { markdownToHtml } from "@/lib/markdown";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import markdownToTxt from "markdown-to-text";
import nodemailer from "nodemailer";
import { getMailFromCosmos } from "@/lib/cosmos-db";
import { getGroupsFromEntraId } from "@/lib/entra-id";

type Params = {
  subject: string;
  value: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.AWS_SES_SMTP_ENDPOINT,
  port: 465,
  secure: true,
  auth: {
    user: process.env.AWS_SES_SMTP_USER,
    pass: process.env.AWS_SES_SMTP_PASSWORD,
  },
});

/** send email */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const currentGroupIds: string[] | Error = await getGroupsFromEntraId(session.accessToken);

  if (currentGroupIds instanceof Error) {
    return NextResponse.json({ message: "Failed to get user groups" }, { status: 403 });
  }

  if (!currentGroupIds.includes(process.env.AZURE_AD_GROUP_ID || "--------")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const json = (await req.json()) as Params;

  if (!json.value || !json.subject) {
    return NextResponse.json({ message: "value is required" }, { status: 400 });
  }

  // メーリングリストのデータを取得
  const result = await getMailFromCosmos();

  if (result instanceof Error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }

  if (result.length === 0) {
    return NextResponse.json({ message: "No email address" }, { status: 400 });
  }

  console.log(`admin: ${session.user?.email}, value: ${json.value}, emails: ${result.length}`);

  // markdown to html
  const html = markdownToHtml(json.subject, json.value);

  const mailOptions = {
    from: "noreply@mail.symbol-community.com",
    bcc: result,
    subject: json.subject,
    text: markdownToTxt(json.value),
    html: html,
  };

  // メールを送信する
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("メールの送信中にエラーが発生しました:", error);
    } else {
      console.log("メールが正常に送信されました:", info.response);
    }
  });

  return NextResponse.json({ message: "hello from login action" });
}
