import * as SecureStore from "expo-secure-store";
import { ACCESS_TOKEN_STORAGE_KEY } from "./accessTokenStorageKey";

export const deleteAccessToken = (): Promise<void> =>
  SecureStore.deleteItemAsync(ACCESS_TOKEN_STORAGE_KEY);
