import { render, screen } from "@testing-library/react-native";
import type { FilterCardViewModel } from "../model/getFilterCardViewModel";
import { FilterCardsGrid } from "./FilterCardsGrid";

const buildViewModel = (id: number): FilterCardViewModel => ({
  filterId: id,
  filterTitle: `Filter ${id}`,
  taskTitle: `Task ${id}`,
  remainingCount: 0,
  priorityColor: "#E0E0E0",
  projectName: null,
  projectColor: null,
});

describe("FilterCardsGrid", () => {
  it("renders one card per view model", async () => {
    await render(
      <FilterCardsGrid viewModels={[buildViewModel(1), buildViewModel(2)]} />,
    );

    expect(screen.getByText("Filter 1")).toBeTruthy();
    expect(screen.getByText("Filter 2")).toBeTruthy();
  });
});
