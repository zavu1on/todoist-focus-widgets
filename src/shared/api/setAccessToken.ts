import * as SecureStore from "expo-secure-store";
import { ACCESS_TOKEN_STORAGE_KEY } from "./accessTokenStorageKey";

export const setAccessToken = (token: string): Promise<void> =>
  SecureStore.setItemAsync(ACCESS_TOKEN_STORAGE_KEY, token);
