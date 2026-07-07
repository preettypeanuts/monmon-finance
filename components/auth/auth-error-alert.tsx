interface AuthErrorAlertProps {
  message: string;
}

export function AuthErrorAlert({ message }: AuthErrorAlertProps) {
  return (
    <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}
