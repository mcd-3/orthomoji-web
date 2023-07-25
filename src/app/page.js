'use client';

import { useState } from "react";

import styles from './page.module.css'
import btnStyles from './styles/button.module.css';
import './globals.css';

import NavBar from './components/navbar.js';
import Footer from './components/footer.js';
import TitleBar from './components/titlebar.js';
import ScaleContainer from './components/scaleContainer.js';
import CanvasMessage from './components/canvasMessage.js';
import Button from './components/button.js';
import TextInput from './components/textInput.js';
import Header from './components/header.js';
import EmojiPickerDialog from './components/emojiPickerDialog';
import Image from 'next/image';

import { Orthomoji } from '../../orthomoji/index';

import paintIcon from './assets/brush.svg';
import generateIcon from './assets/pen.svg';
import downloadIcon from './assets/download.svg';
import loadingIcon from './assets/loading.svg';
import errorIcon from './assets/close-circle.svg';

const CANVAS_ID = 'main-canvas';

export default function Home() {
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const [showCanvasImage, setShowCanvasImage] = useState(true);
  const [canvasMessage, setCanvasMessage] = useState("No words generated");
  const [canvasIcon, setCanvasIcon] = useState(paintIcon);

  const [textIsValid, setTextIsValid] = useState(true);
  const [emojiIsValid, setEmojiIsValid] = useState(true);
  const [textError, setTextError] = useState("Text must not be empty");
  const [emojiError, setEmojiError] = useState("");
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState("");

  const [generateActive, setGenerateActive] = useState(true);
  const [downloadActive, setDownloadActive] = useState(false);

  const [textArt, setTextArt] = useState("");

  const wait = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const getImageName = (text) => {
    const sanitizedText = text
      .trim()
      .toLowerCase()
      .replace(/ /g, "_");
    return `orthomoji_${sanitizedText}.png`;
  }

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

  const displayEmojiPickerDialog = () => {
    setEmojiPickerVisible(true);
  }

  const dismissEmojiPickerDialog = () => {
    setEmojiPickerVisible(false);
  }

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

  const canvas = <canvas id={CANVAS_ID} className="canvas"></canvas>;

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

  const onTextChange = (event) => {
    const text = event.target.value;
    validateText(text);
  };

  const onEmojiSelect = (emojiData, event) => {
    setEmoji(emojiData.emoji);
    validateEmoji(emojiData.emoji);
  }

  /**
   * Downloads the content of the canvas as a png image
   */
  const Download = () => {
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
  const Generate = () => {
    // Validate Text + Emoji
    const isTextValid = validateText(text);
    const isEmojiValid = validateEmoji(emoji);

    if (!isTextValid || !isEmojiValid) {
      return false;
    }

    setShowCanvasImage(true);
    createCanvasMessage("Generating...", "loading");

    try {
      const orthomoji = new Orthomoji(CANVAS_ID); 
      orthomoji
        .setText(text)
        .setEmoji(emoji)
        .setEmojiSize(24)
        .generate();

      // Simulate loading since generation is instant
      setGenerateActive(false);
      wait(3000).then(() => {
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

  return (
    <main className='main'>
      {emojiPickerVisible &&
        <EmojiPickerDialog onEmojiClick={onEmojiSelect} onDismiss={dismissEmojiPickerDialog} />
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
              onClick={Generate}
              disabled={!generateActive}
            />
          </div>
          <div className={styles["button-column-right"]}>
            <Button
              iconSrc={downloadIcon}
              text={"Download"}
              className={btnStyles.download}
              onClick={Download}
              disabled={!downloadActive}
            />
          </div>
        </div>
        <br />
        <div className={styles.row}>
          <Header text={"Customize your Message"}/>
        </div>
        <div className={styles.row}>
          <div className={styles["main-text-input-container"]}>
            <TextInput
              label={"Enter text here..."}
              setTextState={setText}
              value={text}
              error={textError}
              showError={!textIsValid}
              onChange={onTextChange}
              maxLength={999}
            />
          </div>
          <div className={styles["main-emoji-input-container"]} onClick={displayEmojiPickerDialog}>
            <TextInput
              label={"😃❤️🎉..."}
              setTextState={setEmoji}
              readOnly={true}
              value={emoji}
              error={emojiError}
              showError={!emojiIsValid}
            />
          </div>
        </div>
        <br />
        {canvas}
      </div>
      <Footer author={"Matthew Carvalho-Dagenais"} date={"2023"} licenseHref={"https://github.com/mcd-3/orthomoji-web/blob/main/LICENSE.md"} />
    </main>
  )
}
