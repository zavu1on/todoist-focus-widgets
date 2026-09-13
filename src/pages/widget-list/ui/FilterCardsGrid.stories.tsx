import type { Meta, StoryObj } from "@storybook/react-vite";
import { View } from "react-native";
import type { FilterCardViewModel } from "@/entities/filter";
import { colors } from "@/shared/ui";
import { FilterCardsGrid } from "./FilterCardsGrid";

const sampleViewModels: FilterCardViewModel[] = [
  {
    filterId: 1,
    filterTitle: "Groceries",
    taskTitle: "Buy oat milk + coffee filters",
    remainingCount: 3,
    priorityColor: colors.danger,
    projectName: "Errands",
    projectColor: colors.warning,
  },
  {
    filterId: 2,
    filterTitle: "Deep work",
    taskTitle: "Send the Q3 recap to the whole leadership team before Friday",
    remainingCount: 6,
    priorityColor: colors.info,
    projectName: "Work",
    projectColor: colors.info,
  },
  {
    filterId: 3,
    filterTitle: "Home evening",
    taskTitle: null,
    remainingCount: 0,
    priorityColor: colors.neutral,
    projectName: "Home",
    projectColor: colors.textPrimary,
  },
  {
    filterId: 4,
    filterTitle: "No project set",
    taskTitle: "Water the plants",
    remainingCount: 0,
    priorityColor: colors.warning,
    projectName: null,
    projectColor: null,
  },
];

const meta: Meta<typeof FilterCardsGrid> = {
  title: "widget-list/FilterCardsGrid",
  component: FilterCardsGrid,
  argTypes: {
    viewModels: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<{ containerWidth: number }>;

export const Playground: Story = {
  args: { containerWidth: 400 },
  argTypes: {
    containerWidth: {
      control: { type: "range", min: 240, max: 900, step: 20 },
    },
  },
  render: ({ containerWidth }) => (
    <View style={{ width: containerWidth, height: 500 }}>
      <FilterCardsGrid viewModels={sampleViewModels} />
    </View>
  ),
};
