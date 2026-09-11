import type { Meta, StoryObj } from "@storybook/react-vite";
import { View } from "react-native";
import { PRIORITY_COLORS } from "../model/priorityColors";
import { FilterCard } from "./FilterCard";

const priorityOptions = {
  P1: PRIORITY_COLORS[4],
  P2: PRIORITY_COLORS[3],
  P3: PRIORITY_COLORS[2],
  P4: PRIORITY_COLORS[1],
};

const meta: Meta<typeof FilterCard> = {
  title: "widget-list/FilterCard",
  component: FilterCard,
  decorators: [
    (Story) => (
      <View style={{ width: 176 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    viewModel: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<{
  taskTitle: string | null;
  remainingCount: number;
  priorityColor: string;
  projectName: string | null;
  projectColor: string;
  filterTitle: string;
}>;

export const Playground: Story = {
  args: {
    taskTitle: "Buy oat milk + coffee filters",
    remainingCount: 3,
    priorityColor: priorityOptions.P1,
    projectName: "Errands",
    projectColor: "#EB8909",
    filterTitle: "Groceries",
  },
  argTypes: {
    priorityColor: {
      control: "select",
      options: Object.values(priorityOptions),
    },
  },
  render: (args) => (
    <FilterCard
      viewModel={{
        filterId: 1,
        filterTitle: args.filterTitle,
        taskTitle: args.taskTitle,
        remainingCount: args.remainingCount,
        priorityColor: args.priorityColor,
        projectName: args.projectName,
        projectColor: args.projectName === null ? null : args.projectColor,
      }}
    />
  ),
};

export const AllClear: Story = {
  ...Playground,
  args: {
    ...Playground.args,
    taskTitle: null,
    remainingCount: 0,
  },
};

export const LongTitleEllipsis: Story = {
  ...Playground,
  args: {
    ...Playground.args,
    taskTitle:
      "Draft, review and send the quarterly recap document to the whole team before end of day",
  },
};

export const WithoutProject: Story = {
  ...Playground,
  args: {
    ...Playground.args,
    projectName: null,
  },
};
