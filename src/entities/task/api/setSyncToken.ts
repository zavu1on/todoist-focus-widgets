import AsyncStorage from "@react-native-async-storage/async-storage";
import { TODOIST_SYNC_TOKEN_KEY } from "../const";

export const setSyncToken = (syncToken: string): Promise<void> =>
  AsyncStorage.setItem(TODOIST_SYNC_TOKEN_KEY, syncToken);
