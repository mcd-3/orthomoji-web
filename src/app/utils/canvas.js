import { getImageName } from '../utils/images.js';
import { Orthomoji } from 'orthomoji-dom';
import { validateText, validateEmoji, validateEmojiSize } from '../utils/validation.js';
import { wait } from '../utils/wait.js';

import {
  ERROR_GENERATING_TEXT,
  GENERATING,
} from '../text.json';
import loadingIcon from '/public/icons/loading.svg';
import errorIcon from '/public/icons/close-circle.svg';

// Default size for emojis
const EMOJI_SIZE_DEFAULT = 24;

/**
 * Displays an error to the canvas
 *
 * @param {string} error - Error messaage to log
 */
const setCanvasError = ({
  error,
  buttonActive,
  setButtonActive,
  canvasState,
  setCanvasState,
}) => {
  console.error(error);
  setButtonActive({...buttonActive, download: false });
  setCanvasState({
    ...canvasState,
    message: ERROR_GENERATING_TEXT,
    icon: errorIcon,
  });
};

/**
 * Downloads the content of the canvas as a png image
 */
const downloadTextArt = ({ canvasId, text }) => {
  let canvasHTML = document.getElementById(canvasId);
  let url = canvasHTML.toDataURL("image/png");
  let link = document.createElement('a');
  link.download = getImageName(text);
  link.href = url;
  link.click();
};

/**
 * Generates text art to a canvas
 *
 * @param {string} canvasId - ID of canvas to generate art to
 * @param {string} text - Text to write to canvas
 * @param {callback} setTextValid - React state to set text
 * @param {string} emoji - Emoji to make art from
 * @param {callback} setEmojiValid - React state to set emoji
 * @param {string} emojiSize - Font size of emoji
 * @param {callback} setEmojiSizeValid - React state for emoji size
 * @param {string} secondaryEmoji - Secondary/blank-space emoji
 * @param {string} colorState - Color of background
 * @param {boolean} buttonActive - True if download button is active. False if not
 * @param {callback} setButtonActive - React state to change download button enabled/disabled state
 * @param {object} canvasState - Canvas state object
 * @param {callback} setCanvasState - React state for main canvas
 * @param {callback} setTextArt - React state to set art to canvas
 * @param {boolean} useAdvancedFeatures - Boolean to use advanced features
 */
const generateTextArt = ({
  canvasId,
  text,
  setTextValid,
  emoji,
  setEmojiValid,
  emojiSize,
  setEmojiSizeValid,
  secondaryEmoji,
  colorState,
  buttonActive,
  setButtonActive,
  canvasState,
  setCanvasState,
  setTextArt,
  useAdvancedFeatures
}) => {
  // Validate Text + Emoji
  const isTextValid = validateText({ text, setTextValid });
  const isEmojiValid = validateEmoji({ emoji, setEmojiValid });

  if (!isTextValid || !isEmojiValid) {
    return false;
  }

  // Advanced options validation
  if (useAdvancedFeatures) {
    const isEmojiSizeValid = validateEmojiSize({ size: emojiSize, setEmojiSizeValid });
    if (!isEmojiSizeValid) {
      return false;
    }
  }

  setCanvasState({
    message: GENERATING,
    icon: loadingIcon,
    showImage: true,
  })

  try {
    const emojiSizeFinal = 
      useAdvancedFeatures && emojiSize !== ""
        ? parseInt(emojiSize)
        : EMOJI_SIZE_DEFAULT;

    const orthomoji = new Orthomoji(canvasId); 
    orthomoji
      .setText(text)
      .setEmoji(emoji)
      .setEmojiSize(emojiSizeFinal)

    if (useAdvancedFeatures && secondaryEmoji !== "") {
      orthomoji.setSpaceEmoji(secondaryEmoji);
    }

    if (useAdvancedFeatures && colorState !== "") {
      orthomoji.setBackgroundStyle(colorState);
    }

    orthomoji.generate();

    // Simulate loading since generation is instant
    setButtonActive({...buttonActive, generate: false });
    wait(2500).then(() => {
      let canvasHTML = document.getElementById(canvasId);
      let url = canvasHTML.toDataURL("image/png");
      setCanvasState({
        ...canvasState,
        showImage: false,
      });
      setTextArt(url);
      setButtonActive({generate: true, download: true });
    }).catch((err) => {
      setCanvasError({
        error: `An error has occured. Please review the below stack trace:\n${err}`,
        buttonActive,
        setButtonActive,
        canvasState,
        setCanvasState
      });
    });
  } catch (e) {
    setCanvasError({
      error: `An error has occured. Please review the below stack trace:\n${e}`,
      buttonActive,
      setButtonActive,
      canvasState,
      setCanvasState
    });
  }
};

export { setCanvasError, downloadTextArt, generateTextArt };
