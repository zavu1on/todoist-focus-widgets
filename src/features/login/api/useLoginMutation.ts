import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { setAccessToken } from "@/shared/api";
import { useSession } from "@/shared/model";
import { getLoginErrorMessage } from "../model/getLoginErrorMessage";
import { fetchTodoistUser } from "./fetchTodoistUser";

export const useLoginMutation = () => {
  const { signIn } = useSession();

  return useMutation({
    mutationFn: async (accessToken: string) => {
      try {
        return await fetchTodoistUser(accessToken);
      } catch (error) {
        throw new Error(getLoginErrorMessage(error));
      }
    },
    onSuccess: async (user, accessToken) => {
      await setAccessToken(accessToken);

      const firstName = user.fullName.split(" ")[0];
      Toast.show({
        type: "success",
        text1: `Welcome back, ${firstName}!`,
        text2: "Your Todoist is connected and ready to go.",
      });

      signIn();
    },
  });
};
