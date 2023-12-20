'use client';

import { useState, useEffect } from "react";

import styles from './styles/pages/page.module.css'
import btnStyles from './styles/components/button.module.css';
import './globals.css';

import NavBar from './components/navbar.js';
import Footer from './components/footer.js';
import TitleBar from './components/titlebar.js';
import ScaleContainer from './components/scaleContainer.js';
import CanvasMessage from './components/canvasMessage.js';
import Button from './components/button.js';
import TextInput from './components/textInput.js';
import Header from './components/header.js';
import EmojiPickerDialog from './components/emojiPickerDialog.js';
import CollapseContent from "./components/collapseContent.js";
import Spacer from "./components/spacer.js";
import ColorInput from "./components/colorInput.js";
import Warning from "./components/warning";
import Image from 'next/image';

import { Orthomoji } from 'orthomoji-dom';
import { areEmojisMatching, isFontBig } from './utils/warningCheck.js';

import paintIcon from './assets/instant-picture.svg';
import generateIcon from './assets/pen.svg';
import downloadIcon from './assets/download.svg';
import loadingIcon from './assets/loading.svg';
import errorIcon from './assets/close-circle.svg';
import clearIcon from './assets/trash.svg';

const CANVAS_ID = 'main-canvas';
const EMOJI_SIZE_DEFAULT = 24;
const MAIN_TEXT_INPUT_PLACEHOLDER = "Enter text here...";
const EMOJI_TEXT_INPUT_PLACEHOLDER = "😃❤️🎉...";
const EMOJI_SIZE_TEXT_INPUT_PLACEHOLDER = "Emoji Size...";
const SECONDARY_EMOJI_TEXT_INPUT_PLACEHOLDER = "Secondary Emoji...";
const SECONDARY_EMOJI_TEXT_INPUT_PLACEHOLDER_MOBILE = "2nd Emoji...";

