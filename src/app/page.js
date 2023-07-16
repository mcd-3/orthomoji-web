'use client';

import { useEffect, useRef } from "react";

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

import { Orthomoji } from '../../orthomoji/index';
import EmojiPicker from 'emoji-picker-react';

import paintIcon from './assets/brush.svg';
import generateIcon from './assets/pen.svg';
import downloadIcon from './assets/download.svg';

export default function Home() {
  const Test = () => {
    const orthomoji = new Orthomoji(); 
    orthomoji
      .setText('Sus')
      .setEmoji('📮')
      .generate();
  }

  /**
   * Saves the content of the canvas as a png image
   */
  const download = () => {
    let canvas = document.getElementById("main-canvas");
    let url = canvas.toDataURL("image/png");
    let link = document.createElement('a');
    link.download = 'orthomoji.png';
    link.href = url;
    link.click();
  }

  return (
    <main className='main'>
      <div className='content-container'>
        <NavBar title={"Orthomoji 🖌️"} github={"https://google.com"} />
        <TitleBar src={""} subtext={"Words made of emoji!"} />
        <br />
        <ScaleContainer>
          <CanvasMessage
            message={"No words generated"}
            iconSrc={paintIcon}
            iconAlt="Paintbrush"
          />
        </ScaleContainer>
        <br />
        <div className={styles["button-container"]}>
          <div className={styles["button-column-left"]}>
            <Button iconSrc={generateIcon} text={"Generate"} className={btnStyles.generate} />
          </div>
          <div className={styles["button-column-right"]}>
            <Button iconSrc={downloadIcon} text={"Download"} className={btnStyles.download} />
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
          <div className={styles["main-emoji-input-container"]}>
            <TextInput label={"😃❤️🎉..."} />
          </div>
        </div>
        {/* <EmojiPicker /> */}
        <br />
        <canvas id="main-canvas" height="170" width="260"></canvas>
      </div>
      <Footer author={"Matthew Carvalho-Dagenais"} date={"2023"} licenseHref={"https://google.com"} />
    </main>
  )
}
