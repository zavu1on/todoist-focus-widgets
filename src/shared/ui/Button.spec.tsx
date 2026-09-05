import { fireEvent, render, screen } from "@testing-library/react-native";
import { Button } from "./Button";

describe("Button", () => {
  it("calls onPress when pressed", async () => {
    const onPress = jest.fn();
    await render(<Button label="Connect" onPress={onPress} />);

    fireEvent.press(screen.getByRole("button", { name: "Connect" }));

    expect(onPress).toHaveBeenCalled();
  });

  it("shows a loading indicator and ignores presses while loading", async () => {
    const onPress = jest.fn();
    await render(<Button label="Connect" onPress={onPress} loading />);

    expect(screen.queryByText("Connect")).toBeNull();
    fireEvent.press(screen.getByRole("button"));
    expect(onPress).not.toHaveBeenCalled();
  });
});
