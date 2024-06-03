'use client';

// Libraries + Tools
import { useState } from "react";
import { useWindowResize } from './hooks/useWindowResize.js';
import { useCanvasState } from "./hooks/useCnvasState.js";
import { Orthomoji } from 'orthomoji-dom';
import { areEmojisMatching, isFontBig } from './utils/warningCheck.js';
import { wait } from './utils/wait.js';
import { getImageName } from './utils/images.js';
import { validateText, validateEmoji, validateEmojiSize } from './utils/validation.js';
import { generateTextInput } from './utils/componentGenerator.js';

// Styles
import styles from './styles/pages/page.module.css'
import btnStyles from './styles/components/button.module.css';
import './globals.css';

// Components
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

// Icons
import paintIcon from '/public/icons/instant-picture.svg';
import generateIcon from '/public/icons/pen.svg';
import downloadIcon from '/public/icons/download.svg';
import loadingIcon from '/public/icons/loading.svg';
import errorIcon from '/public/icons/close-circle.svg';
import clearIcon from '/public/icons/trash.svg';

// Text Strings
import {
  APP_NAME_TITLE,
  APP_REPOSITORY,
  APP_DESCRIPTION,
  APP_AUTHOR,
  APP_YEAR,
  APP_LICENSE_URL,
  MAIN_TEXT_INPUT_PLACEHOLDER,
  EMOJI_TEXT_INPUT_PLACEHOLDER,
  EMOJI_SIZE_TEXT_INPUT_PLACEHOLDER,
  SECONDARY_EMOJI_TEXT_INPUT_PLACEHOLDER,
  SECONDARY_EMOJI_TEXT_INPUT_PLACEHOLDER_MOBILE,
  CANVAS_EMPTY,
  ERROR_TEXT_EMPTY,
  ERROR_GENERATING_TEXT,
  GENERATING,
  BUTTON_GENERATE,
  BUTTON_DOWNLOAD,
  BUTTON_CLEAR,
  HEADER_TITLE,
  ADVANCED_FEATURES,
  ADVANCED_FEATURES_EXTENDED,
  BACKGROUND
} from './text.json';

const CANVAS_ID = 'main-canvas';
const EMOJI_SIZE_DEFAULT = 24;

