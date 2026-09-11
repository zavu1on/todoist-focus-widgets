import type { Meta, StoryObj } from "@storybook/react-vite";
import { View } from "react-native";
import type { FilterCardViewModel } from "../model/getFilterCardViewModel";
import { FilterCardsGrid } from "./FilterCardsGrid";

const sampleViewModels: FilterCardViewModel[] = [
  {
    filterId: 1,
    filterTitle: "Groceries",
    taskTitle: "Buy oat milk + coffee filters",
    remainingCount: 3,
    priorityColor: "#D1453B",
    projectName: "Errands",
    projectColor: "#EB8909",
  },
  {
    filterId: 2,
    filterTitle: "Deep work",
    taskTitle: "Send the Q3 recap to the whole leadership team before Friday",
    remainingCount: 6,
    priorityColor: "#246FE0",
    projectName: "Work",
    projectColor: "#246FE0",
  },
  {
    filterId: 3,
    filterTitle: "Home evening",
    taskTitle: null,
    remainingCount: 0,
    priorityColor: "#E0E0E0",
    projectName: "Home",
    projectColor: "#25221E",
  },
  {
    filterId: 4,
    filterTitle: "No project set",
    taskTitle: "Water the plants",
    remainingCount: 0,
    priorityColor: "#EB8909",
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
