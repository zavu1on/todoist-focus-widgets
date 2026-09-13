import { fireEvent, render, screen } from "@testing-library/react-native";
import type { FilterCardViewModel } from "../models/getFilterCardViewModel";
import { FilterCard } from "./FilterCard";

const baseViewModel: FilterCardViewModel = {
  filterId: 1,
  filterTitle: "Groceries",
  taskTitle: "Buy oat milk",
  remainingCount: 3,
  priorityColor: "#D1453B",
  projectName: "Errands",
  projectColor: "#EB8909",
};

describe("FilterCard", () => {
  it("shows the first matching task's title", async () => {
    await render(<FilterCard viewModel={baseViewModel} />);

    expect(screen.getByText("Buy oat milk")).toBeTruthy();
  });

  it('shows "All clear." when no task matches', async () => {
    await render(
      <FilterCard viewModel={{ ...baseViewModel, taskTitle: null }} />,
    );

    expect(screen.getByText("All clear.")).toBeTruthy();
  });

  it("hides the remaining count when there are no extra matches", async () => {
    await render(
      <FilterCard viewModel={{ ...baseViewModel, remainingCount: 0 }} />,
    );

    expect(screen.queryByText(/^\+/)).toBeNull();
  });

  it("shows the remaining count when there are extra matches", async () => {
    await render(<FilterCard viewModel={baseViewModel} />);

    expect(screen.getByText("+3")).toBeTruthy();
  });

  it("hides the project row when no project is set", async () => {
    await render(
      <FilterCard
        viewModel={{ ...baseViewModel, projectName: null, projectColor: null }}
      />,
    );

    expect(screen.queryByText("Errands")).toBeNull();
  });

  it("always shows the filter title", async () => {
    await render(<FilterCard viewModel={baseViewModel} />);

    expect(screen.getByText("Groceries")).toBeTruthy();
  });

  it("calls onPress when tapped, if provided", async () => {
    const onPress = jest.fn();
    await render(<FilterCard viewModel={baseViewModel} onPress={onPress} />);

    fireEvent.press(screen.getByRole("button", { name: "Groceries" }));

    expect(onPress).toHaveBeenCalled();
  });
});