export default function Home() {
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [secondaryEmojiPickerVisible, setSecondaryEmojiPickerVisible] = useState(false);

  const { canvasState, setCanvasState } = useCanvasState({
    message: CANVAS_EMPTY,
    icon: paintIcon,
    showImage: true
  });

  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState("");
  const [emojiSize, setEmojiSize] = useState("");
  const [secondaryEmoji, setSecondaryEmoji] = useState("");
  const [colorState, setColorState] = useState("");

  const [textValid, setTextValid] = useState({
    isValid: true,
    errorMessage: ERROR_TEXT_EMPTY,
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
  const [textArt, setTextArt] = useState("");
  const { isDesktop } = useWindowResize();

  const [buttonActive, setButtonActive] = useState({
    generate: true,
    download: false,
  });

  const isWarningVisible = (isExpanded && (areEmojisMatching(emoji, secondaryEmoji) || isFontBig(emojiSize)));
  const colourPickerClass = isDesktop ? "medium-row" : "large-row";
  const canvas = <canvas id={CANVAS_ID} className="canvas"></canvas>;

  // Main text input to type text to emojify
  const mainTextInput = generateTextInput({
    label: MAIN_TEXT_INPUT_PLACEHOLDER,
    setTextState: setText,
    value: text,
    error: textValid.errorMessage,
    showError: !textValid.isValid,
    onChange: (event) => {
      const text = event.target.value;
      validateText({ text, setTextValid });
    },
    maxLength: 999
  });

  // Main emoji input to use to make words with emojis
  const mainEmojiInput = generateTextInput({
    label: EMOJI_TEXT_INPUT_PLACEHOLDER,
    setTextState: setEmoji,
    readOnly: true,
    value: emoji,
    error: emojiValid.errorMessage,
    showError: !emojiValid.isValid,
    hasClearButton: true,
  });

  // Input to use to change font size of emojis
  const emojiSizeInput = generateTextInput({
    label: EMOJI_SIZE_TEXT_INPUT_PLACEHOLDER,
    setTextState: setEmojiSize,
    value: emojiSize,
    error: emojiSizeValid.errorMessage,
    showError: !emojiSizeValid.isValid,
    onChange: (event) => {
      const size = event.target.value;
      validateEmojiSize({ size, setEmojiSizeValid });
    }
  });

  // Input to use to add secondary/spacing emojis
  const secondaryEmojiInput = generateTextInput({
    label: isDesktop ? SECONDARY_EMOJI_TEXT_INPUT_PLACEHOLDER : SECONDARY_EMOJI_TEXT_INPUT_PLACEHOLDER_MOBILE,
    setTextState: setSecondaryEmoji,
    readOnly: true,
    value: secondaryEmoji,
    error: "",
    showError: false,
    hasClearButton: true,
  });

  /**
   * Displays an error to the canvas
   *
   * @param {string} error - Error messaage to log
   */
  const setCanvasError = (error) => {
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
        setCanvasState({
          ...canvasState,
          showImage: false,
        });
        setTextArt(url);
        setButtonActive({generate: true, download: true });
      }).catch((err) => {
        setCanvasError(`An error has occured. Please review the below stack trace:\n${err}`);
      });
    } catch (e) {
      setCanvasError(`An error has occured. Please review the below stack trace:\n${e}`);
    }
  };

  return (
    <main className='main'>
      {emojiPickerVisible &&
        <EmojiPickerDialog
          onEmojiClick={(emojiData, event) => {
            setEmoji(emojiData.emoji);
            validateEmoji({ emoji: emojiData.emoji, setEmojiValid });
            setEmojiPickerVisible(false);
          }}
          onDismiss={() => setEmojiPickerVisible(false)}
        />
      }
      {secondaryEmojiPickerVisible &&
        <EmojiPickerDialog
          onEmojiClick={(emojiData, event) => {
            setSecondaryEmoji(emojiData.emoji);
            validateEmoji({ emoji: emojiData.emoji, setEmojiValid });
            setSecondaryEmojiPickerVisible(false);
          }}
          onDismiss={() => setSecondaryEmojiPickerVisible(false)}
        />
      }
      <div className='content-container'>
        <NavBar title={APP_NAME_TITLE} github={APP_REPOSITORY} />
        <TitleBar src={""} subtext={APP_DESCRIPTION} />
        <br />
        <ScaleContainer>
          {canvasState.showImage &&
            <CanvasMessage
              message={canvasState.message}
              iconSrc={canvasState.icon}
              iconAlt="No image generated"
            />
          }

          {!canvasState.showImage &&
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
              text={BUTTON_GENERATE}
              className={btnStyles.generate}
              onClick={generateTextArt}
              disabled={!buttonActive.generate}
            />
          </div>
          <div className={styles["button-column-right"]}>
            <Button
              iconSrc={downloadIcon}
              text={BUTTON_DOWNLOAD}
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
          <Header text={HEADER_TITLE}/>
        </div>
        {isDesktop
          ?
            <div className={styles.row}>
              <div className={styles["main-text-input-container"]}>
                { mainTextInput }
              </div>
              <div className={styles["main-emoji-input-container"]} onClick={() => setEmojiPickerVisible(true)}>
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
                <div className={styles["main-emoji-input-container"]} onClick={() => setEmojiPickerVisible(true)}>
                  { mainEmojiInput }
                </div>
              </div>
            </div>
        }
        <Spacer />
        <div className={styles.row}>
          <CollapseContent
            collapsedText={ADVANCED_FEATURES}
            expandedText={ADVANCED_FEATURES}
            isExpanded={isExpanded}
            setExpanded={setExpanded}
            onExpandChange={() => {
              setUseAdvancedFeatures((prevIsUsed) => !prevIsUsed);
              setExpanded((prevExpanded) => !prevExpanded);
            }}
          >
            <div className={styles["collapsed-container"]}>
              <div className={styles["large-row"]}>
                <p className={styles["collapsed-disclaimer"]}>{ADVANCED_FEATURES_EXTENDED}</p>
              </div>
              {isDesktop
                ?
                  <div className={styles["large-row"]}>
                    <div className={styles["emoji-size-container"]}>
                      { emojiSizeInput }
                    </div>
                    <div className={styles["secondary-emoji-container"]} onClick={() => setSecondaryEmojiPickerVisible(true)}>
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
                    <div className={styles["secondary-emoji-container"]} onClick={() => setSecondaryEmojiPickerVisible(true)}>
                      { secondaryEmojiInput }
                    </div>
                  </div>
                </div>
              }
              <br/>
              <div className={styles[colourPickerClass]}>
                <ColorInput
                  placeholder={BACKGROUND}
                  colorState={colorState}
                  setColorState={setColorState}
                />
              </div>
              <br />
              <div className={styles["large-row"]}>
                <div className={styles["button-column-center"]}>
                  <Button
                    iconSrc={clearIcon}
                    text={BUTTON_CLEAR}
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
      <Footer author={APP_AUTHOR} date={APP_YEAR} licenseHref={APP_LICENSE_URL} />
    </main>
  )
}
