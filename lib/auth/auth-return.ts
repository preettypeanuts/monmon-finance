const AUTH_RETURN_PATH_KEY = "wang.auth-return-path";

export function markAuthReturnPath(path: string) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(AUTH_RETURN_PATH_KEY, path);
}

export function consumeAuthReturnPath(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const path = sessionStorage.getItem(AUTH_RETURN_PATH_KEY);

  if (!path) {
    return null;
  }

  sessionStorage.removeItem(AUTH_RETURN_PATH_KEY);
  return path;
}
