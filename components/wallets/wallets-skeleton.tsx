import { Skeleton } from "@/components/ui/skeleton";
import {
  WALLETS_CARD_ASPECT_RATIO,
  WALLETS_STACK_CARD_RADIUS,
  WALLETS_STACK_CONTAINER,
  WALLETS_STACK_DOTS,
  WALLETS_STACK_PEEK_RATIO,
  WALLETS_STACK_SHELL,
  WALLETS_STACK_SHADOW_BLEED_PX,
  WALLETS_VIEW_BOTTOM_PADDING,
  getWalletStackHeightPx,
} from "@/config/wallets-stack";
import { cn } from "@/lib/utils";

const SKELETON_WIDTH = 358;
const SKELETON_CARD_COUNT = 3;
const cardHeight = SKELETON_WIDTH / WALLETS_CARD_ASPECT_RATIO;
const step = cardHeight * WALLETS_STACK_PEEK_RATIO;
const stackHeight = getWalletStackHeightPx(
  SKELETON_CARD_COUNT,
  cardHeight,
  step,
);

export function WalletsSkeleton() {
  return (
    <div className={cn("flex flex-col gap-5", WALLETS_VIEW_BOTTOM_PADDING)}>
      <div className={cn(WALLETS_STACK_CONTAINER, "flex flex-col gap-4")}>
        <Skeleton className="h-14 w-full rounded-2xl" />

        <div
          className={WALLETS_STACK_SHELL}
          style={{
            height: stackHeight + WALLETS_STACK_SHADOW_BLEED_PX,
            paddingBottom: WALLETS_STACK_SHADOW_BLEED_PX,
          }}
        >
          {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
            <Skeleton
              key={index}
              className={cn(
                "absolute left-0 right-0 w-full",
                WALLETS_STACK_CARD_RADIUS,
              )}
              style={{
                bottom: index * step,
                height: cardHeight,
                zIndex: SKELETON_CARD_COUNT - index,
              }}
            />
          ))}
        </div>

        <div className={WALLETS_STACK_DOTS}>
          {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
            <Skeleton key={index} className="size-1.5 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
