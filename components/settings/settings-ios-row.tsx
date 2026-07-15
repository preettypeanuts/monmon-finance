import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { CaretRightIcon } from "@/lib/icons";
import {
  SETTINGS_IOS_ROW,
  SETTINGS_IOS_ROW_ICON,
  SETTINGS_IOS_ROW_LABEL,
  SETTINGS_IOS_ROW_VALUE,
} from "@/config/settings-ios";
import { cn } from "@/lib/utils";

interface SettingsIosRowProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value?: string;
  showChevron?: boolean;
  control?: ReactNode;
}

export const SettingsIosRow = forwardRef<HTMLButtonElement, SettingsIosRowProps>(
  function SettingsIosRow(
    {
      icon,
      iconClassName,
      label,
      value,
      showChevron = true,
      control,
      className,
      type = "button",
      onClick,
      ...props
    },
    ref,
  ) {
    const content = (
      <>
        <span className={cn(SETTINGS_IOS_ROW_ICON, iconClassName)}>{icon}</span>
        <span className={SETTINGS_IOS_ROW_LABEL}>{label}</span>
        {control ?? (
          <>
            {value ? <span className={SETTINGS_IOS_ROW_VALUE}>{value}</span> : null}
            {showChevron ? (
              <CaretRightIcon
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground/70"
              />
            ) : null}
          </>
        )}
      </>
    );

    if (control && onClick === undefined) {
      return <div className={cn(SETTINGS_IOS_ROW, className)}>{content}</div>;
    }

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        className={cn(SETTINGS_IOS_ROW, className)}
        {...props}
      >
        {content}
      </button>
    );
  },
);
