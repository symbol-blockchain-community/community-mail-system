import { NextRequest, NextResponse } from "next/server";
import { setMailToCosmos } from "@/lib/cosmos-db";

type Params = {
  email: string;
};

/** add email */
export async function POST(req: NextRequest) {
  const json = (await req.json()) as Params;

  if (!json.email) {
    return NextResponse.json({ message: "email is required" }, { status: 400 });
  }

  // 正規表現により email の形式が正しいかチェック
  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (!emailPattern.test(json.email)) {
    return NextResponse.json({ message: "email is invalid" }, { status: 400 });
  }

  // 書き込み
  const result = await setMailToCosmos(json.email);

  const message = "Register email successfully";
  if (result instanceof Error) {
    // 登録済みメールアドレスを攻撃者が認知できないように、成功時と同じメッセージを返す
    console.warn("ADD ACTION FAILER", result.name, result.message);
    return NextResponse.json({ message });
  } else {
    console.log("ADD ACTION SUCCESSFULLY", json.email);
    return NextResponse.json({ message });
  }
}
