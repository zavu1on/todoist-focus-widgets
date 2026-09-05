// Duck-typed instead of `instanceof TodoistRequestError` so this stays
// decoupled from the SDK's error class (and importable in tests without
// pulling in the SDK's ESM-only dependency tree).
type AuthenticationAwareError = {
  isAuthenticationError: () => boolean;
};

const isAuthenticationError = (
  error: unknown,
): error is AuthenticationAwareError =>
  typeof error === "object" &&
  error !== null &&
  "isAuthenticationError" in error &&
  typeof (error as AuthenticationAwareError).isAuthenticationError ===
    "function" &&
  (error as AuthenticationAwareError).isAuthenticationError();

export const getLoginErrorMessage = (error: unknown): string => {
  if (isAuthenticationError(error)) {
    return "That token didn't work. Double-check it and try again.";
  }

  return "Couldn't reach Todoist right now. Please try again.";
};
