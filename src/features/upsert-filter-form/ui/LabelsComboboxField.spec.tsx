import { fireEvent, render, screen } from "@testing-library/react-native";
import type { FC } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Text } from "react-native";
import type { CreateFilterInput } from "@/entities/filter";
import { Label } from "@/entities/label";
import { useTodoistSyncQuery } from "@/features/todoist-sync";
import { LabelsComboboxField } from "./LabelsComboboxField";

jest.mock("@/features/todoist-sync", () => ({
  useTodoistSyncQuery: jest.fn(),
}));

const mockedUseTodoistSyncQuery = useTodoistSyncQuery as jest.Mock;

const errandsLabel = Label.create({
  id: "l1",
  name: "errands",
  color: "orange",
});

const Harness: FC = () => {
  const form = useForm<CreateFilterInput>({
    defaultValues: {
      title: "",
      queryInput: {
        concatenator: "and",
        project: undefined,
        priorities: [],
        labels: [],
        due: undefined,
      },
    },
  });
  const labels = useWatch({ control: form.control, name: "queryInput.labels" });

  return (
    <FormProvider {...form}>
      <LabelsComboboxField />
      <Text>Current: {labels.join(",")}</Text>
    </FormProvider>
  );
};

beforeEach(() => {
  mockedUseTodoistSyncQuery.mockReturnValue({
    data: { tasks: [], projects: [], labels: [errandsLabel] },
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("LabelsComboboxField", () => {
  it("has no labels selected by default", async () => {
    await render(<Harness />);

    expect(screen.getByText("Current:")).toBeTruthy();
  });

  it("selects a label from the opened list and removes it via its chip", async () => {
    await render(<Harness />);

    fireEvent.press(screen.getByRole("button", { name: "Add label" }));
    fireEvent.press(await screen.findByText("errands"));

    expect(await screen.findByText("Current: errands")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Remove errands"));

    expect(await screen.findByText("Current:")).toBeTruthy();
  });
});
