import type { ReactElement } from "react";
import type { FilterCardViewModel } from "@/entities/filter";
import { PinWidget } from "./PinWidget";

type WidgetElement = ReactElement<{
  text?: string;
  clickAction?: string;
  children?: WidgetElement | WidgetElement[];
}>;

const baseViewModel: FilterCardViewModel = {
  filterId: 1,
  filterTitle: "Groceries",
  taskTitle: "Buy oat milk",
  taskUrl: "https://todoist.com/showTask?id=1",
  remainingCount: 3,
  priorityColor: "#D1453B",
  projectName: "Errands",
  projectColor: "#EB8909",
};

const isElement = (node: unknown): node is WidgetElement =>
  node !== null && typeof node === "object" && "props" in node;

// react-native-android-widget elements only ever describe RemoteViews and are
// never mounted, so this walks the plain element tree returned by the
// component instead of rendering it through react-test-renderer.
const collectElements = (node: unknown, acc: WidgetElement[] = []) => {
  if (Array.isArray(node)) {
    for (const child of node) {
      collectElements(child, acc);
    }

    return acc;
  }

  if (!isElement(node)) {
    return acc;
  }

  acc.push(node);
  collectElements(node.props.children, acc);

  return acc;
};

describe("PinWidget", () => {
  it("shows the error message instead of task content when errorMessage is set", () => {
    const elements = collectElements(
      PinWidget({ errorMessage: "Filter was removed." }),
    );
    const texts = elements.map((element) => element.props.text);

    expect(texts).toContain("Filter was removed.");
    expect(texts).not.toContain("Buy oat milk");
  });

  it("shows the task content when viewModel is set", () => {
    const elements = collectElements(PinWidget({ viewModel: baseViewModel }));
    const texts = elements.map((element) => element.props.text);

    expect(texts).toContain("Buy oat milk");
    expect(texts).toContain("Errands");
  });

  it("wires the reload icon to the RELOAD click action", () => {
    const elements = collectElements(PinWidget({ viewModel: baseViewModel }));
    const reloadWrapper = elements.find(
      (element) => element.props.clickAction === "RELOAD",
    );

    expect(reloadWrapper).toBeDefined();
  });
});
