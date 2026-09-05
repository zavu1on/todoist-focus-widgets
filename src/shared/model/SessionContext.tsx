import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { deleteAccessToken, getAccessToken } from "@/shared/api";

type SessionContextValue = {
  /** null while the stored token is being read on startup */
  hasToken: boolean | null;
  signIn: () => void;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    getAccessToken().then((token) => setHasToken(token !== null));
  }, []);

  const signIn = () => setHasToken(true);

  const signOut = async () => {
    await deleteAccessToken();
    setHasToken(false);
  };

  return (
    <SessionContext.Provider value={{ hasToken, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextValue => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
};
