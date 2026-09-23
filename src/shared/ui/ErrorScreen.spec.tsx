import { fireEvent, render, screen } from "@testing-library/react-native";
import { ErrorScreen } from "./ErrorScreen";

describe("ErrorScreen", () => {
  it("hides the details line when there are none and calls onRetry", async () => {
    const onRetry = jest.fn();

    await render(<ErrorScreen title="Something broke." onRetry={onRetry} />);

    expect(screen.queryByText("disk I/O error")).toBeNull();

    fireEvent.press(screen.getByRole("button", { name: "Try again" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
