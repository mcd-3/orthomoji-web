import {
  ERROR_TEXT_EMPTY,
  ERROR_30_CHAR_LIMIT,
  ERROR_NON_ALPHA_NUMERIC,
  ERROR_PICK_EMOJI,
  ERROR_SIZE_VALID_NUMBER,
  ERROR_SIZE_OVER_128,
  ERROR_LOWER_THAN_0,
} from '../text.json';

/**
 * Sets an error for an input
 * Does not display the error; the error will need to be displayed separately
 * This is a private function
 * 
 * @deprecated
 * 
 * @param {string} message - Error message to display
 * @param {boolean} isValid - Flag to show error message
 * @param {string} type - Type of input. Can be either 'text' or 'emoji'
 * @returns {boolean} isValid
 */
const setError = (message, isValid, type) => {
  if (type !== "text" && type !== "emoji") {
    throw new Error(`${type} is not valid. Use 'text' or 'emoji'`);
  }

  if (type === "text") {
    setTextValid({
      isValid,
      errorMessage: message,
    })
  } else if (type === "emoji") {
    setEmojiValid({
      isValid,
      errorMessage: message
    });
  }

  return isValid;
}

/**
 * Validate text for text art generation
 * 
 * @param {string} text - Text to validate
 * @returns {boolean} True if valid, false if not
 */
const validateText = ({
  text,
  setTextValid,
}) => {
  const supportedCharsRegex = /[^a-z0-9 ,.?!:'"\n]/ig;

  if (text.length > 30) {
    setTextValid({
      isValid: false,
      errorMessage: ERROR_30_CHAR_LIMIT,
    });
    return false;
  }

  if (text.trim() == "") {
    setTextValid({
      isValid: false,
      errorMessage: ERROR_TEXT_EMPTY,
    });
    return false;
  }

  if (supportedCharsRegex.test(text.toLowerCase())) {
    setTextValid({
      isValid: false,
      errorMessage: ERROR_NON_ALPHA_NUMERIC,
    });
    return false;
  }

  setTextValid({
    isValid: true,
    errorMessage: "",
  });
  return true;
}

/**
 * Validate emoji character(s) for text art generation
 * 
 * @param {string} text - Emoji character(s) to validate
 * @returns {boolean} True if valid, false if not
 */
const validateEmoji = ({
  emoji,
  setEmojiValid
}) => {
  if (emoji.trim() == "") {
    setEmojiValid({
      isValid: false,
      errorMessage: ERROR_PICK_EMOJI,
    });
    return false;
  }

  setEmojiValid({
    isValid: true,
    errorMessage: "",
  });
  return true;
}

/**
 * Validate emoji size for text art generation
 * 
 * @param {string} size - Emoji size to validate
 * @returns {boolean} True if valid, false if not
 */
const validateEmojiSize = ({
  size,
  setEmojiSizeValid,
}) => {
  const validNumberRegex = /^-?\d*\.?\d+$/
  if (size == "") {
    setEmojiSizeValid({
      isValid: true,
      errorMessage: "",
    });
    return true;
  } else if (!validNumberRegex.test(size)) {
    setEmojiSizeValid({
      isValid: false,
      errorMessage: ERROR_SIZE_VALID_NUMBER,
    }); 
    return false;
  }

  if (size > 128) {
    setEmojiSizeValid({
      isValid: false,
      errorMessage: ERROR_SIZE_OVER_128,
    }); 
    return false;
  }

  if (size < 1) {
    setEmojiSizeValid({
      isValid: false,
      errorMessage: ERROR_LOWER_THAN_0,
    }); 
    return false;
  }

  setEmojiSizeValid({ isValid: true, errorMessage: "" }); 
  return true;
};

export { validateText, validateEmoji, validateEmojiSize };
