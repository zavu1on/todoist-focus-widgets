import { type CurrentUser, TodoistApi } from "@doist/todoist-sdk";

export const fetchTodoistUser = (accessToken: string): Promise<CurrentUser> =>
  new TodoistApi(accessToken).getUser();
