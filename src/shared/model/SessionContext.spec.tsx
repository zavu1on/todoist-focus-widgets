import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Pressable, Text } from "react-native";
import { deleteAccessToken, getAccessToken } from "@/shared/api";
import { SessionProvider, useSession } from "./SessionContext";

jest.mock("@/shared/api/getAccessToken");
jest.mock("@/shared/api/deleteAccessToken");

const mockedGetAccessToken = getAccessToken as jest.MockedFunction<
  typeof getAccessToken
>;
const mockedDeleteAccessToken = deleteAccessToken as jest.MockedFunction<
  typeof deleteAccessToken
>;

const SessionProbe = () => {
  const { hasToken, signOut } = useSession();

  return (
    <>
      <Text>
        {hasToken === null ? "loading" : hasToken ? "signed-in" : "signed-out"}
      </Text>
      <Pressable accessibilityRole="button" onPress={signOut}>
        <Text>Log out</Text>
      </Pressable>
    </>
  );
};

describe("SessionContext", () => {
  afterEach(() => {
    mockedGetAccessToken.mockReset();
    mockedDeleteAccessToken.mockReset();
  });

  it("resolves hasToken from the stored token on mount", async () => {
    mockedGetAccessToken.mockResolvedValue("stored-token");

    await render(
      <SessionProvider>
        <SessionProbe />
      </SessionProvider>,
    );

    expect(await screen.findByText("signed-in")).toBeTruthy();
  });

  it("signs out by deleting the stored token", async () => {
    mockedGetAccessToken.mockResolvedValue("stored-token");
    mockedDeleteAccessToken.mockResolvedValue(undefined);

    await render(
      <SessionProvider>
        <SessionProbe />
      </SessionProvider>,
    );

    await screen.findByText("signed-in");
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Log out" }));
    });

    expect(await screen.findByText("signed-out")).toBeTruthy();
    expect(mockedDeleteAccessToken).toHaveBeenCalled();
  });
});
