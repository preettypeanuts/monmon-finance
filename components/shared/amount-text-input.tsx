"use client";

import { FORM_FIELD_INPUT } from "@/config/form-dialog";
import { cn } from "@/lib/utils";

interface AmountTextInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "inputMode"> {
  className?: string;
}

export function AmountTextInput({
  className,
  autoComplete = "off",
  spellCheck = false,
  ...props
}: AmountTextInputProps) {
  return (
    <input
      type="text"
      inputMode="text"
      autoComplete={autoComplete}
      spellCheck={spellCheck}
      className={cn(FORM_FIELD_INPUT, "tabular-nums", className)}
      {...props}
    />
  );
}
