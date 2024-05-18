"use client";

import { RegistEmailFormData } from "@/app/unsubscribe/actions";
import { unregister } from "@/app/unsubscribe/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormState, useFormStatus } from "react-dom";

export const initlaState: RegistEmailFormData = {
  email: "",
  error: "",
  success: false,
};

export default function UnRegisterForm(): JSX.Element {
  const [state, formAction] = useFormState(unregister, initlaState);
  const status = useFormStatus();

  return (
    <form action={formAction} className="flex flex-col justify-center items-center space-y-6 max-w-xl w-full">
      <Input name="email" type="email" placeholder="email" required disabled={state.success} />
      <Button type="submit" className="px-10" disabled={status.pending || state.success}>
        UnSubscribe
      </Button>
      {state.error && <p className="text-red-500">{state.error}</p>}
      {state.success && <p className="text-blue-500">{"Success!!"}</p>}
    </form>
  );
}
