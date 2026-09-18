import { openDatabaseAsync } from "expo-sqlite";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import { Filter } from "../models/filter";
import { PinWidget } from "../ui/PinWidget";
import { getAndClearPendingWidgetFilterId } from "./getAndClearPendingWidgetFilterId";
import { getFilters } from "./getFilters";
import { widgetTaskHandler } from "./widgetTaskHandler";

jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: jest.fn().mockResolvedValue({
    closeAsync: jest.fn().mockResolvedValue(undefined),
  }),
}));

jest.mock("./getAndClearPendingWidgetFilterId");
jest.mock("./getFilters");

jest.mock("@/entities/task", () => ({
  ...jest.requireActual("@/entities/task"),
  getTasks: jest.fn().mockResolvedValue([]),
}));

jest.mock("@/entities/project", () => ({
  ...jest.requireActual("@/entities/project"),
  getProjects: jest.fn().mockResolvedValue([]),
}));

afterEach(() => {
  jest.clearAllMocks();
});

const buildProps = (
  overrides: Partial<WidgetTaskHandlerProps>,
): WidgetTaskHandlerProps => ({
  widgetInfo: {
    widgetName: "Pin",
    widgetId: 1,
    width: 180,
    height: 180,
    screenInfo: {
      screenWidthDp: 400,
      screenHeightDp: 800,
      density: 2.5,
      densityDpi: 400,
    },
  },
  widgetAction: "WIDGET_ADDED",
  renderWidget: jest.fn(),
  ...overrides,
});

describe("widgetTaskHandler", () => {
  it("renders the Pin widget for the pending filter on WIDGET_ADDED", async () => {
    const filter = Filter.reconstitute({
      id: 7,
      title: "Groceries",
      queryJsonString: JSON.stringify({
        concatenator: "and",
        project: undefined,
        priorities: [],
        labels: [],
        due: "no_date",
      }),
      lastUpdate: new Date(),
    });

    jest.mocked(getAndClearPendingWidgetFilterId).mockResolvedValue(7);
    jest.mocked(getFilters).mockResolvedValue([filter]);

    const props = buildProps({});

    await widgetTaskHandler(props);

    expect(props.renderWidget).toHaveBeenCalledTimes(1);
    const rendered = jest.mocked(props.renderWidget).mock.calls[0]?.[0];

    expect(rendered).toMatchObject({
      type: PinWidget,
      props: {
        viewModel: expect.objectContaining({
          filterId: 7,
          filterTitle: "Groceries",
        }),
      },
    });
  });

  it("does nothing when there is no pending filter", async () => {
    jest.mocked(getAndClearPendingWidgetFilterId).mockResolvedValue(null);

    const props = buildProps({});

    await widgetTaskHandler(props);

    expect(props.renderWidget).not.toHaveBeenCalled();
    expect(openDatabaseAsync).toHaveBeenCalledWith("focus-widgets.db");
  });

  it("ignores actions other than WIDGET_ADDED", async () => {
    const props = buildProps({ widgetAction: "WIDGET_CLICK" });

    await widgetTaskHandler(props);

    expect(props.renderWidget).not.toHaveBeenCalled();
    expect(getAndClearPendingWidgetFilterId).not.toHaveBeenCalled();
  });
});
