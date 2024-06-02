'use client';

import { useState } from "react";
import { useWindowResize } from './hooks/useWindowResize.js';

import styles from './styles/pages/page.module.css'
import btnStyles from './styles/components/button.module.css';
import './globals.css';

import Image from 'next/image';
import {
  NavBar,
  Footer,
  TitleBar,
  ScaleContainer,
  CanvasMessage,
  Button,
  TextInput,
  Header,
  EmojiPickerDialog,
  CollapseContent,
  Spacer,
  ColorInput,
  Warning,
} from './components';

import { Orthomoji } from 'orthomoji-dom';
import { areEmojisMatching, isFontBig } from './utils/warningCheck.js';
import { wait } from './utils/wait.js';
import { getImageName } from './utils/images.js';

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

  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState("");
  const [emojiSize, setEmojiSize] = useState("");
  const [secondaryEmoji, setSecondaryEmoji] = useState("");
  const [colorState, setColorState] = useState("");

  const [textValid, setTextValid] = useState({
    isValid: true,
    errorMessage: "Text must not be empty",
  });

  const [emojiValid, setEmojiValid] = useState({
    isValid: true,
    errorMessage: "",
  });

  const [emojiSizeValid, setEmojiSizeValid] = useState({
    isValid: true,
    errorMessage: "",
  });

  const [isExpanded, setExpanded] = useState(false);
  const [useAdvancedFeatures, setUseAdvancedFeatures] = useState(false);

  const [buttonActive, setButtonActive] = useState({
    generate: true,
    download: false,
  })

  const [textArt, setTextArt] = useState("");

  const { isDesktop } = useWindowResize();

  const isWarningVisible = (isExpanded && (areEmojisMatching(emoji, secondaryEmoji) || isFontBig(emojiSize)));

  const colourPickerClass = isDesktop ? "medium-row" : "large-row";

  const canvas = <canvas id={CANVAS_ID} className="canvas"></canvas>;

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
      setEmojiValid({
        isValid: false,
        errorMessage: "You must pick an emoji",
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
  const validateEmojiSize = (size) => {
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
        errorMessage: "Size must be a valid number",
      }); 
      return false;
    }

    if (size > 128) {
      setEmojiSizeValid({
        isValid: false,
        errorMessage: "Size must be lower than 128",
      }); 
      return false;
    }

    if (size < 1) {
      setEmojiSizeValid({
        isValid: false,
        errorMessage: "Size must be higher than 0",
      }); 
      return false;
    }

    setEmojiSizeValid({ isValid: true, errorMessage: "" }); 
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
      setButtonActive({...buttonActive, generate: false });
      wait(2500).then(() => {
        let canvasHTML = document.getElementById(CANVAS_ID);
        let url = canvasHTML.toDataURL("image/png");
        setShowCanvasImage(false);
        setTextArt(url);
        setButtonActive({generate: true, download: true });
      });
    } catch (e) {
      console.log(e);
      setButtonActive({...buttonActive, download: false });
      createCanvasMessage("An error has occured", "error");
    }
  };

  // Main text input to type text to emojify
  const mainTextInput = <TextInput
    label={MAIN_TEXT_INPUT_PLACEHOLDER}
    setTextState={setText}
    value={text}
    error={textValid.errorMessage}
    showError={!textValid.isValid}
    onChange={onTextChange}
    maxLength={999}
  />

  // Main emoji input to use to make words with emojis
  const mainEmojiInput =  <TextInput
    label={EMOJI_TEXT_INPUT_PLACEHOLDER}
    setTextState={setEmoji}
    readOnly={true}
    value={emoji}
    error={emojiValid.errorMessage}
    showError={!emojiValid.isValid}
    hasClearButton={true}
  />

  // Input to use to change font size of emojis
  const emojiSizeInput = <TextInput
    label={EMOJI_SIZE_TEXT_INPUT_PLACEHOLDER}
    setTextState={setEmojiSize}
    value={emojiSize}
    error={emojiSizeValid.errorMessage}
    showError={!emojiSizeValid.isValid}
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
    hasClearButton={true}
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
              disabled={!buttonActive.generate}
            />
          </div>
          <div className={styles["button-column-right"]}>
            <Button
              iconSrc={downloadIcon}
              text={"Download"}
              className={btnStyles.download}
              onClick={downloadTextArt}
              disabled={!buttonActive.download}
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
              <div className={styles[colourPickerClass]}>
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
                      setEmojiSizeValid({
                        isValid: true,
                        errorMessage: "",
                      }); 
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
      <Footer author={"Matthew Carvalho-Dagenais"} date={"2023-2024"} licenseHref={"https://github.com/mcd-3/orthomoji-web/blob/main/LICENSE.md"} />
    </main>
  )
}
