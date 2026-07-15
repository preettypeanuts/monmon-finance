"use client";

import { SettingsNestedDrawerBack } from "@/components/settings/settings-nested-drawer-back";
import {
  NestedDrawer,
  PICKER_NESTED_DRAWER_SURFACE,
} from "@/components/shared/nested-drawer";
import { DrawerClose } from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FORM_FIELD_SELECT } from "@/config/form-dialog";
import { PLANNER_SELECT_TRIGGER } from "@/config/planner-manage";
import {
  SETTINGS_IOS_SUB_HEADER,
  SETTINGS_IOS_SUB_TITLE,
} from "@/config/settings-ios";
import { useIsMobileViewport } from "@/hooks/use-is-mobile-viewport";
import { CaretDownIcon, CheckIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface FormOptionPickerOption {
  value: string;
  label: string;
}

interface FormOptionPickerProps {
  value: string;
  options: readonly FormOptionPickerOption[];
  onChange: (value: string) => void;
  title: string;
  backLabel?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  placeholder?: string;
  /** Mobile: stack picker inside a parent drawer. */
  nestedInDrawer?: boolean;
}

function resolveOptionLabel(
  value: string,
  options: readonly FormOptionPickerOption[],
  placeholder: string,
): string {
  if (!value) {
    return placeholder;
  }

  return options.find((option) => option.value === value)?.label ?? value;
}

function OptionRow({
  label,
  selected,
  onSelect,
  disabled,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}) {
  return (
    <DrawerClose
      render={
        <button
          type="button"
          role="option"
          aria-selected={selected}
          disabled={disabled}
          onClick={onSelect}
          className={cn(
            "flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-[17px] transition-colors active:bg-foreground/5 disabled:opacity-50",
            selected && "bg-accent font-medium",
          )}
        >
          <span className="min-w-0 truncate">{label}</span>
          {selected ? (
            <CheckIcon className="size-4 shrink-0 text-muted-foreground" />
          ) : null}
        </button>
      }
    />
  );
}

export function FormOptionPicker({
  value,
  options,
  onChange,
  title,
  backLabel,
  disabled = false,
  id,
  className,
  placeholder = "Pilih",
  nestedInDrawer = false,
}: FormOptionPickerProps) {
  const isMobile = useIsMobileViewport();
  const useNestedDrawer = isMobile && nestedInDrawer;
  const selectedLabel = resolveOptionLabel(value, options, placeholder);
  const triggerClassName = cn(
    FORM_FIELD_SELECT,
    PLANNER_SELECT_TRIGGER,
    className,
  );

  if (!isMobile) {
    return (
      <Select
        value={value}
        disabled={disabled}
        onValueChange={(nextValue) => {
          if (nextValue) {
            onChange(nextValue);
          }
        }}
      >
        <SelectTrigger id={id} className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (useNestedDrawer) {
    return (
      <NestedDrawer
        className={PICKER_NESTED_DRAWER_SURFACE}
        title={title}
        trigger={
          <button
            id={id}
            type="button"
            disabled={disabled}
            className={triggerClassName}
          >
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-left",
                !value && "text-muted-foreground",
              )}
            >
              {selectedLabel}
            </span>
            <CaretDownIcon className="size-4 shrink-0 text-muted-foreground" />
          </button>
        }
      >
        <header className={SETTINGS_IOS_SUB_HEADER}>
          <div className="absolute left-3">
            <SettingsNestedDrawerBack label={backLabel ?? title} />
          </div>
          <h2 className={SETTINGS_IOS_SUB_TITLE}>{title}</h2>
        </header>
        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(1rem+var(--mobile-safe-bottom))]"
          role="listbox"
          aria-label={title}
        >
          {options.map((option) => (
            <OptionRow
              key={option.value}
              disabled={disabled}
              label={option.label}
              selected={value === option.value}
              onSelect={() => onChange(option.value)}
            />
          ))}
        </div>
      </NestedDrawer>
    );
  }

  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={(nextValue) => {
        if (nextValue) {
          onChange(nextValue);
        }
      }}
    >
      <SelectTrigger id={id} className={triggerClassName}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
