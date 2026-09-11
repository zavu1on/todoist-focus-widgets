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
