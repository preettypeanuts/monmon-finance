import { GLASS_FILL, GLASS_TILE_BASE } from "@/config/glass";
import type { MessageRole } from "@/types/chat";

export interface ChatBubbleStyle {
  surface: string;
  text: string;
}

/** Sync with `.chat-bubble-user` in globals.css — frosted primary fill + glass blur. */
export const CHAT_BUBBLE_USER = "chat-bubble-user";

export const CHAT_BUBBLE_STYLES: Record<MessageRole, ChatBubbleStyle> = {
  user: {
    surface: `${GLASS_TILE_BASE} ${CHAT_BUBBLE_USER}`,
    text: "text-primary-foreground font-semibold",
  },
  assistant: {
    surface: `${GLASS_TILE_BASE} border border-black/10 ${GLASS_FILL} dark:border-white/10`,
    text: "text-foreground",
  },
};
