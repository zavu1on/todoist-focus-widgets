import * as matchers from "@testing-library/react-native/matchers";

expect.extend(matchers);

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// @doist/todoist-sdk ships ESM-only transitive dependencies (uuid, @doist/sdk-kmp)
// that Jest can't parse. Component tests mock the api/-segment function that calls
// this SDK (see docs/CODE_STYLE_GUIDE.md "Тестирование"), so a real client is never needed.
jest.mock("@doist/todoist-sdk", () => ({
  TodoistApi: jest.fn(),
}));

jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock"),
);

// react-native-android-widget's native module isn't registered under Jest
// (TurboModuleRegistry.getEnforcing throws at import time), and every widget
// tree it renders is just JSX describing RemoteViews, never actually mounted.
jest.mock("react-native-android-widget", () => ({
  FlexWidget: () => null,
  TextWidget: () => null,
  IconWidget: () => null,
  ImageWidget: () => null,
  ListWidget: () => null,
  OverlapWidget: () => null,
  SvgWidget: () => null,
  registerWidgetTaskHandler: jest.fn(),
  requestPinWidget: jest.fn().mockResolvedValue(true),
  requestWidgetUpdate: jest.fn(),
  requestWidgetUpdateById: jest.fn(),
  getWidgetInfo: jest.fn().mockResolvedValue([]),
}));
