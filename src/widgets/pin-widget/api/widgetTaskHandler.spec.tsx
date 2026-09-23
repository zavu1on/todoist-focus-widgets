import type { SQLiteDatabase } from "expo-sqlite";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import { Filter } from "@/entities/filter";
import { getDatabase } from "@/features/database";
import { getAccessToken } from "@/shared/api";
import { PinWidget } from "../ui";
import { syncTodoistDataQuietly } from "./syncTodoistDataQuietly";
import { widgetTaskHandler } from "./widgetTaskHandler";

const fakeDb = {} as SQLiteDatabase;

jest.mock("@/features/database", () => ({
  getDatabase: jest.fn(),
}));

jest.mock("@/shared/api", () => ({
  getAccessToken: jest.fn(),
}));

jest.mock("./syncTodoistDataQuietly");

jest.mock("@/entities/filter", () => ({
  ...jest.requireActual("@/entities/filter"),
  popPendingWidgetFilterId: jest.fn(),
  upsertWidgetFilterId: jest.fn(),
  deleteWidgetFilterId: jest.fn(),
  getWidgetFilterIds: jest.fn(),
  getFilters: jest.fn(),
}));

jest.mock("@/entities/task", () => ({
  ...jest.requireActual("@/entities/task"),
  getTasks: jest.fn().mockResolvedValue([]),
}));

jest.mock("@/entities/project", () => ({
  ...jest.requireActual("@/entities/project"),
  getProjects: jest.fn().mockResolvedValue([]),
}));

const {
  popPendingWidgetFilterId,
  upsertWidgetFilterId,
  deleteWidgetFilterId,
  getWidgetFilterIds,
  getFilters,
} = jest.requireMock("@/entities/filter");

const filterFixture = Filter.reconstitute({
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

beforeEach(() => {
  jest.mocked(getDatabase).mockResolvedValue(fakeDb);
  jest.mocked(getAccessToken).mockResolvedValue("token");
  jest.mocked(syncTodoistDataQuietly).mockResolvedValue(undefined);
  getWidgetFilterIds.mockResolvedValue(new Map([[1, 7]]));
  getFilters.mockResolvedValue([filterFixture]);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("widgetTaskHandler", () => {
  it("on WIDGET_ADDED, persists the widget-filter link and renders", async () => {
    popPendingWidgetFilterId.mockResolvedValue(7);

    const props = buildProps({ widgetAction: "WIDGET_ADDED" });
    await widgetTaskHandler(props);

    expect(upsertWidgetFilterId).toHaveBeenCalledWith(fakeDb, 1, 7);
    expect(props.renderWidget).toHaveBeenCalledTimes(1);
    const rendered = jest.mocked(props.renderWidget).mock.calls[0]?.[0];
    expect(rendered).toMatchObject({
      type: PinWidget,
      props: { viewModel: expect.objectContaining({ filterId: 7 }) },
    });
  });

  it("on WIDGET_ADDED, does nothing when there is no pending filter", async () => {
    popPendingWidgetFilterId.mockResolvedValue(null);

    const props = buildProps({ widgetAction: "WIDGET_ADDED" });
    await widgetTaskHandler(props);

    expect(upsertWidgetFilterId).not.toHaveBeenCalled();
    expect(props.renderWidget).not.toHaveBeenCalled();
  });

  it("on WIDGET_DELETED, removes the widget-filter link", async () => {
    const props = buildProps({ widgetAction: "WIDGET_DELETED" });
    await widgetTaskHandler(props);

    expect(deleteWidgetFilterId).toHaveBeenCalledWith(fakeDb, 1);
    expect(props.renderWidget).not.toHaveBeenCalled();
  });

  it("on WIDGET_UPDATE, re-renders the widget", async () => {
    const props = buildProps({ widgetAction: "WIDGET_UPDATE" });
    await widgetTaskHandler(props);

    expect(props.renderWidget).toHaveBeenCalledTimes(1);
  });

  it("on WIDGET_CLICK with clickAction RELOAD, re-renders the widget", async () => {
    const props = buildProps({
      widgetAction: "WIDGET_CLICK",
      clickAction: "RELOAD",
    });
    await widgetTaskHandler(props);

    expect(props.renderWidget).toHaveBeenCalledTimes(1);
  });

  it("on WIDGET_CLICK with a different clickAction, does nothing", async () => {
    const props = buildProps({
      widgetAction: "WIDGET_CLICK",
      clickAction: "OPEN_URI",
    });
    await widgetTaskHandler(props);

    expect(props.renderWidget).not.toHaveBeenCalled();
  });

  it("on WIDGET_RESIZED, does nothing", async () => {
    const props = buildProps({ widgetAction: "WIDGET_RESIZED" });
    await widgetTaskHandler(props);

    expect(props.renderWidget).not.toHaveBeenCalled();
  });

  it("renders the filter-removed error when the widget has no matching filter", async () => {
    getWidgetFilterIds.mockResolvedValue(new Map());

    const props = buildProps({ widgetAction: "WIDGET_UPDATE" });
    await widgetTaskHandler(props);

    const rendered = jest.mocked(props.renderWidget).mock.calls[0]?.[0];
    expect(rendered).toMatchObject({
      type: PinWidget,
      props: { errorMessage: "Filter was removed." },
    });
  });

  it("swallows a database failure without touching the rendered widget", async () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    jest
      .mocked(getDatabase)
      .mockRejectedValue(new Error("Failed to open the database"));

    const props = buildProps({ widgetAction: "WIDGET_UPDATE" });
    await expect(widgetTaskHandler(props)).resolves.toBeUndefined();

    expect(props.renderWidget).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it("renders the sign-in error when there is no access token", async () => {
    jest.mocked(getAccessToken).mockResolvedValue(null);

    const props = buildProps({ widgetAction: "WIDGET_UPDATE" });
    await widgetTaskHandler(props);

    const rendered = jest.mocked(props.renderWidget).mock.calls[0]?.[0];
    expect(rendered).toMatchObject({
      type: PinWidget,
      props: {
        errorMessage: "Sign in to Todoist to see your tasks.",
      },
    });
    expect(syncTodoistDataQuietly).not.toHaveBeenCalled();
  });
});
