import { act, fireEvent, render, screen } from "@testing-library/react-native";
import type { SQLiteDatabase } from "expo-sqlite";
import { Text } from "react-native";
import { DatabaseProvider, useDatabase } from "./DatabaseContext";

const DatabaseProbe = () => {
  const db = useDatabase();

  return <Text>{db === undefined ? "no database" : "has database"}</Text>;
};

describe("DatabaseContext", () => {
  it("provides the resolved database to descendants", async () => {
    const fakeDb = {} as SQLiteDatabase;
    const getDatabase = jest.fn().mockResolvedValue(fakeDb);

    await render(
      <DatabaseProvider getDatabase={getDatabase}>
        <DatabaseProbe />
      </DatabaseProvider>,
    );

    expect(await screen.findByText("has database")).toBeTruthy();
  });

  it("offers a retry that opens the database after a failed attempt", async () => {
    const fakeDb = {} as SQLiteDatabase;
    const getDatabase = jest
      .fn()
      .mockRejectedValueOnce(new Error("disk I/O error"))
      .mockResolvedValue(fakeDb);

    await render(
      <DatabaseProvider getDatabase={getDatabase}>
        <DatabaseProbe />
      </DatabaseProvider>,
    );

    expect(await screen.findByText("disk I/O error")).toBeTruthy();

    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Try again" }));
    });

    expect(await screen.findByText("has database")).toBeTruthy();
  });
});
