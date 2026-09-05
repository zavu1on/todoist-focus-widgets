import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { useLoginMutation } from "../api/useLoginMutation";
import { LoginForm } from "./LoginForm";

jest.mock("../api/useLoginMutation", () => ({
  useLoginMutation: jest.fn(),
}));

const mockedUseLoginMutation = useLoginMutation as jest.MockedFunction<
  typeof useLoginMutation
>;

const mockMutationState = (
  overrides: Partial<ReturnType<typeof useLoginMutation>> = {},
) =>
  mockedUseLoginMutation.mockReturnValue({
    mutate: jest.fn(),
    isPending: false,
    isError: false,
    error: null,
    ...overrides,
  } as unknown as ReturnType<typeof useLoginMutation>);

describe("LoginForm", () => {
  afterEach(() => {
    mockedUseLoginMutation.mockReset();
  });

  it("shows the mutation error message", async () => {
    mockMutationState({ isError: true, error: new Error("Invalid token") });

    await render(<LoginForm />);

    expect(await screen.findByText("Invalid token")).toBeTruthy();
  });

  // Kept as one sequential test rather than split validation/submit cases:
  // react-hook-form's async handleSubmit leaves the RN test renderer unable to
  // mount again later in this file, so every scenario exercising the submit
  // button has to run against a single render, last in the file.
  it("validates the token before submitting, then submits once it's valid", async () => {
    const mutate = jest.fn();
    mockMutationState({ mutate });

    await render(<LoginForm />);

    fireEvent.press(screen.getByRole("button", { name: "Connect" }));
    expect(await screen.findByText("Access token is empty")).toBeTruthy();
    expect(mutate).not.toHaveBeenCalled();

    fireEvent.changeText(screen.getByLabelText("API token"), "short-token");
    fireEvent.press(screen.getByRole("button", { name: "Connect" }));
    expect(await screen.findByText("Access token is too short")).toBeTruthy();
    expect(mutate).not.toHaveBeenCalled();

    const validToken = "a".repeat(40);
    fireEvent.changeText(screen.getByLabelText("API token"), validToken);
    fireEvent.press(screen.getByRole("button", { name: "Connect" }));
    await waitFor(() => expect(mutate).toHaveBeenCalledWith(validToken));
  });
});
