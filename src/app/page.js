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
  const [textError, setTextError] = useState("");
  const [emojiError, setEmojiError] = useState("");
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState("");

  const [emojiImage, setEmojiImage] = useState("");

  const displayEmojiPickerDialog = () => {
    setEmojiPickerVisible(true);
  }

  const dismissEmojiPickerDialog = () => {
    setEmojiPickerVisible(false);
  }

  const canvas = <canvas id={CANVAS_ID} className="canvas"></canvas>;

  const onTextChange = () => {

  };

  function onEmojiSelect(emojiData, event) {
    console.log(emojiData);
    setEmoji(emojiData.emoji);
  }

  /**
   * Downloads the content of the canvas as a png image
   */
  const Download = () => {
    let canvasHTML = document.getElementById(CANVAS_ID);
    let url = canvasHTML.toDataURL("image/png");
    let link = document.createElement('a');
    link.download = 'orthomoji.png';
    link.href = url;
    link.click();
  };

  /**
   * Generate the emoji word to the canvas
   */
  const Generate = () => {
    setShowCanvasImage(true);
    setCanvasMessage("Generating...");
    setCanvasIcon(loadingIcon);

    try {
      const orthomoji = new Orthomoji(CANVAS_ID); 
      orthomoji
        .setText(text)
        .setEmoji(emoji)
        .setEmojiSize(24)
        .generate();

      let canvasHTML = document.getElementById(CANVAS_ID);
      let url = canvasHTML.toDataURL("image/png");
      setShowCanvasImage(false);
      setEmojiImage(url);
    } catch (e) {
      console.log(e);
      setCanvasMessage("An error has occured");
      setCanvasIcon(errorIcon);
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
                src={emojiImage}
                className={styles["emoji-word"]}
              />
            </div>
          }
        </ScaleContainer>
        <br />
        <div className={styles["button-container"]}>
          <div className={styles["button-column-left"]}>
            <Button iconSrc={generateIcon} text={"Generate"} className={btnStyles.generate} onClick={Generate} />
          </div>
          <div className={styles["button-column-right"]}>
            <Button iconSrc={downloadIcon} text={"Download"} className={btnStyles.download} onClick={Download}/>
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
            />
          </div>
          <div className={styles["main-emoji-input-container"]} onClick={displayEmojiPickerDialog}>
            <TextInput
              label={"😃❤️🎉..."}
              setTextState={setEmoji}
              readOnly={true}
              value={emoji}
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
