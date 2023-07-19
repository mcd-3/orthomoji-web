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

export default function Home() {
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const [showCanvasImage, setShowCanvasImage] = useState(true);
  const [canvasMessage, setCanvasMessage] = useState("No words generated");
  const [canvasIcon, setCanvasIcon] = useState(paintIcon);

  const [emojiImage, setEmojiImage] = useState("");

  const displayEmojiPickerDialog = () => {
    setEmojiPickerVisible(true);
  }

  const dismissEmojiPickerDialog = () => {
    setEmojiPickerVisible(false);
  }

  const canvas = <canvas id="main-canvas" className="canvas"></canvas>;

  /**
   * Downloads the content of the canvas as a png image
   */
  const Download = () => {
    let canvasHTML = document.getElementById("main-canvas");
    let url = canvasHTML.toDataURL("image/png");
    let link = document.createElement('a');
    link.download = 'orthomoji.png';
    link.href = url;
    link.click();
  }

  /**
   * Generate the emoji word to the canvas
   */
  const Generate = () => {
    setShowCanvasImage(true);
    setCanvasMessage("Generating...");
    setCanvasIcon(loadingIcon);

    try {
      const orthomoji = new Orthomoji("main-canvas"); 
      orthomoji
        .setText('Hello')
        .setEmoji('📮')
        .setEmojiSize(16)
        .generate();

      let canvasHTML = document.getElementById("main-canvas");
      let url = canvasHTML.toDataURL("image/png");
      setShowCanvasImage(false);
      setEmojiImage(url);
    } catch (e) {
      console.log(e);
      setCanvasMessage("An error has occured");
      setCanvasIcon(errorIcon);
    }
  }

  return (
    <main className='main'>
      {emojiPickerVisible &&
        <EmojiPickerDialog onDismiss={dismissEmojiPickerDialog} />
      }
      <div className='content-container'>
        <NavBar title={"Orthomoji 🖌️"} github={"https://google.com"} />
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
            <TextInput label={"Enter text here..."} />
          </div>
          <div className={styles["main-emoji-input-container"]} onClick={displayEmojiPickerDialog}>
            <TextInput label={"😃❤️🎉..."} />
          </div>
        </div>
        <br />
        {canvas}
      </div>
      <Footer author={"Matthew Carvalho-Dagenais"} date={"2023"} licenseHref={"https://google.com"} />
    </main>
  )
}
