import { fireEvent, render, screen } from "@testing-library/react-native";
import { Alert } from "react-native";
import { Filter, useFiltersQuery } from "@/entities/filter";
import { Project } from "@/entities/project";
import { useTodoistSyncQuery } from "@/features/todoist-sync";
import { useSession } from "@/shared/model";
import { WidgetListPage } from "./WidgetListPage";

jest.mock("@/entities/filter", () => ({
  ...jest.requireActual("@/entities/filter"),
  useFiltersQuery: jest.fn(),
}));

jest.mock("@/features/todoist-sync", () => ({
  useTodoistSyncQuery: jest.fn(),
}));

jest.mock("@/shared/model", () => ({
  useSession: jest.fn(),
}));

const mockedUseFiltersQuery = useFiltersQuery as jest.Mock;
const mockedUseTodoistSyncQuery = useTodoistSyncQuery as jest.Mock;
const mockedUseSession = useSession as jest.Mock;

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
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("WidgetListPage", () => {
  it("shows a skeleton while loading", async () => {
    mockedUseFiltersQuery.mockReturnValue({ isPending: true, data: undefined });
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
    });
    mockedUseTodoistSyncQuery.mockReturnValue({
      isPending: false,
      data: { tasks: [], projects: [inboxProject], labels: [] },
    });

    await render(<WidgetListPage />);

    expect(screen.getByText("Groceries")).toBeTruthy();
    expect(screen.getByText("All clear.")).toBeTruthy();
  });

  describe("log out confirmation", () => {
    beforeEach(() => {
      mockedUseFiltersQuery.mockReturnValue({ isPending: false, data: [] });
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
