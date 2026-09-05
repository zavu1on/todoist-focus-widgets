import { getLoginErrorMessage } from "./getLoginErrorMessage";

describe("getLoginErrorMessage", () => {
  it("returns a friendly message for an authentication error", () => {
    const error = { isAuthenticationError: () => true };

    expect(getLoginErrorMessage(error)).toBe(
      "That token didn't work. Double-check it and try again.",
    );
  });

  it("returns a generic message for a non-authentication error", () => {
    const error = new Error("HTTP 500: Internal Server Error");

    expect(getLoginErrorMessage(error)).toBe(
      "Couldn't reach Todoist right now. Please try again.",
    );
  });

  it("returns a generic message for a value that isn't an error at all", () => {
    expect(getLoginErrorMessage("not an error")).toBe(
      "Couldn't reach Todoist right now. Please try again.",
    );
  });
});
