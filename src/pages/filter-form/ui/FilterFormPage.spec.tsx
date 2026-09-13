import { render } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import { Filter, useFiltersQuery } from "@/entities/filter";
import { UpsertFilterForm } from "@/features/upsert-filter-form";
import { FilterFormPage } from "./FilterFormPage";

jest.mock("expo-router", () => ({
  router: { back: jest.fn() },
  useLocalSearchParams: jest.fn(),
}));

jest.mock("@/entities/filter", () => ({
  ...jest.requireActual("@/entities/filter"),
  useFiltersQuery: jest.fn(),
}));

jest.mock("@/features/upsert-filter-form", () => ({
  UpsertFilterForm: jest.fn(() => null),
}));

const mockedUseLocalSearchParams = useLocalSearchParams as jest.Mock;
const mockedUseFiltersQuery = useFiltersQuery as jest.Mock;
const mockedFilterForm = UpsertFilterForm as jest.Mock;

const filterFixture = Filter.create({
  title: "Groceries",
  queryInput: {
    concatenator: "and",
    project: undefined,
    priorities: [],
    labels: [],
    due: undefined,
  },
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("FilterFormPage", () => {
  it("renders nothing while filters are still loading for an edit route", async () => {
    mockedUseLocalSearchParams.mockReturnValue({ id: "1" });
    mockedUseFiltersQuery.mockReturnValue({ data: undefined });

    await render(<FilterFormPage />);

    expect(mockedFilterForm).not.toHaveBeenCalled();
  });

  it("passes no initial filter on the create route", async () => {
    mockedUseLocalSearchParams.mockReturnValue({ id: undefined });
    mockedUseFiltersQuery.mockReturnValue({ data: [] });

    await render(<FilterFormPage />);

    expect(mockedFilterForm).toHaveBeenCalledWith(
      expect.objectContaining({ initialFilter: undefined }),
      undefined,
    );
  });

  it("resolves the matching filter on the edit route once filters are loaded", async () => {
    mockedUseLocalSearchParams.mockReturnValue({
      id: String(filterFixture.id),
    });
    mockedUseFiltersQuery.mockReturnValue({ data: [filterFixture] });

    await render(<FilterFormPage />);

    expect(mockedFilterForm).toHaveBeenCalledWith(
      expect.objectContaining({ initialFilter: filterFixture }),
      undefined,
    );
  });
});
