"use client";

import { useState } from "react";

import { SettingsNestedDrawerBack } from "@/components/settings/settings-nested-drawer-back";
import {
  NestedDrawer,
  PICKER_NESTED_DRAWER_SURFACE,
} from "@/components/shared/nested-drawer";
import { Calendar } from "@/components/ui/calendar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FORM_FIELD_DATE } from "@/config/form-dialog";
import { MOBILE_BOTTOM_DRAWER_POPUP } from "@/config/mobile-layout";
import {
  SETTINGS_IOS_SUB_HEADER,
  SETTINGS_IOS_SUB_TITLE,
} from "@/config/settings-ios";
import { UI_LABEL_DATE } from "@/config/ui-labels";
import { useIsMobileViewport } from "@/hooks/use-is-mobile-viewport";
import {
  dateInputFromCalendarDate,
  parseDayKey,
} from "@/lib/finance/day-range";
import { formatJournalDate } from "@/lib/finance/format-datetime";
import { CalendarBlankIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const DATE_PICKER_TITLE = "Pilih tanggal";
const DATE_PICKER_DESC = "Pilih tanggal transaksi.";

interface FormDatePickerProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  /** Mobile: stack calendar inside a parent drawer. */
  nestedInDrawer?: boolean;
  backLabel?: string;
}

function dateFromInputValue(value: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return undefined;
  }

  return parseDayKey(value);
}

function DatePickerTrigger({
  id,
  disabled,
  className,
  open,
  selected,
  placeholder,
  onClick,
}: {
  id: string;
  disabled?: boolean;
  className?: string;
  open: boolean;
  selected?: Date;
  placeholder: string;
  onClick?: () => void;
}) {
  return (
    <button
      id={id}
      type="button"
      disabled={disabled}
      aria-expanded={open}
      onClick={onClick}
      className={cn(FORM_FIELD_DATE, className)}
    >
      <span
        className={cn("min-w-0 truncate", !selected && "text-muted-foreground")}
      >
        {selected ? formatJournalDate(selected) : placeholder}
      </span>
      <CalendarBlankIcon className="size-4 shrink-0 text-muted-foreground" />
    </button>
  );
}

function DatePickerCalendar({
  selected,
  onSelect,
}: {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
}) {
  return (
    <Calendar
      className="mx-auto rounded-xl border border-black/8 bg-white/70 p-2 dark:border-white/12 dark:bg-white/8"
      defaultMonth={selected ?? new Date()}
      mode="single"
      selected={selected}
      onSelect={onSelect}
    />
  );
}

export function FormDatePicker({
  id,
  name,
  value,
  onChange,
  required,
  disabled,
  placeholder = DATE_PICKER_TITLE,
  className,
  nestedInDrawer = false,
  backLabel = UI_LABEL_DATE,
}: FormDatePickerProps) {
  const isMobile = useIsMobileViewport();
  const useNestedDrawer = isMobile && nestedInDrawer;
  const [open, setOpen] = useState(false);
  const selected = dateFromInputValue(value);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
  }

  function handleSelect(date: Date | undefined) {
    if (!date) {
      return;
    }

    onChange(dateInputFromCalendarDate(date));
    setOpen(false);
  }

  const trigger = (
    <DatePickerTrigger
      className={className}
      disabled={disabled}
      id={id}
      open={open}
      placeholder={placeholder}
      selected={selected}
    />
  );

  const hiddenInput = (
    <input type="hidden" name={name} value={value} required={required} />
  );

  if (useNestedDrawer) {
    return (
      <>
        <NestedDrawer
          className={PICKER_NESTED_DRAWER_SURFACE}
          onOpenChange={handleOpenChange}
          open={open}
          title={DATE_PICKER_TITLE}
          trigger={trigger}
        >
          <header className={SETTINGS_IOS_SUB_HEADER}>
            <div className="absolute left-3">
              <SettingsNestedDrawerBack label={backLabel} />
            </div>
            <h2 className={SETTINGS_IOS_SUB_TITLE}>{DATE_PICKER_TITLE}</h2>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[calc(1rem+var(--mobile-safe-bottom))] pt-2">
            <DatePickerCalendar onSelect={handleSelect} selected={selected} />
          </div>
        </NestedDrawer>
        {hiddenInput}
      </>
    );
  }

  if (isMobile) {
    return (
      <>
        <DatePickerTrigger
          className={className}
          disabled={disabled}
          id={id}
          open={open}
          placeholder={placeholder}
          selected={selected}
          onClick={() => setOpen(true)}
        />
        <Drawer onOpenChange={handleOpenChange} open={open} showSwipeHandle>
          <DrawerContent
            className={cn(
              MOBILE_BOTTOM_DRAWER_POPUP,
              "mt-0! gap-0 overflow-hidden border-0 bg-popover px-0",
            )}
          >
            <DrawerHeader className="border-b border-black/6 pb-3 text-left dark:border-white/8">
              <DrawerTitle>{DATE_PICKER_TITLE}</DrawerTitle>
              <DrawerDescription>{DATE_PICKER_DESC}</DrawerDescription>
            </DrawerHeader>
            <div className="px-3 pb-[calc(1rem+var(--mobile-safe-bottom))] pt-2">
              <DatePickerCalendar onSelect={handleSelect} selected={selected} />
            </div>
          </DrawerContent>
        </Drawer>
        {hiddenInput}
      </>
    );
  }

  return (
    <>
      <Popover onOpenChange={handleOpenChange} open={open}>
        <PopoverTrigger
          id={id}
          type="button"
          disabled={disabled}
          className={cn(FORM_FIELD_DATE, className)}
        >
          <span
            className={cn(
              "min-w-0 truncate",
              !selected && "text-muted-foreground",
            )}
          >
            {selected ? formatJournalDate(selected) : placeholder}
          </span>
          <CalendarBlankIcon className="size-4 shrink-0 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <DatePickerCalendar onSelect={handleSelect} selected={selected} />
        </PopoverContent>
      </Popover>
      {hiddenInput}
    </>
  );
}
