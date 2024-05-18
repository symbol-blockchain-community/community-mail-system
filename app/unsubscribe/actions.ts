"use server";

import { deleteMailFromCosmos } from "@/lib/cosmos-db";

export interface RegistEmailFormData {
  email: string;
  error: string;
  success: boolean;
}

export async function unregister(_: RegistEmailFormData, formData: FormData): Promise<RegistEmailFormData> {
  const email = formData.get("email");

  if (!email) {
    return {
      email: "",
      error: "Email is required",
      success: false,
    };
  }

  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (!emailPattern.test(email.toString())) {
    return {
      email: email.toString(),
      error: "Email is invalid",
      success: false,
    };
  }

  // 書き込み
  const result = await deleteMailFromCosmos(email.toString());
  if (result instanceof Error) {
    // 登録済みメールアドレスを攻撃者が認知できないように、成功時と同じメッセージを返す
    console.warn("DELETE ACTION FAILER", result.name, result.message);
  } else {
    console.log("DELETE ACTION SUCCESSFULLY", email);
  }

  return {
    email: "",
    error: "",
    success: true,
  };
}
