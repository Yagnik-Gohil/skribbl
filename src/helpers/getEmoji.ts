import { emojiList } from "./emoji";

const getEmoji = () => {
  return emojiList[Math.floor(Math.random() * emojiList.length)];
};

export default getEmoji;
