import messagesData from "../jsons/messages.json";

export const getDailyMessageHelper = (): string => {
  const messages = messagesData.messages;
  const today = new Date();
  const index = today.getDate() % messages.length;
  return messages[index];
};
