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
import {
  UI_LABEL_ALL_WALLETS,
  UI_LABEL_FILTER,
  UI_LABEL_WALLET,
} from "@/config/ui-labels";
import { useIsMobileViewport } from "@/hooks/use-is-mobile-viewport";
import { CaretDownIcon, CheckIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { JournalWalletOption } from "@/types/journal";

interface JournalWalletPickerProps {
  value: string;
  options: JournalWalletOption[];
  onChange: (value: string) => void;
  backLabel?: string;
  includeAllOption?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  placeholder?: string;
  /** Mobile: stack picker inside a parent drawer. */
  nestedInDrawer?: boolean;
}

function resolveWalletLabel(
  value: string,
  options: JournalWalletOption[],
  includeAllOption: boolean,
  placeholder: string,
): string {
  if (!value) {
    return placeholder;
  }

  if (includeAllOption && value === "all") {
    return UI_LABEL_ALL_WALLETS;
  }

  return options.find((option) => option.id === value)?.name ?? value;
}

function WalletOptionRow({
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

export function JournalWalletPicker({
  value,
  options,
  onChange,
  backLabel = UI_LABEL_FILTER,
  includeAllOption = false,
  disabled = false,
  id,
  className,
  placeholder = "Pilih wallet",
  nestedInDrawer = false,
}: JournalWalletPickerProps) {
  const isMobile = useIsMobileViewport();
  const useNestedDrawer = isMobile && nestedInDrawer;
  const selectedLabel = resolveWalletLabel(
    value,
    options,
    includeAllOption,
    placeholder,
  );
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
          {includeAllOption ? (
            <SelectItem value="all">{UI_LABEL_ALL_WALLETS}</SelectItem>
          ) : null}
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
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
        title={UI_LABEL_WALLET}
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
            <SettingsNestedDrawerBack label={backLabel} />
          </div>
          <h2 className={SETTINGS_IOS_SUB_TITLE}>{UI_LABEL_WALLET}</h2>
        </header>
        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(1rem+var(--mobile-safe-bottom))]"
          role="listbox"
          aria-label={UI_LABEL_WALLET}
        >
          {includeAllOption ? (
            <WalletOptionRow
              disabled={disabled}
              label={UI_LABEL_ALL_WALLETS}
              selected={value === "all"}
              onSelect={() => onChange("all")}
            />
          ) : null}
          {options.map((option) => (
            <WalletOptionRow
              key={option.id}
              disabled={disabled}
              label={option.name}
              selected={value === option.id}
              onSelect={() => onChange(option.id)}
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
        {includeAllOption ? (
          <SelectItem value="all">{UI_LABEL_ALL_WALLETS}</SelectItem>
        ) : null}
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Wallet filter field — includes "All wallets" option. */
export function JournalFilterWalletPicker(
  props: Omit<JournalWalletPickerProps, "includeAllOption">,
) {
  return <JournalWalletPicker includeAllOption {...props} />;
}
