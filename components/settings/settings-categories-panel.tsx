"use client";

import { useMemo, useState, useTransition } from "react";

import {
  CategoryFormDialog,
  type CategoryFormMode,
} from "@/components/settings/category-form-dialog";
import { SettingsIosRow } from "@/components/settings/settings-ios-row";
import { SettingsIosSection } from "@/components/settings/settings-ios-section";
import { SettingsSubHeader } from "@/components/settings/settings-sub-header";
import { JournalCategoryIcon } from "@/components/journal/journal-category-icon";
import { useUserCategoryCatalog } from "@/components/providers/user-category-catalog-provider";
import { Button } from "@/components/ui/button";
import {
  SETTINGS_CATEGORIES,
  SETTINGS_CATEGORIES_ADD,
  SETTINGS_CATEGORIES_CUSTOM,
  SETTINGS_CATEGORIES_DEFAULT,
  SETTINGS_CATEGORIES_DELETE,
  SETTINGS_CATEGORIES_FOOTER,
  SETTINGS_CATEGORIES_RESET,
} from "@/config/settings-labels";
import { SETTINGS_IOS_ICON_ACCENT, SETTINGS_IOS_SUB_SCROLL } from "@/config/settings-ios";
import { PlusIcon } from "@/lib/icons";

interface SettingsCategoriesPanelProps {
  onBack: () => void;
}

export function SettingsCategoriesPanel({ onBack }: SettingsCategoriesPanelProps) {
  const { catalog, deleteCategory, resetCategory } = useUserCategoryCatalog();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CategoryFormMode | null>(null);
  const [isPending, startTransition] = useTransition();

  const { defaultCategories, customCategories } = useMemo(() => {
    return {
      defaultCategories: catalog.filter((entry) => !entry.isCustom),
      customCategories: catalog.filter((entry) => entry.isCustom),
    };
  }, [catalog]);

  function openCustomForm() {
    setFormMode({ kind: "custom-new" });
    setFormOpen(true);
  }

  function openEditForm(entry: (typeof catalog)[number]) {
    if (entry.isCustom) {
      if (!entry.recordId) {
        return;
      }
      setFormMode({
        kind: "custom-edit",
        recordId: entry.recordId,
        entry,
      });
    } else {
      setFormMode({
        kind: "builtin-edit",
        slug: entry.id,
        entry,
      });
    }
    setFormOpen(true);
  }

  function handleDelete(recordId: string) {
    startTransition(async () => {
      await deleteCategory(recordId);
    });
  }

  function handleReset(slug: string) {
    startTransition(async () => {
      await resetCategory(slug);
    });
  }

  return (
    <>
      <SettingsSubHeader title={SETTINGS_CATEGORIES} onBack={onBack} />
      <section className={SETTINGS_IOS_SUB_SCROLL}>
        <SettingsIosSection footer={SETTINGS_CATEGORIES_FOOTER}>
          <SettingsIosRow
            icon={<PlusIcon aria-hidden />}
            iconClassName={SETTINGS_IOS_ICON_ACCENT}
            label={SETTINGS_CATEGORIES_ADD}
            onClick={openCustomForm}
          />
        </SettingsIosSection>

        <SettingsIosSection label={SETTINGS_CATEGORIES_DEFAULT}>
          {defaultCategories.map((entry) => (
            <SettingsIosRow
              key={entry.id}
              icon={
                <JournalCategoryIcon
                  category={entry.id}
                  type={entry.type}
                  iconOverride={entry.icon}
                  className="size-7 shrink-0"
                />
              }
              iconClassName="bg-transparent p-0"
              label={entry.label}
              value={entry.recordId ? "Edited" : undefined}
              onClick={() => openEditForm(entry)}
              control={
                <div className="flex items-center gap-2">
                  {entry.recordId ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      className="h-7 px-2 text-[11px] text-muted-foreground"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleReset(entry.id);
                      }}
                    >
                      {SETTINGS_CATEGORIES_RESET}
                    </Button>
                  ) : null}
                </div>
              }
            />
          ))}
        </SettingsIosSection>

        {customCategories.length > 0 ? (
          <SettingsIosSection label={SETTINGS_CATEGORIES_CUSTOM}>
            {customCategories.map((entry) => (
              <SettingsIosRow
                key={entry.id}
                icon={
                  <JournalCategoryIcon
                    category={entry.id}
                    type={entry.type}
                    iconOverride={entry.icon}
                    className="size-7 shrink-0"
                  />
                }
                iconClassName="bg-transparent p-0"
                label={entry.label}
                onClick={() => openEditForm(entry)}
                control={
                  entry.recordId ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      className="h-7 px-2 text-[11px] text-destructive"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(entry.recordId!);
                      }}
                    >
                      {SETTINGS_CATEGORIES_DELETE}
                    </Button>
                  ) : null
                }
              />
            ))}
          </SettingsIosSection>
        ) : null}
      </section>

      <CategoryFormDialog
        open={formOpen}
        mode={formMode}
        onOpenChange={setFormOpen}
      />
    </>
  );
}
