import AsyncStorage from "@react-native-async-storage/async-storage";
import { TODOIST_SYNC_TOKEN_KEY } from "../const";

export const getSyncToken = async (): Promise<string> => {
  const token = await AsyncStorage.getItem(TODOIST_SYNC_TOKEN_KEY);

  return token === null ? "*" : token;
};
