const SIDEBAR_COOKIE_KEY = "sidebar_state";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

interface CookieStore {
  get(name: string): { value: string } | undefined;
}

export function readServerSidebarOpen(cookieStore: CookieStore): boolean {
  const raw = cookieStore.get(SIDEBAR_COOKIE_KEY)?.value;

  if (raw === "true") {
    return true;
  }

  if (raw === "false") {
    return false;
  }

  return true;
}

export function writeClientSidebarCookie(open: boolean): void {
  document.cookie = `${SIDEBAR_COOKIE_KEY}=${open};path=/;max-age=${COOKIE_MAX_AGE_SECONDS};samesite=lax`;
}
