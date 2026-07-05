import { GLASS_FILL, GLASS_TILE_BASE } from "@/config/glass";
import type { MessageRole } from "@/types/chat";

export interface ChatBubbleStyle {
  surface: string;
  text: string;
}

export const CHAT_BUBBLE_STYLES: Record<MessageRole, ChatBubbleStyle> = {
  user: {
    surface: `${GLASS_TILE_BASE} border border-primary/40 bg-primary/70 backdrop-brightness-130 backdrop-saturate-150 dark:border-primary/45 dark:bg-primary/92`,
    text: "text-white font-semibold",
  },
  assistant: {
    surface: `${GLASS_TILE_BASE} border border-black/10 ${GLASS_FILL} dark:border-white/10`,
    text: "text-foreground",
  },
};
