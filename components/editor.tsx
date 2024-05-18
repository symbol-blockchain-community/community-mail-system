"use client";

import React, { useLayoutEffect } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PreviewDialog } from "@/components/preview";

export default function Editor() {
  const [subject, setSubject] = React.useState<string>("");
  const [value, setValue] = React.useState<string | undefined>("");
  const [preview, setPreview] = React.useState<string>("");

  /** markdown editor に light mode を矯正 */
  useLayoutEffect(() => document.documentElement.setAttribute("data-color-mode", "light"), []);

  /** メールの挿入要求 */
  const handleSubmit = async () => {
    const isCheck = confirm("送信して問題ありませんか？");
    if (isCheck) {
      await fetch("/api/send", {
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify({ value, subject }),
      });

      alert("送信しました");
      window.location.reload();
    } else {
      alert("送信をキャンセルしました");
    }
  };

  /** プレビュー受取 */
  const handlePreview = async () => {
    const res = await fetch("/api/preview", {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({ value, subject }),
    });
    setPreview(await res.text());
  };

  /** プレビュー閉じる */
  const handleClose = (open: boolean) => {
    !open ? setPreview("") : null;
  };

  return (
    <div className="flex flex-col space-y-3 w-full">
      <Input placeholder="メール件名" value={subject} onChange={(e) => setSubject(e.currentTarget.value)} />
      <div className="w-full">
        <MDEditor
          preview="edit"
          value={value}
          onChange={setValue}
          commands={[
            commands.bold,
            commands.italic,
            commands.hr,
            commands.title,
            commands.divider,
            commands.link,
            commands.code,
            commands.codeBlock,
            commands.image,
            commands.table,
            commands.divider,
            commands.orderedListCommand,
            commands.unorderedListCommand,
            commands.divider,
            commands.help,
          ]}
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]],
          }}
        />
      </div>
      <div className="flex flex-col justify-end space-y-3 sm:flex-row space-x-0 sm:space-x-3 sm:space-y-0">
        <Button variant="outline" className="min-w-40" onClick={handlePreview}>
          プレビュー
        </Button>
        <Button className="min-w-40" onClick={handleSubmit}>
          送信確定
        </Button>
      </div>
      <PreviewDialog content={preview} onClosed={handleClose} />
    </div>
  );
}