export default function Home() {
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [secondaryEmojiPickerVisible, setSecondaryEmojiPickerVisible] = useState(false);

  const [showCanvasImage, setShowCanvasImage] = useState(true);
  const [canvasMessage, setCanvasMessage] = useState("No words generated");
  const [canvasIcon, setCanvasIcon] = useState(paintIcon);

  const [textIsValid, setTextIsValid] = useState(true);
  const [emojiIsValid, setEmojiIsValid] = useState(true);
  const [emojiSizeIsValid, setEmojiSizeIsValid] = useState(true);
  const [textError, setTextError] = useState("Text must not be empty");
  const [emojiError, setEmojiError] = useState("");
  const [emojiSizeError, setEmojiSizeError] = useState("");
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState("");
  const [emojiSize, setEmojiSize] = useState("");
  const [secondaryEmoji, setSecondaryEmoji] = useState("");
  const [colorState, setColorState] = useState("");

  const [isExpanded, setExpanded] = useState(false);
  const [useAdvancedFeatures, setUseAdvancedFeatures] = useState(false);

  const [generateActive, setGenerateActive] = useState(true);
  const [downloadActive, setDownloadActive] = useState(false);

  const [textArt, setTextArt] = useState("");

  const [width, setWidth] = useState(0);
  const isDesktop = width > 768;
  const isWarningVisible = (isExpanded && (areEmojisMatching(emoji, secondaryEmoji) || isFontBig(emojiSize)));

  const canvas = <canvas id={CANVAS_ID} className="canvas"></canvas>;

  useEffect(() => {
    const handleWindowSizeChange = () => {
      setWidth(window.innerWidth);
    }

    setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
}, []);

  /**
   * Pauses execution for a set amount of time
   * 
   * @param {number} ms - Amount of time in milliseconds to pause for
   * @returns {Promise}
   */
  const wait = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generates a name for the downloaded canvas image file
   * 
   * @param {string} text - Text to add to image name
   * @returns {string} Filename
   */
  const getImageName = (text) => {
    const sanitizedText = text
      .trim()
      .toLowerCase()
      .replace(/[\W_]+/g, "");
    return `orthomoji_${sanitizedText}.png`;
  }

  /**
   * Sets a message and icon to the canvas
   * Does not display the message; the error will need to be displayed separately
   * 
   * @param {string} message - Message to display
   * @param {SVG} icon - SVG icon to display
   */
  const createCanvasMessage = (message, icon) => {
    setCanvasMessage(message);
    switch (icon) {
      case "paint":
        setCanvasIcon(paintIcon);
        break;
      case "loading":
        setCanvasIcon(loadingIcon);
        break;
      case "error":
      default:
        setCanvasIcon(errorIcon);
        break;
    }
  }

  /**
   * Displays the emoji picker dialog
   */
  const displayEmojiPickerDialog = () => { setEmojiPickerVisible(true); }

  /**
   * Dismisses the emoji picker dialog
   */
  const dismissEmojiPickerDialog = () => { setEmojiPickerVisible(false); }

  /**
   * Displays the secondary emoji picker dialog
   */
  const displaySecondaryEmojiPickerDialog = () => { setSecondaryEmojiPickerVisible(true); }

  /**
   * Dismisses the secondary emoji picker dialog
   */
  const dismissSecondaryEmojiPickerDialog = () => { setSecondaryEmojiPickerVisible(false); }



  /**
   * Sets an error for an input
   * Does not display the error; the error will need to be displayed separately
   * 
   * @param {string} message - Error message to display
   * @param {boolean} isValid - Flag to show error message
   * @param {string} type - Type of input. Can be either 'text' or 'emoji'
   * @returns {boolean} isValid
   */
  const showErrorInput = (message, isValid, type) => {
    if (type !== "text" && type !== "emoji") {
      throw new Error(`${type} is not valid. Use 'text' or 'emoji'`);
    }

    if (type === "text") {
      setTextError(message);
      setTextIsValid(isValid);
    } else if (type === "emoji") {
      setEmojiError(message);
      setEmojiIsValid(isValid);
    }

    return isValid;
  }

  /**
   * Validate text for text art generation
   * 
   * @param {string} text - Text to validate
   * @returns {boolean} True if valid, false if not
   */
  const validateText = (text) => {
    const supportedCharsRegex = /[^a-z0-9 ,.?!:'"\n]/ig;
    const typeText = "text";

    if (text.length > 30) {
      return showErrorInput(
        "Text must be 30 characters or less",
        false,
        typeText
      );
    }

    if (text.trim() == "") {
      return showErrorInput(
        "Text must not be empty",
        false,
        typeText
      );
    }

    if (supportedCharsRegex.test(text.toLowerCase())) {
      return showErrorInput(
        "Text must only contain alpha-numeric characters and/or ,.?!:'\" ",
        false,
        typeText
      );
    }

    return showErrorInput("", true, typeText);
  }

  /**
   * Validate emoji character(s) for text art generation
   * 
   * @param {string} text - Emoji character(s) to validate
   * @returns {boolean} True if valid, false if not
   */
  const validateEmoji = (emoji) => {
    if (emoji.trim() == "") {
      setEmojiError("You must pick an emoji");
      setEmojiIsValid(false);
      return false;
    }

    setEmojiError("");
    setEmojiIsValid(true);
    return true;
  }

  /**
   * Validate emoji size for text art generation
   * 
   * @param {string} size - Emoji size to validate
   * @returns {boolean} True if valid, false if not
   */
  const validateEmojiSize = (size) => {
    const validNumberRegex = /^-?\d*\.?\d+$/
    if (size == "") {
      setEmojiSizeError("");
      setEmojiSizeIsValid(true);
      return true;
    } else if (!validNumberRegex.test(size)) {
      setEmojiSizeError("Size must be a valid number");
      setEmojiSizeIsValid(false);
      return false;
    }

    if (size > 128) {
      setEmojiSizeError("Size must be lower than 128");
      setEmojiSizeIsValid(false);
      return false;
    }

    if (size < 1) {
      setEmojiSizeError("Size must be higher than 0");
      setEmojiSizeIsValid(false);
      return false;
    }

    setEmojiSizeError("");
    setEmojiSizeIsValid(true);
    return true;
  };

  /**
   * Sets and validates text
   *
   * @param {*} event - Input event
   */
  const onTextChange = (event) => {
    const text = event.target.value;
    validateText(text);
  };

  /**
   * Sets and validates emoji
   *
   * @param {object} emojiData - Object containing emoji data
   * @param {*} event - Input event
   */
  const onEmojiSelect = (emojiData, event) => {
    setEmoji(emojiData.emoji);
    validateEmoji(emojiData.emoji);
    dismissEmojiPickerDialog();
  }

  /**
   * Sets and validates emoji
   *
   * @param {object} emojiData - Object containing emoji data
   * @param {*} event - Input event
   */
    const onSecondaryEmojiSelect = (emojiData, event) => {
      setSecondaryEmoji(emojiData.emoji);
      validateEmoji(emojiData.emoji);
      dismissSecondaryEmojiPickerDialog();
    }

  /**
   * Sets and validates emoji size
   *
   * @param {*} event - Input event
   */
  const onEmojiSizeChange = (event) => {
    const size = event.target.value;
    validateEmojiSize(size);
  };

  /**
   * Downloads the content of the canvas as a png image
   */
  const downloadTextArt = () => {
    let canvasHTML = document.getElementById(CANVAS_ID);
    let url = canvasHTML.toDataURL("image/png");
    let link = document.createElement('a');
    link.download = getImageName(text);
    link.href = url;
    link.click();
  };

  /**
   * Generate the emoji word to the canvas
   */
  const generateTextArt = () => {
    // Validate Text + Emoji
    const isTextValid = validateText(text);
    const isEmojiValid = validateEmoji(emoji);

    if (!isTextValid || !isEmojiValid) {
      return false;
    }

    // Advanced options validation
    if (useAdvancedFeatures) {
      const isEmojiSizeValid = validateEmojiSize(emojiSize);
      if (!isEmojiSizeValid) {
        return false;
      }
    }

    setShowCanvasImage(true);
    createCanvasMessage("Generating...", "loading");

    try {
      const emojiSizeFinal = 
        useAdvancedFeatures && emojiSize !== ""
          ? parseInt(emojiSize)
          : EMOJI_SIZE_DEFAULT;

      const orthomoji = new Orthomoji(CANVAS_ID); 
      orthomoji
        .setText(text)
        .setEmoji(emoji)
        .setEmojiSize(emojiSizeFinal)

      if (useAdvancedFeatures && secondaryEmoji !== "") {
        orthomoji.setSpaceEmoji(secondaryEmoji);
      }

      if (useAdvancedFeatures && colorState !== "") {
        console.log(colorState);
        orthomoji.setBackgroundStyle(colorState);
      }

      orthomoji.generate();

      // Simulate loading since generation is instant
      setGenerateActive(false);
      wait(2500).then(() => {
        let canvasHTML = document.getElementById(CANVAS_ID);
        let url = canvasHTML.toDataURL("image/png");
        setShowCanvasImage(false);
        setTextArt(url);
        setDownloadActive(true);
        setGenerateActive(true);
      });
    } catch (e) {
      console.log(e);
      setDownloadActive(false);
      createCanvasMessage("An error has occured", "error");
    }
  };

  // Main text input to type text to emojify
  const mainTextInput = <TextInput
    label={MAIN_TEXT_INPUT_PLACEHOLDER}
    setTextState={setText}
    value={text}
    error={textError}
    showError={!textIsValid}
    onChange={onTextChange}
    maxLength={999}
  />

  // Main emoji input to use to make words with emojis
  const mainEmojiInput =  <TextInput
    label={EMOJI_TEXT_INPUT_PLACEHOLDER}
    setTextState={setEmoji}
    readOnly={true}
    value={emoji}
    error={emojiError}
    showError={!emojiIsValid}
  />

  // Input to use to change font size of emojis
  const emojiSizeInput = <TextInput
    label={EMOJI_SIZE_TEXT_INPUT_PLACEHOLDER}
    setTextState={setEmojiSize}
    value={emojiSize}
    error={emojiSizeError}
    showError={!emojiSizeIsValid}
    onChange={onEmojiSizeChange}
  />

  // Input to use to add secondary/spacing emojis
  const secondaryEmojiInput = <TextInput
    label={isDesktop ? SECONDARY_EMOJI_TEXT_INPUT_PLACEHOLDER : SECONDARY_EMOJI_TEXT_INPUT_PLACEHOLDER_MOBILE}
    setTextState={setSecondaryEmoji}
    readOnly={true}
    value={secondaryEmoji}
    error={""}
    showError={false}
  />

  return (
    <main className='main'>
      {emojiPickerVisible &&
        <EmojiPickerDialog onEmojiClick={onEmojiSelect} onDismiss={dismissEmojiPickerDialog} />
      }
      {secondaryEmojiPickerVisible &&
        <EmojiPickerDialog onEmojiClick={onSecondaryEmojiSelect} onDismiss={dismissSecondaryEmojiPickerDialog} />
      }
      <div className='content-container'>
        <NavBar title={"Orthomoji 🖌️"} github={"https://github.com/mcd-3/orthomoji-web"} />
        <TitleBar src={""} subtext={"Words made of emoji!"} />
        <br />
        <ScaleContainer>
          {showCanvasImage &&
            <CanvasMessage
              message={canvasMessage}
              iconSrc={canvasIcon}
              iconAlt="No image generated"
            />
          }

          {!showCanvasImage &&
            <div className={styles["canvas-background"]}>
              <Image
                src={textArt}
                className={styles["emoji-word"]}
              />
            </div>
          }
        </ScaleContainer>
        <br />
        <div className={styles["button-container"]}>
          <div className={styles["button-column-left"]}>
            <Button
              iconSrc={generateIcon}
              text={"Generate"}
              className={btnStyles.generate}
              onClick={generateTextArt}
              disabled={!generateActive}
            />
          </div>
          <div className={styles["button-column-right"]}>
            <Button
              iconSrc={downloadIcon}
              text={"Download"}
              className={btnStyles.download}
              onClick={downloadTextArt}
              disabled={!downloadActive}
            />
          </div>
        </div>
        {/* Warning message to help with UX */}
        {isWarningVisible
          ?
            <div>
              <br />
              <div className={styles["row-no-padding"]}>
                <Warning emojiSize={emojiSize} emojiArray={[emoji, secondaryEmoji]}/>
              </div>
            </div>
          :
            <br />
        }
        <div className={styles["row-no-padding"]}>
          <Header text={"Customize your Message"}/>
        </div>
        {isDesktop
          ?
            <div className={styles.row}>
              <div className={styles["main-text-input-container"]}>
                { mainTextInput }
              </div>
              <div className={styles["main-emoji-input-container"]} onClick={displayEmojiPickerDialog}>
                { mainEmojiInput }
              </div>
            </div>
          :
            <div>
              <div className={styles.row}>
                <div className={styles["main-text-input-container"]}>
                  { mainTextInput }
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles["main-emoji-input-container"]} onClick={displayEmojiPickerDialog}>
                  { mainEmojiInput }
                </div>
              </div>
            </div>
        }
        <Spacer />
        <div className={styles.row}>
          <CollapseContent
            collapsedText="Advanced Features"
            expandedText="Advanced Features"
            isExpanded={isExpanded}
            setExpanded={setExpanded}
            onExpandChange={() => {
              setUseAdvancedFeatures((prevIsUsed) => !prevIsUsed);
              setExpanded((prevExpanded) => !prevExpanded);
            }}
          >
            <div className={styles["collapsed-container"]}>
              <div className={styles["large-row"]}>
                <p className={styles["collapsed-disclaimer"]}>Advanced features will only apply if this is expanded!</p>
              </div>
              {isDesktop
                ?
                  <div className={styles["large-row"]}>
                    <div className={styles["emoji-size-container"]}>
                      { emojiSizeInput }
                    </div>
                    <div className={styles["secondary-emoji-container"]} onClick={displaySecondaryEmojiPickerDialog}>
                      { secondaryEmojiInput }
                    </div>
                  </div>
                :
                <div>
                  <div className={styles["large-row"]}>
                    <div className={styles["emoji-size-container"]}>
                      { emojiSizeInput }
                    </div>
                  </div>
                  <div className={styles["large-row"]}>
                    <div className={styles["secondary-emoji-container"]} onClick={displaySecondaryEmojiPickerDialog}>
                      { secondaryEmojiInput }
                    </div>
                  </div>
                </div>
              }
              <br/>
              <div className={styles["large-row"]}>
                <ColorInput
                  placeholder="Background..."
                  colorState={colorState}
                  setColorState={setColorState}
                />
              </div>
              <br />
              <div className={styles["large-row"]}>
                <div className={styles["button-column-center"]}>
                  <Button
                    iconSrc={clearIcon}
                    text={"Clear"}
                    className={btnStyles.clear}
                    onClick={() => {
                      setEmojiSize("");
                      setEmojiSizeIsValid(true);
                      setSecondaryEmoji("");
                      setColorState("");
                    }}
                    disabled={false}
                  />
                </div>
              </div>
              <br/>
            </div>
          </CollapseContent>
        </div>
        <br />
        {canvas}
      </div>
      <Footer author={"Matthew Carvalho-Dagenais"} date={"2023"} licenseHref={"https://github.com/mcd-3/orthomoji-web/blob/main/LICENSE.md"} />
    </main>
  )
}
