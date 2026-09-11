import { render } from "@testing-library/react-native";
import { SkeletonBlock } from "./SkeletonBlock";

describe("SkeletonBlock", () => {
  it("renders with the given dimensions", async () => {
    const view = await render(
      <SkeletonBlock width={120} height={40} borderRadius={12} />,
    );

    expect(view.toJSON()).toBeTruthy();
  });

  it("merges a custom style with the defaults", async () => {
    const view = await render(<SkeletonBlock style={{ marginTop: 8 }} />);

    expect(view.toJSON()).toBeTruthy();
  });
});
