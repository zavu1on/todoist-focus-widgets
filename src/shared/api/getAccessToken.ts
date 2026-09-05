import * as SecureStore from "expo-secure-store";
import { ACCESS_TOKEN_STORAGE_KEY } from "./accessTokenStorageKey";

export const getAccessToken = (): Promise<string | null> =>
  SecureStore.getItemAsync(ACCESS_TOKEN_STORAGE_KEY);
