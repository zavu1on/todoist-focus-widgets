import { fireEvent, render, screen } from "@testing-library/react-native";
import type { FC } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Text } from "react-native";
import type { CreateFilterInput } from "@/entities/filter";
import { ConcatenatorToggleField } from "./ConcatenatorToggleField";

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
  const concatenator = useWatch({
    control: form.control,
    name: "queryInput.concatenator",
  });

  return (
    <FormProvider {...form}>
      <ConcatenatorToggleField />
      <Text>Current: {concatenator}</Text>
    </FormProvider>
  );
};

describe("ConcatenatorToggleField", () => {
  it("defaults to AND", async () => {
    await render(<Harness />);

    expect(screen.getByText("Current: and")).toBeTruthy();
  });

  it("switches to OR when that option is pressed", async () => {
    await render(<Harness />);

    fireEvent.press(screen.getByRole("button", { name: "Match any (OR)" }));

    expect(await screen.findByText("Current: or")).toBeTruthy();
  });
});
