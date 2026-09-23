import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { SQLiteDatabase } from "expo-sqlite";
import { AppState } from "react-native";
import { getAccessToken } from "@/shared/api";
import { useDatabase } from "@/shared/model";
import { reRenderPinWidgets } from "../api/reRenderPinWidgets";
import { syncTodoistDataQuietly } from "../api/syncTodoistDataQuietly";
import { useRevalidateWidgetsOnForeground } from "./useRevalidateWidgetsOnForeground";

jest.mock("@/shared/api", () => ({
  getAccessToken: jest.fn(),
}));

jest.mock("@/shared/model", () => ({
  useDatabase: jest.fn(),
}));

jest.mock("../api/reRenderPinWidgets");
jest.mock("../api/syncTodoistDataQuietly");

const fakeDb = {} as SQLiteDatabase;
const queryClient = new QueryClient();

const renderRevalidateHook = () =>
  renderHook(() => useRevalidateWidgetsOnForeground(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

const emitAppStateChange = async (state: string) => {
  await waitFor(() =>
    expect(jest.mocked(AppState.addEventListener)).toHaveBeenCalled(),
  );
  const listener = jest.mocked(AppState.addEventListener).mock.calls[0]?.[1];
  listener?.(state as never);
};

beforeEach(() => {
  jest.mocked(useDatabase).mockReturnValue(fakeDb);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("useRevalidateWidgetsOnForeground", () => {
  it("syncs and re-renders widgets when the app becomes active", async () => {
    jest.mocked(getAccessToken).mockResolvedValue("token");

    renderRevalidateHook();
    await emitAppStateChange("active");

    await waitFor(() => {
      expect(syncTodoistDataQuietly).toHaveBeenCalledWith(
        fakeDb,
        queryClient,
        "token",
      );
      expect(reRenderPinWidgets).toHaveBeenCalledWith(fakeDb);
    });
  });

  it("does nothing when the app goes to the background", async () => {
    renderRevalidateHook();
    await emitAppStateChange("background");

    expect(syncTodoistDataQuietly).not.toHaveBeenCalled();
    expect(reRenderPinWidgets).not.toHaveBeenCalled();
  });

  it("skips the sync but still renders when there is no access token", async () => {
    jest.mocked(getAccessToken).mockResolvedValue(null);

    renderRevalidateHook();
    await emitAppStateChange("active");

    await waitFor(() => {
      expect(reRenderPinWidgets).toHaveBeenCalledWith(fakeDb);
    });
    expect(syncTodoistDataQuietly).not.toHaveBeenCalled();
  });
});
