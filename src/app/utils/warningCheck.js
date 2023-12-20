const EMOJI_SIZE_CAP = 60;

/**
 * Verifies if two emojis are matching
 *
 * @param {string} emojiOne - First emoji to compare
 * @param {string} emojiTwo - Second emoji to compare
 * @returns {boolean} True if emojis match, false if not
 */
const areEmojisMatching = (emojiOne, emojiTwo) => {
  return (emojiOne === emojiTwo && (emojiOne.trim() !== "" && emojiTwo !== ""));
}

/**
 * Checks if a font size exceeds the font cap
 *
 * @param {number} fontSize - Font size
 * @returns True if font size is greater than the cap size, false if not.
 */
const isFontBig = (fontSize) => fontSize >= EMOJI_SIZE_CAP;

export { areEmojisMatching, isFontBig };
