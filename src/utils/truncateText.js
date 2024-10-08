export default function truncateText(text, maxChar) {
  if (typeof text === "string") {
    if (text?.length <= maxChar) {
      return text;
    } else {
      const truncatedText = text?.slice(0, maxChar);
      return `${truncatedText}...`;
    }
  } else {
    return text;
  }
}
