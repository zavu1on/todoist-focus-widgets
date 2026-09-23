import type { SQLiteDatabase } from "expo-sqlite";
import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { ErrorScreen } from "@/shared/ui";

type DatabaseProviderProps = PropsWithChildren<{
  getDatabase: () => Promise<SQLiteDatabase>;
}>;

const DatabaseContext = createContext<SQLiteDatabase | null>(null);

export const DatabaseProvider: FC<DatabaseProviderProps> = ({
  children,
  getDatabase,
}) => {
  const [db, setDB] = useState<SQLiteDatabase | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const openDatabase = () => {
    setError(null);
    getDatabase().then(setDB).catch(setError);
  };

  useEffect(openDatabase, [getDatabase]);

  if (error !== null) {
    return (
      <ErrorScreen
        title="Can't open the local database."
        details={error.message}
        onRetry={openDatabase}
      />
    );
  }

  if (db === null) {
    return null;
  }

  return (
    <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>
  );
};

export const useDatabase = (): SQLiteDatabase => {
  const db = useContext(DatabaseContext);

  if (db === null) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }

  return db;
};
