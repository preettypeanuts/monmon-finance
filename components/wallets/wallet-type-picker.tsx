"use client";

import {
  WALLET_TYPE_PICKER_GRID,
  WALLET_TYPE_PICKER_ICON_IDLE,
  WALLET_TYPE_PICKER_ICON_SELECTED,
  WALLET_TYPE_PICKER_ITEM,
  WALLET_TYPE_PICKER_ITEM_IDLE,
  WALLET_TYPE_PICKER_ITEM_SELECTED,
} from "@/config/wallet-type-picker";
import {
  WALLET_FORM_TYPE,
  WALLET_TYPE_LABELS,
  WALLET_TYPE_ORDER,
} from "@/config/wallet-labels";
import {
  BuildingIcon,
  CurrencyCircleDollarIcon,
  type Icon,
  SmartphoneIcon,
  WalletIcon,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { WalletType } from "@/types/wallet";

const WALLET_TYPE_ICONS: Record<WalletType, Icon> = {
  ewallet: SmartphoneIcon,
  bank: BuildingIcon,
  cash: CurrencyCircleDollarIcon,
  other: WalletIcon,
};

interface WalletTypePickerProps {
  value: WalletType;
  onChange: (type: WalletType) => void;
}

export function WalletTypePicker({ value, onChange }: WalletTypePickerProps) {
  return (
    <div
      className={WALLET_TYPE_PICKER_GRID}
      role="tablist"
      aria-label={WALLET_FORM_TYPE}
    >
      {WALLET_TYPE_ORDER.map((walletType) => {
        const IconComponent = WALLET_TYPE_ICONS[walletType];
        const selected = value === walletType;

        return (
          <button
            key={walletType}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(walletType)}
            className={cn(
              WALLET_TYPE_PICKER_ITEM,
              selected
                ? WALLET_TYPE_PICKER_ITEM_SELECTED
                : WALLET_TYPE_PICKER_ITEM_IDLE,
            )}
          >
            <IconComponent
              className={cn(
                "size-5 shrink-0",
                selected
                  ? WALLET_TYPE_PICKER_ICON_SELECTED
                  : WALLET_TYPE_PICKER_ICON_IDLE,
              )}
              aria-hidden
            />
            <span>{WALLET_TYPE_LABELS[walletType]}</span>
          </button>
        );
      })}
    </div>
  );
}
