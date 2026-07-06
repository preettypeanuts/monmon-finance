import {
  INBOX_MOBILE_BOTTOM_BLUR,
  INBOX_MOBILE_TOP_BLUR,
} from "@/config/inbox-mobile";

export function InboxMobileEdgeBlur() {
  return (
    <>
      <div aria-hidden className={INBOX_MOBILE_TOP_BLUR} />
      <div aria-hidden className={INBOX_MOBILE_BOTTOM_BLUR} />
    </>
  );
}
