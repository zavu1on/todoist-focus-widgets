import { fireEvent, render, screen } from "@testing-library/react-native";
import type { FC } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Text } from "react-native";
import type { CreateFilterInput } from "@/entities/filter";
import { DueSegmentedField } from "./DueSegmentedField";

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
  const due = useWatch({ control: form.control, name: "queryInput.due" });

  return (
    <FormProvider {...form}>
      <DueSegmentedField />
      <Text>Current: {due ?? "unset"}</Text>
    </FormProvider>
  );
};

describe("DueSegmentedField", () => {
  it("has no due constraint selected by default", async () => {
    await render(<Harness />);

    expect(screen.getByText("Current: unset")).toBeTruthy();
  });

  it("selects a due constraint when its segment is pressed", async () => {
    await render(<Harness />);

    fireEvent.press(screen.getByRole("button", { name: "Today" }));

    expect(await screen.findByText("Current: today")).toBeTruthy();
  });

  it("clears the due constraint when the selected segment is pressed again", async () => {
    await render(<Harness />);

    fireEvent.press(screen.getByRole("button", { name: "Today" }));
    await screen.findByText("Current: today");
    fireEvent.press(screen.getByRole("button", { name: "Today" }));

    expect(await screen.findByText("Current: unset")).toBeTruthy();
  });
});
