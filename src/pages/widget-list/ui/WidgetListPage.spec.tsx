import { fireEvent, render, screen } from "@testing-library/react-native";
import { Alert } from "react-native";
import {
  Filter,
  useDeleteFilterMutation,
  useFiltersQuery,
} from "@/entities/filter";
import { Project } from "@/entities/project";
import {
  useFullTodoistReloadMutation,
  useTodoistSyncQuery,
} from "@/features/todoist-sync";
import { useSession } from "@/shared/model";
import { WidgetListPage } from "./WidgetListPage";

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
  useFocusEffect: (effect: () => void) => {
    const { useEffect } = jest.requireActual("react");
    useEffect(effect, [effect]);
  },
}));

jest.mock("@/entities/filter", () => ({
  ...jest.requireActual("@/entities/filter"),
  useFiltersQuery: jest.fn(),
  useDeleteFilterMutation: jest.fn(),
}));

jest.mock("@/features/todoist-sync", () => ({
  useTodoistSyncQuery: jest.fn(),
  useFullTodoistReloadMutation: jest.fn(),
}));

jest.mock("@/shared/model", () => ({
  useSession: jest.fn(),
}));

const mockedUseFiltersQuery = useFiltersQuery as jest.Mock;
const mockedUseTodoistSyncQuery = useTodoistSyncQuery as jest.Mock;
const mockedUseFullTodoistReloadMutation =
  useFullTodoistReloadMutation as jest.Mock;
const mockedUseSession = useSession as jest.Mock;
const mockedUseDeleteFilterMutation = useDeleteFilterMutation as jest.Mock;

const inboxProject = Project.create({ id: "p1", name: "Inbox", color: "red" });

const filterFixture = Filter.create({
  title: "Groceries",
  queryInput: {
    concatenator: "and",
    project: { id: "p1", name: "Inbox" },
    priorities: [],
    labels: [],
    due: "no_date",
  },
});

beforeEach(() => {
  mockedUseSession.mockReturnValue({ signOut: jest.fn() });
  mockedUseDeleteFilterMutation.mockReturnValue({
    mutate: jest.fn(),
    isPending: false,
  });
  mockedUseFullTodoistReloadMutation.mockReturnValue({
    mutateAsync: jest.fn().mockResolvedValue(undefined),
    isPending: false,
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("WidgetListPage", () => {
  it("shows a skeleton while loading", async () => {
    mockedUseFiltersQuery.mockReturnValue({
      isPending: true,
      data: undefined,
      refetch: jest.fn(),
    });
    mockedUseTodoistSyncQuery.mockReturnValue({
      isPending: true,
      data: undefined,
    });

    await render(<WidgetListPage />);

    expect(screen.queryByText("Groceries")).toBeNull();
  });

  it("shows one card per filter once loaded", async () => {
    mockedUseFiltersQuery.mockReturnValue({
      isPending: false,
      data: [filterFixture],
      refetch: jest.fn(),
    });
    mockedUseTodoistSyncQuery.mockReturnValue({
      isPending: false,
      isFetching: false,
      data: { tasks: [], projects: [inboxProject], labels: [] },
      refetch: jest.fn(),
    });

    await render(<WidgetListPage />);

    expect(screen.getByText("Groceries")).toBeTruthy();
    expect(screen.getByText("All clear.")).toBeTruthy();
  });

  it("wipes local Todoist data and refetches it when pressing Refresh", async () => {
    const mutateAsync = jest.fn().mockResolvedValue(undefined);
    const refetch = jest.fn();
    mockedUseFullTodoistReloadMutation.mockReturnValue({
      mutateAsync,
      isPending: false,
    });
    mockedUseFiltersQuery.mockReturnValue({
      isPending: false,
      data: [],
      refetch: jest.fn(),
    });
    mockedUseTodoistSyncQuery.mockReturnValue({
      isPending: false,
      isFetching: false,
      data: { tasks: [], projects: [], labels: [] },
      refetch,
    });

    await render(<WidgetListPage />);
    fireEvent.press(screen.getByRole("button", { name: "Refresh" }));

    await Promise.resolve();

    expect(mutateAsync).toHaveBeenCalled();
    expect(refetch).toHaveBeenCalled();
  });

  describe("sync error", () => {
    beforeEach(() => {
      mockedUseFiltersQuery.mockReturnValue({
        isPending: false,
        data: [],
        refetch: jest.fn(),
      });
    });

    it("shows the error message and its cause instead of the grid", async () => {
      const refetch = jest.fn();
      mockedUseTodoistSyncQuery.mockReturnValue({
        isPending: false,
        isError: true,
        error: new Error("Failed to save the synced Todoist data locally.", {
          cause: new Error("SQLite is out of disk space."),
        }),
        data: undefined,
        refetch,
      });

      await render(<WidgetListPage />);

      expect(
        screen.getByText("Failed to save the synced Todoist data locally."),
      ).toBeTruthy();
      expect(screen.getByText("SQLite is out of disk space.")).toBeTruthy();

      fireEvent.press(screen.getByRole("button", { name: "Try again" }));
      expect(refetch).toHaveBeenCalled();
    });

    it("shows only the message when the error has no cause", async () => {
      mockedUseTodoistSyncQuery.mockReturnValue({
        isPending: false,
        isError: true,
        error: new Error("You need to connect your Todoist account first."),
        data: undefined,
        refetch: jest.fn(),
      });

      await render(<WidgetListPage />);

      expect(
        screen.getByText("You need to connect your Todoist account first."),
      ).toBeTruthy();
    });
  });

  describe("log out confirmation", () => {
    beforeEach(() => {
      mockedUseFiltersQuery.mockReturnValue({
        isPending: false,
        data: [],
        refetch: jest.fn(),
      });
      mockedUseTodoistSyncQuery.mockReturnValue({
        isPending: false,
        data: { tasks: [], projects: [], labels: [] },
      });
    });

    it("asks for confirmation instead of signing out immediately", async () => {
      const signOut = jest.fn();
      mockedUseSession.mockReturnValue({ signOut });
      const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

      await render(<WidgetListPage />);
      fireEvent.press(screen.getByRole("button", { name: "Log out" }));

      expect(alertSpy).toHaveBeenCalledWith(
        "Log out?",
        expect.any(String),
        expect.any(Array),
      );
      expect(signOut).not.toHaveBeenCalled();
    });

    it("signs out only when the destructive action is confirmed", async () => {
      const signOut = jest.fn();
      mockedUseSession.mockReturnValue({ signOut });
      jest
        .spyOn(Alert, "alert")
        .mockImplementation((_title, _message, buttons) => {
          const confirmButton = buttons?.find(
            (button) => button.text === "Log out",
          );
          confirmButton?.onPress?.();
        });

      await render(<WidgetListPage />);
      fireEvent.press(screen.getByRole("button", { name: "Log out" }));

      expect(signOut).toHaveBeenCalled();
    });
  });
});
