import { zodResolver } from "@hookform/resolvers/zod";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import type { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  type CreateFilterInput,
  createFilterInputSchema,
} from "@/entities/filter";
import { useTodoistSyncQuery } from "@/features/todoist-sync";
import { UpsertFilterFormStepTwo } from "./UpsertFilterFormStepTwo";

jest.mock("@/features/todoist-sync", () => ({
  useTodoistSyncQuery: jest.fn(),
}));

const mockedUseTodoistSyncQuery = useTodoistSyncQuery as jest.Mock;

const Harness: FC = () => {
  const form = useForm<CreateFilterInput>({
    resolver: zodResolver(createFilterInputSchema),
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

  return (
    <FormProvider {...form}>
      <UpsertFilterFormStepTwo
        onBack={jest.fn()}
        onSubmit={form.handleSubmit(jest.fn())}
        onPlaceOnHomeScreen={jest.fn()}
        isSubmitting={false}
      />
    </FormProvider>
  );
};

describe("UpsertFilterFormStepTwo", () => {
  it("shows the title validation error after submitting an empty name", async () => {
    mockedUseTodoistSyncQuery.mockReturnValue({
      data: { tasks: [], projects: [], labels: [] },
    });

    await render(<Harness />);

    await act(async () => {
      fireEvent.press(
        screen.getByRole("button", { name: "Add to Home Screen" }),
      );
    });

    expect(
      await screen.findByText("Filter title can't be empty."),
    ).toBeTruthy();
  });
});
