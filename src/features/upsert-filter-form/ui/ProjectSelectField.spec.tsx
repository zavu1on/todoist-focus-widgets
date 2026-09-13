import { fireEvent, render, screen } from "@testing-library/react-native";
import type { FC } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Text } from "react-native";
import type { CreateFilterInput } from "@/entities/filter";
import { Project } from "@/entities/project";
import { useTodoistSyncQuery } from "@/features/todoist-sync";
import { ProjectSelectField } from "./ProjectSelectField";

jest.mock("@/features/todoist-sync", () => ({
  useTodoistSyncQuery: jest.fn(),
}));

const mockedUseTodoistSyncQuery = useTodoistSyncQuery as jest.Mock;

const workProject = Project.create({
  id: "p1",
  name: "Work",
  color: "blue",
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
  const project = useWatch({
    control: form.control,
    name: "queryInput.project",
  });

  return (
    <FormProvider {...form}>
      <ProjectSelectField />
      <Text>Current: {project?.name ?? "unset"}</Text>
    </FormProvider>
  );
};

beforeEach(() => {
  mockedUseTodoistSyncQuery.mockReturnValue({
    data: { tasks: [], projects: [workProject], labels: [] },
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("ProjectSelectField", () => {
  it("shows 'Not set' by default", async () => {
    await render(<Harness />);

    expect(screen.getByText("Not set")).toBeTruthy();
    expect(screen.getByText("Current: unset")).toBeTruthy();
  });

  it("selects a project from the opened list", async () => {
    await render(<Harness />);

    fireEvent.press(screen.getByRole("button", { name: "Project" }));
    fireEvent.press(await screen.findByText("Work"));

    expect(await screen.findByText("Current: Work")).toBeTruthy();
  });
});
