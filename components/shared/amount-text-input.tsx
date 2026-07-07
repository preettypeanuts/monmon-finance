"use client";

import { useEffect, useState } from "react";

import { FORM_FIELD_INPUT } from "@/config/form-dialog";
import { formatAmountInput } from "@/lib/finance/format-amount-input";
import { cn } from "@/lib/utils";

interface AmountTextInputProps
  extends Omit<
    React.ComponentProps<"input">,
    "type" | "inputMode" | "onInput" | "onChange"
  > {
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void;
}

export function AmountTextInput({
  className,
  autoComplete = "off",
  spellCheck = false,
  value,
  defaultValue,
  onChange,
  onInput,
  ...props
}: AmountTextInputProps) {
  const isControlled = value !== undefined;
  const [displayValue, setDisplayValue] = useState(() =>
    formatAmountInput(String(defaultValue ?? value ?? "")),
  );

  useEffect(() => {
    if (!isControlled) {
      return;
    }

    setDisplayValue(formatAmountInput(String(value ?? "")));
  }, [isControlled, value]);

  function applyFormattedValue(
    event: React.FormEvent<HTMLInputElement>,
    formatted: string,
  ) {
    setDisplayValue(formatted);
    event.currentTarget.value = formatted;
  }

  function handleInput(event: React.FormEvent<HTMLInputElement>) {
    const formatted = formatAmountInput(event.currentTarget.value);
    applyFormattedValue(event, formatted);
    onInput?.(event);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete={autoComplete}
      spellCheck={spellCheck}
      value={displayValue}
      onInput={handleInput}
      onChange={handleChange}
      className={cn(FORM_FIELD_INPUT, "tabular-nums", className)}
      {...props}
    />
  );
}
