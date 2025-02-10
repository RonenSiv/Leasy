import { mutate } from "swr";

export const revalidate = (query: string) => {
  switch (query) {
    case "/lecture":
      revalidateLecture();
      break;
    case "/user":
      revalidateUser();
      break;
    case "/chat":
      revalidateChat();
      break;
    case "/quiz":
      revalidateQuiz();
      break;
    case "/video":
      revalidateVideo();
      break;
    default:
      break;
  }
};

export const revalidateLecture = () => {
  mutate((key: string) => key.startsWith("/lecture"));
};

export const revalidateUser = () => {
  mutate((key: string) => key.startsWith("/user"));
};

export const revalidateChat = () => {
  mutate((key: string) => key.startsWith("/chat"));
};

export const revalidateQuiz = () => {
  mutate((key: string) => key.startsWith("/quiz"));
};

export const revalidateVideo = () => {
  mutate((key: string) => key.startsWith("/video"));
};
