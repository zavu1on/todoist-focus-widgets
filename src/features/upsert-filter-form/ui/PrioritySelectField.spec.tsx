import { fireEvent, render, screen } from "@testing-library/react-native";
import type { FC } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Text } from "react-native";
import type { CreateFilterInput } from "@/entities/filter";
import { PrioritySelectField } from "./PrioritySelectField";

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
  const priorities = useWatch({
    control: form.control,
    name: "queryInput.priorities",
  });

  return (
    <FormProvider {...form}>
      <PrioritySelectField />
      <Text>Current: {priorities.join(",")}</Text>
    </FormProvider>
  );
};

describe("PrioritySelectField", () => {
  it("has no priority selected by default", async () => {
    await render(<Harness />);

    expect(screen.getByText("Current:")).toBeTruthy();
  });

  it("adds a priority when its chip is pressed", async () => {
    await render(<Harness />);

    fireEvent.press(screen.getByRole("button", { name: "p1" }));

    expect(await screen.findByText("Current: 4")).toBeTruthy();
  });

  it("removes a priority when its chip is pressed again", async () => {
    await render(<Harness />);

    fireEvent.press(screen.getByRole("button", { name: "p1" }));
    await screen.findByText("Current: 4");
    fireEvent.press(screen.getByRole("button", { name: "p1" }));

    expect(await screen.findByText("Current:")).toBeTruthy();
  });
});
