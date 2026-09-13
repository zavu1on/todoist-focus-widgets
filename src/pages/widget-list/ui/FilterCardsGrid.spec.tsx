import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import { Alert } from "react-native";
import {
  type FilterCardViewModel,
  useDeleteFilterMutation,
} from "@/entities/filter";
import { FilterCardsGrid } from "./FilterCardsGrid";

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

jest.mock("@/entities/filter", () => ({
  ...jest.requireActual("@/entities/filter"),
  useDeleteFilterMutation: jest.fn(),
}));

const mockedRouter = router as unknown as { push: jest.Mock };
const mockedUseDeleteFilterMutation = useDeleteFilterMutation as jest.Mock;

const buildViewModel = (id: number): FilterCardViewModel => ({
  filterId: id,
  filterTitle: `Filter ${id}`,
  taskTitle: `Task ${id}`,
  remainingCount: 0,
  priorityColor: "#E0E0E0",
  projectName: null,
  projectColor: null,
});

beforeEach(() => {
  mockedUseDeleteFilterMutation.mockReturnValue({
    mutate: jest.fn(),
    isPending: false,
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("FilterCardsGrid", () => {
  it("renders one card per view model", async () => {
    await render(
      <FilterCardsGrid viewModels={[buildViewModel(1), buildViewModel(2)]} />,
    );

    expect(screen.getByText("Filter 1")).toBeTruthy();
    expect(screen.getByText("Filter 2")).toBeTruthy();
  });

  it("navigates to the filter's edit route when a card is pressed", async () => {
    await render(<FilterCardsGrid viewModels={[buildViewModel(1)]} />);

    fireEvent.press(screen.getByRole("button", { name: "Filter 1" }));

    expect(mockedRouter.push).toHaveBeenCalledWith({
      pathname: "/filter/[id]",
      params: { id: "1" },
    });
  });

  describe("delete confirmation", () => {
    it("asks for confirmation instead of deleting immediately", async () => {
      const mutate = jest.fn();
      mockedUseDeleteFilterMutation.mockReturnValue({
        mutate,
        isPending: false,
      });
      const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

      await render(<FilterCardsGrid viewModels={[buildViewModel(1)]} />);
      fireEvent(screen.getByRole("button", { name: "Filter 1" }), "longPress");

      expect(alertSpy).toHaveBeenCalledWith(
        "Delete this filter?",
        expect.any(String),
        expect.any(Array),
      );
      expect(mutate).not.toHaveBeenCalled();

      alertSpy.mockRestore();
    });

    it("deletes the filter only when the destructive action is confirmed", async () => {
      const mutate = jest.fn();
      mockedUseDeleteFilterMutation.mockReturnValue({
        mutate,
        isPending: false,
      });
      jest
        .spyOn(Alert, "alert")
        .mockImplementation((_title, _message, buttons) => {
          const confirmButton = buttons?.find(
            (button) => button.text === "Delete",
          );
          confirmButton?.onPress?.();
        });

      await render(<FilterCardsGrid viewModels={[buildViewModel(1)]} />);
      fireEvent(screen.getByRole("button", { name: "Filter 1" }), "longPress");

      expect(mutate).toHaveBeenCalledWith(1);
    });
  });
});
