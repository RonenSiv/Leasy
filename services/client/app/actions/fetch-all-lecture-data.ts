import { getChatMessages, getLecture } from "./server-actions";

export async function getFullLectureData(id: string) {
  const lectureResponse = await getLecture(id);
  const lectureData = lectureResponse?.data;

  // Fetch all pages of chat messages (adjust as needed)
  let page = 1;
  const allMessages: any[] = [];
  while (true) {
    const response = await getChatMessages(lectureData.chat.uuid, page);
    if (!response || !response.data || !response.data.length) break;
    allMessages.push(...response.data);
    page++;
  }

  // Transform messages to our ChatMessage type and reverse so the oldest appears first
  const chatHistory = allMessages
    .map((msg: any) => ({
      role: msg.sender === "assistant" ? "assistant" : "user",
      content: msg.message,
    }))
    .reverse();

  return {
    ...lectureData,
    chatHistory,
  };
}
