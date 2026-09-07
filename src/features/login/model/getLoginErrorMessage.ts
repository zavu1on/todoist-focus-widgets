// Duck-typed instead of `instanceof TodoistRequestError` so this stays
// decoupled from the SDK's error class (and importable in tests without
// pulling in the SDK's ESM-only dependency tree).
type AuthenticationAwareError = {
  isAuthenticationError: () => boolean;
};

const hasIsAuthenticationErrorMethod = (
  error: unknown,
): error is AuthenticationAwareError =>
  typeof error === "object" &&
  error !== null &&
  typeof (error as AuthenticationAwareError).isAuthenticationError ===
    "function";

const isAuthenticationError = (error: unknown): boolean =>
  hasIsAuthenticationErrorMethod(error) && error.isAuthenticationError();

export const getLoginErrorMessage = (error: unknown): string => {
  if (isAuthenticationError(error)) {
    return "That token didn't work. Double-check it and try again.";
  }

  return "Couldn't reach Todoist right now. Please try again.";
};
