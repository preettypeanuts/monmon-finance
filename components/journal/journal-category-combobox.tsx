"use client";

import { useMemo, useState } from "react";

import { JournalCategoryIcon } from "@/components/journal/journal-category-icon";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { TransactionCategoryId } from "@/config/categories";
import { FORM_FIELD_SELECT } from "@/config/form-dialog";
import { PLANNER_SELECT_TRIGGER } from "@/config/planner-manage";
import {
  filterCategoryMentionOptionsForType,
  getCategoryMentionOptionsForType,
} from "@/lib/chat/category-mentions";
import { CaretDownIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { TransactionType } from "@/types/transaction";

interface JournalCategoryComboboxProps {
  id?: string;
  type: TransactionType;
  value: TransactionCategoryId;
  onChange: (value: TransactionCategoryId) => void;
  className?: string;
}

export function JournalCategoryCombobox({
  id,
  type,
  value,
  onChange,
  className,
}: JournalCategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const typeOptions = useMemo(
    () => getCategoryMentionOptionsForType(type),
    [type],
  );

  const filteredOptions = useMemo(
    () => filterCategoryMentionOptionsForType(search, type),
    [search, type],
  );

  const selectedOption = typeOptions.find((option) => option.id === value);

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setSearch("");
        }
      }}
    >
      <PopoverTrigger
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        className={cn(FORM_FIELD_SELECT, PLANNER_SELECT_TRIGGER, className)}
      >
        {selectedOption ? (
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <JournalCategoryIcon
              category={selectedOption.id}
              type={type}
              className="size-6 shrink-0 rounded-lg"
            />
            <span className="truncate">{selectedOption.label}</span>
          </span>
        ) : (
          <span className="text-muted-foreground">Pilih kategori</span>
        )}
        <CaretDownIcon className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari kategori..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Kategori tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.id}
                  onSelect={() => {
                    onChange(option.id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="items-start gap-2.5 py-2"
                >
                  <JournalCategoryIcon
                    category={option.id}
                    type={type}
                    className="size-8 shrink-0 rounded-xl"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-foreground/90">
                        {option.label}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                        @{option.token}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                      Ketik @{option.token} untuk memilih kategori ini
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
