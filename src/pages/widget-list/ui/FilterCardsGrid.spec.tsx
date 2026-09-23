import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import type { FilterCardViewModel } from "@/entities/filter";
import { usePinFilterWidgetMutation } from "@/features/pin-filter-widget";
import { FilterCardsGrid } from "./FilterCardsGrid";

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

jest.mock("@/features/pin-filter-widget", () => ({
  usePinFilterWidgetMutation: jest.fn(),
}));

const mockedRouter = router as unknown as { push: jest.Mock };
const mockedUsePinFilterWidgetMutation =
  usePinFilterWidgetMutation as jest.Mock;

const buildViewModel = (id: number): FilterCardViewModel => ({
  filterId: id,
  filterTitle: `Filter ${id}`,
  taskTitle: `Task ${id}`,
  taskUrl: null,
  remainingCount: 0,
  priorityColor: "#E0E0E0",
  projectName: null,
  projectColor: null,
});

const pinMutate = jest.fn();

beforeEach(() => {
  mockedUsePinFilterWidgetMutation.mockReturnValue({ mutate: pinMutate });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("FilterCardsGrid", () => {
  it("shows an empty state message when there are no filters", async () => {
    await render(<FilterCardsGrid viewModels={[]} />);

    expect(
      screen.getByText("No filters yet. Tap the + button to create one."),
    ).toBeTruthy();
  });

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

  it("pins the filter's widget to the home screen on long press", async () => {
    await render(<FilterCardsGrid viewModels={[buildViewModel(1)]} />);

    fireEvent(screen.getByRole("button", { name: "Filter 1" }), "longPress");

    expect(pinMutate).toHaveBeenCalledWith(1);
  });
});
