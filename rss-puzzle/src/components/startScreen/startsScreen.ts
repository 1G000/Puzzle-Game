import "./startScreen.scss";
import { getUser, User } from "../../localStorage";
import {
  createPlayground,
  createSentenceRow,
  showAnswer,
  showAudioHint,
  playSentanceSound,
  playground,
  fillLevelsSelect,
  fillRoundsSelect,
} from "../playground/playground";
import { authUpdated } from "../../event";
import { showTranslateHint, toggleImageHint } from "../hints";
import volume from "../../../public/icons/volume.svg";
import createSelect from "../select/select";

export const currentUser = getUser();

function createBtn(
  textContent: string,
  className: string,
  handler?: (е: MouseEvent) => void,
): HTMLButtonElement {
  const btn = <HTMLButtonElement>document.createElement("button");
  btn.innerHTML = textContent;
  className.split(" ").forEach((c) => btn.classList.add(c));
  if (handler) {
    btn.addEventListener("click", handler);
  }

  return btn;
}

export function logout(): void {
  if (playground) {
    playground.innerHTML = "";
  }
  const sentenceRow = document.querySelector<HTMLDivElement>(".sentence-row");
  if (sentenceRow) {
    sentenceRow.innerHTML = "";
  }
  const container = <HTMLDivElement>document.querySelector(".container");
  container.innerHTML = "";
  if (currentUser) {
    localStorage.removeItem("user");
  }
  document.body.dispatchEvent(authUpdated);
}

function createContainer(className: string): HTMLDivElement {
  const btnContainer = <HTMLDivElement>document.createElement("div");
  btnContainer.classList.add(className);
  return btnContainer;
}

function startGame(): void {
  const container = <HTMLDivElement>document.querySelector(".container");
  container.innerHTML = "";
  const btnTopContainer = createContainer("top_btn-container");
  const selectLevelTitle = document.createElement("span");
  selectLevelTitle.innerHTML = "Level";
  btnTopContainer.append(selectLevelTitle);
  const selectLevel = createSelect("select-level");
  btnTopContainer.append(selectLevel);
  const selectLevelPage = document.createElement("span");
  selectLevelPage.innerHTML = "Page";
  btnTopContainer.append(selectLevelPage);
  const selectPage = createSelect("select-page");
  btnTopContainer.append(selectPage);
  const audioHint = document.createElement("img");
  audioHint.classList.add("audio-ico");
  audioHint.src = volume;
  audioHint.onclick = playSentanceSound;
  container.append(btnTopContainer);
  container.append(audioHint);
  const translateHint = createContainer("hint_tanslate-container");
  container.append(translateHint);
  const translateHintText = document.createElement("p");
  translateHintText.classList.add("hint_translate-text");
  container.append(translateHint);
  translateHint.append(translateHintText);
  const audioHintBtn = createBtn("audio hint", "hint_audio-btn", showAudioHint);
  const translateHintBtn = createBtn(
    "translate",
    "hint_translate-btn",
    showTranslateHint,
  );
  const imgHintBtn = createBtn("image hint", "hint_img-btn", toggleImageHint);
  btnTopContainer.append(imgHintBtn);
  btnTopContainer.append(audioHintBtn);
  btnTopContainer.append(translateHintBtn);
  const logoutBtn = createBtn("Logout", "logout-btn", logout);
  btnTopContainer.append(logoutBtn);
  container.append(playground);
  const pictureInfo = document.createElement("p");
  pictureInfo.classList.add("picture-info");
  container.append(pictureInfo);
  const sentenceRow = <HTMLDivElement>createSentenceRow();
  container.append(sentenceRow);
  const btnBottomContainer = createContainer("bottom_btn-container");
  container.append(btnBottomContainer);
  const showAnswerBtn = createBtn("Show answer", "show-btn", showAnswer);
  btnBottomContainer.append(showAnswerBtn);
  const checkSentenceBtn = createBtn("Check", "check-btn");
  btnBottomContainer.append(checkSentenceBtn);
  createPlayground();
  fillLevelsSelect();
  fillRoundsSelect();
}

export default function createStartScreen(user: User): void {
  const container = <HTMLDivElement>document.querySelector(".container");
  container.innerHTML = "";
  const startScreen = <HTMLDivElement>document.createElement("div");
  startScreen.classList.add("start-screen");
  container.append(startScreen);
  const mainTitle = <HTMLHeadingElement>document.createElement("h1");
  mainTitle.innerHTML = "RSS PUZZLE";
  mainTitle.classList.add("main-title");
  const greeting = <HTMLParagraphElement>document.createElement("p");
  greeting.classList.add("greeting");
  greeting.innerHTML = `Welcome, ${user.name} ${user.surname}!`;
  const description = <HTMLParagraphElement>document.createElement("p");
  description.classList.add("description");
  description.innerHTML = `RSS PUZZLE is a user-friendly and effective platform for learning English language`;
  const btnsField = <HTMLDivElement>document.createElement("div");
  btnsField.classList.add("buttons-field");
  startScreen.append(mainTitle, greeting, description, btnsField);
  const startBtn = createBtn("Start", "start-btn", startGame);
  const logoutBtn = createBtn("Logout", "logout-btn", logout);
  btnsField.append(startBtn, logoutBtn);
}
