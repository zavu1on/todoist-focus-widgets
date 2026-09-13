import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { useNavigation } from "expo-router";
import { Alert, Animated } from "react-native";
import {
  useCreateFilterMutation,
  useUpdateFilterMutation,
} from "@/entities/filter";
import { useTodoistSyncQuery } from "@/features/todoist-sync";
import { UpsertFilterForm } from "./UpsertFilterForm";

jest.mock("@/entities/filter", () => ({
  ...jest.requireActual("@/entities/filter"),
  useCreateFilterMutation: jest.fn(),
  useUpdateFilterMutation: jest.fn(),
}));

jest.mock("@/features/todoist-sync", () => ({
  useTodoistSyncQuery: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useNavigation: jest.fn(),
}));

const mockedUseCreateFilterMutation = useCreateFilterMutation as jest.Mock;
const mockedUseUpdateFilterMutation = useUpdateFilterMutation as jest.Mock;
const mockedUseTodoistSyncQuery = useTodoistSyncQuery as jest.Mock;
const mockedUseNavigation = useNavigation as jest.Mock;

const setupNavigationMock = () => {
  let beforeRemoveHandler:
    | ((event: {
        preventDefault: () => void;
        data: { action: symbol };
      }) => void)
    | null = null;

  const navigation = {
    addListener: jest.fn(
      (eventName: string, handler: typeof beforeRemoveHandler) => {
        if (eventName === "beforeRemove") {
          beforeRemoveHandler = handler;
        }
        return jest.fn();
      },
    ),
    dispatch: jest.fn(),
  };

  mockedUseNavigation.mockReturnValue(navigation);

  return {
    navigation,
    triggerBeforeRemove: () => {
      const preventDefault = jest.fn();
      const action = Symbol("go-back-action");
      beforeRemoveHandler?.({ preventDefault, data: { action } });
      return { preventDefault, action };
    },
  };
};

describe("UpsertFilterForm", () => {
  // react-hook-form's async handleSubmit leaves the RN test renderer unable to
  // mount again later in this file (same limitation noted in LoginForm.spec.tsx).
  // Every scenario below is exercised against a single render/user journey instead
  // of splitting it across several `it` blocks with their own render() call.
  it("guards step navigation and unsaved changes, then creates a filter on submit", async () => {
    const timingSpy = jest
      .spyOn(Animated, "timing")
      .mockImplementation((value, config) => ({
        start: (callback?: Animated.EndCallback) => {
          (value as Animated.Value).setValue(config.toValue as number);
          callback?.({ finished: true });
        },
        stop: () => {},
        reset: () => {},
      }));
    mockedUseTodoistSyncQuery.mockReturnValue({
      data: { tasks: [], projects: [], labels: [] },
    });
    mockedUseUpdateFilterMutation.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    const createMutate = jest.fn(
      (_input, options?: { onSuccess?: () => void }) => options?.onSuccess?.(),
    );
    mockedUseCreateFilterMutation.mockReturnValue({
      mutate: createMutate,
      isPending: false,
    });
    const { navigation, triggerBeforeRemove } = setupNavigationMock();
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    const onSaved = jest.fn();
    const onCancel = jest.fn();

    await render(<UpsertFilterForm onSaved={onSaved} onCancel={onCancel} />);
    expect(screen.getByText("Step 1 of 2")).toBeTruthy();

    fireEvent.press(screen.getByRole("button", { name: "Continue" }));
    expect(await screen.findByText("Step 2 of 2")).toBeTruthy();

    // Back navigation from step two returns to step one instead of leaving the form.
    timingSpy.mockClear();
    let { preventDefault } = triggerBeforeRemove();
    expect(preventDefault).toHaveBeenCalled();
    expect(timingSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ toValue: 0 }),
    );

    // Re-enter step two, make the form dirty, and go back to step one manually.
    fireEvent.press(screen.getByRole("button", { name: "Continue" }));
    expect(await screen.findByText("Step 2 of 2")).toBeTruthy();
    fireEvent.changeText(screen.getByLabelText("Widget name"), "Deep work");
    fireEvent.press(screen.getByRole("button", { name: "Back" }));
    expect(await screen.findByText("Step 1 of 2")).toBeTruthy();

    // Leaving a dirty form now asks for confirmation.
    const dirtyRemoveAttempt = triggerBeforeRemove();
    preventDefault = dirtyRemoveAttempt.preventDefault;
    const { action } = dirtyRemoveAttempt;
    expect(preventDefault).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalled();
    const discardOption = alertSpy.mock.calls[0][2]?.find(
      (button) => button.text === "Discard",
    );
    discardOption?.onPress?.();
    expect(navigation.dispatch).toHaveBeenCalledWith(action);
    alertSpy.mockClear();

    // Submitting on step two creates the filter and leaves without a confirmation.
    fireEvent.press(screen.getByRole("button", { name: "Continue" }));
    expect(await screen.findByText("Step 2 of 2")).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: "Add to Home Screen" }));

    await waitFor(() =>
      expect(createMutate).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Deep work" }),
        expect.anything(),
      ),
    );
    expect(onSaved).toHaveBeenCalled();

    ({ preventDefault } = triggerBeforeRemove());
    expect(preventDefault).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();

    timingSpy.mockRestore();
    alertSpy.mockRestore();
  });
});
