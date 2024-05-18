import { deleteMailFromCosmos } from "@/lib/cosmos-db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  email: string;
};

/** delete mail */
export async function DELETE(req: NextRequest) {
  const json = (await req.json()) as Params;

  if (!json.email) {
    return NextResponse.json({ message: "email is required" }, { status: 400 });
  }

  const result = await deleteMailFromCosmos(json.email);

  const message = "Delete email successfully";
  if (result instanceof Error) {
    // 登録済みメールアドレスを攻撃者が認知できないように、成功時と同じメッセージを返す
    console.warn("DELETE ACTION FAILER", result.name, result.message);
    return NextResponse.json({ message });
  } else {
    console.log("DELETE ACTION SUCCESSFULLY", json.email);
    return NextResponse.json({ message });
  }
}
