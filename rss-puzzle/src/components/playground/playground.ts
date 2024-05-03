/* eslint-disable @typescript-eslint/no-use-before-define */
import "./playground.scss";
import wordCollectionLevel1 from "../../../public/Words/wordCollectionLevel1.json";
import wordCollectionLevel2 from "../../../public/Words/wordCollectionLevel2.json";
import wordCollectionLevel3 from "../../../public/Words/wordCollectionLevel3.json";
import wordCollectionLevel4 from "../../../public/Words/wordCollectionLevel4.json";
import wordCollectionLevel5 from "../../../public/Words/wordCollectionLevel5.json";
import wordCollectionLevel6 from "../../../public/Words/wordCollectionLevel6.json";
import volumeActive from "../../../public/icons/volume-active.svg";
import volume from "../../../public/icons/volume.svg";
import { checkHint, showImageAfterWin } from "../hints";

export const playground = <HTMLDivElement>document.createElement("div");
playground.classList.add("playground");
const sentenceRow = <HTMLDivElement>document.createElement("div");

let bottomSentence: WordElement[] = [];
let topSentence: WordElement[] = [];
const percent = 100;
const wordCollections = [
  wordCollectionLevel1,
  wordCollectionLevel2,
  wordCollectionLevel3,
  wordCollectionLevel4,
  wordCollectionLevel5,
  wordCollectionLevel6,
];
let currentLevel = 0;
let wordCollection: typeof wordCollectionLevel1;
let currentRound = 0;
let currentSentence = 0;

interface WordElement {
  id: number;
  element: string;
  width: number;
  hidden?: boolean;
  offset: number;
}

function getSentence() {
  const pictureInfo = document.querySelector(".picture-info");
  if (pictureInfo) {
    pictureInfo.innerHTML = "";
  }
  wordCollection = wordCollections[currentLevel];
  const round = wordCollection.rounds[currentRound];
  const words = round.words[currentSentence].textExample.split(" ");
  const totalLetters = words.reduce(
    (acc: number, el: string) => acc + el.length,
    0,
  );
  let offset = 0;
  const sentence: WordElement[] = [];
  for (let i = 0; i < words.length; i += 1) {
    const word = words[i];
    const last = i === words.length - 1;
    const len = last ? 100 - offset : (word.length * percent) / totalLetters;
    sentence.push({
      id: i,
      element: word,
      width: (word.length * percent) / totalLetters,
      offset,
    });

    offset += len;
  }
  const translateHintText = <HTMLParagraphElement>(
    document.querySelector(".hint_translate-text")
  );
  const translate: string =
    wordCollection.rounds[currentRound].words[currentSentence]
      .textExampleTranslate;
  translateHintText.innerHTML = `💡 ${translate}`;
  bottomSentence = sentence.sort(() => Math.random() - 0.5);
  topSentence = [];

  const container = <HTMLDivElement>document.querySelector(".container");

  container.style.setProperty(
    "--image",
    `url("https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/${round.levelData.cutSrc}")`,
  );
  container.style.setProperty("--y-offset", `${-currentSentence * 0.1}`);
}

function moveWordOnClick(e: MouseEvent) {
  if (e.currentTarget instanceof HTMLElement) {
    const id = Number(e.currentTarget.dataset.id);
    topSentence = topSentence.filter((el) => el.id !== id);
    const bottomElement = bottomSentence.find((el) => el.id === id);
    if (bottomElement) {
      bottomElement.hidden = false;
    }
    renderBoard();
  }
}

function dragStartTopSection(e: DragEvent) {
  if (e.currentTarget instanceof HTMLElement) {
    e.currentTarget.classList.add("drag");
    const id = Number(e.currentTarget.dataset.id);
    topSentence = topSentence.filter((el) => el.id !== id);
  }
}

function dragEndTopSection(e: DragEvent) {
  const item = e.currentTarget;
  if (item instanceof HTMLElement) {
    const board = item.parentElement;
    if (board) {
      let index = 0;
      for (let i = 0; i < board.children.length; i += 1) {
        if (board.children.item(i) === item) {
          index = i;
          break;
        }
      }
      const newElement = bottomSentence.find(
        (el) => Number(item.dataset.id) === el.id,
      );
      if (newElement) {
        topSentence.splice(index, 0, newElement);
      }
    }
    item.classList.remove("drag");
  }

  renderBoard();
}

function dragOverTopSection(e: DragEvent) {
  const board = document.querySelector(".board");
  if (board) {
    const item = board.querySelector(".drag");
    if (item) {
      const items: HTMLDivElement[] = [
        ...board.querySelectorAll<HTMLDivElement>(".word:not(.drag)"),
      ];
      const nextItem = items.find((el) => {
        return e.clientX <= el.offsetLeft + el.offsetWidth / 2;
      });
      if (nextItem) {
        board.insertBefore(item, nextItem);
      }
    }
  }
}

function renderTopSection(): void {
  let board = document.querySelector<HTMLDivElement>(".board");
  const btn = document.querySelector(".hint_img-btn");
  if (!board) {
    board = document.createElement("div");
    board.classList.add("board");
    playground.append(board);
    board.addEventListener("dragover", dragOverTopSection);
    board.addEventListener("dragover", dragOverBottomSection);
  }
  board.innerHTML = "";
  topSentence.forEach((el) => {
    const word = document.createElement("div");
    word.classList.add("word");
    word.style.setProperty("--x-offset", `${-el.offset / 100}`);
    word.innerHTML = el.element;
    word.dataset.id = `${el.id}`;
    word.addEventListener("click", moveWordOnClick);
    word.draggable = true;
    board?.append(word);
    word.style.width = `${el.width}%`;
    word.addEventListener("dragstart", dragStartTopSection);
    word.addEventListener("dragend", dragEndTopSection);
    if (btn?.classList.contains("btn-active")) {
      word.classList.add("without-picture");
    }
  });
}

function moveWordOnClickBottom(e: MouseEvent) {
  if (e.currentTarget instanceof HTMLElement) {
    const id = Number(e.currentTarget.dataset.id);
    const bottomElement = bottomSentence.find((el) => el.id === id);
    if (bottomElement) {
      bottomElement.hidden = true;
      topSentence.push(bottomElement);
    }
    renderBoard();
  }
}

function dragStartBottomSection(e: DragEvent) {
  if (e.currentTarget instanceof HTMLElement) {
    e.currentTarget.classList.add("drag");
  }
  if (sentenceRow) {
    const item = sentenceRow.querySelector(".drag");
    if (item instanceof HTMLElement) {
      bottomSentence.find((el) => Number(item.dataset.id) === el.id);
    }
  }
}

function dragEndBottomSection() {
  const board = document.querySelector<HTMLDivElement>(".board");
  const item = board?.querySelector<HTMLDivElement>(".drag");
  if (item && board) {
    let index = 0;
    for (let i = 0; i < board.children.length; i += 1) {
      if (board.children.item(i) === item) {
        index = i;
        break;
      }
    }
    const newElement = bottomSentence.find(
      (el) => Number(item.dataset.id) === el.id,
    );
    if (newElement) {
      newElement.hidden = true;
      topSentence.splice(index, 0, newElement);
    }

    item.classList.remove("drag");
  }

  renderBoard();
}

function dragOverBottomSection(e: DragEvent) {
  const board = document.querySelector(".board");
  if (board) {
    const item =
      board.querySelector(".drag") ||
      sentenceRow.querySelector(".drag")?.cloneNode(true);
    const items = [
      ...board.querySelectorAll<HTMLDivElement>(".word:not(.drag)"),
    ];
    const nextItem = items.find((el) => {
      return e.clientX <= el.offsetLeft + el.offsetWidth / 2;
    });
    if (item) {
      if (nextItem) {
        board.insertBefore(item, nextItem);
      } else if (!items.length) {
        board.append(item);
      } else if (items[items.length - 1].offsetLeft < e.clientX) {
        board.append(item);
      }
    }
  }
  e.preventDefault();
}

function renderBottomSection(): void {
  const btn = document.querySelector(".hint_img-btn");
  let row = document.querySelector<HTMLDivElement>(".row");
  if (!row) {
    row = document.createElement("div");
    row.classList.add("row");
    sentenceRow.append(row);
  }
  row.innerHTML = "";

  bottomSentence.forEach((el) => {
    const word = document.createElement("div");
    word.classList.add("word");
    word.style.setProperty("--x-offset", `${-el.offset / 100}`);
    word.innerHTML = el.element;
    word.dataset.id = `${el.id}`;
    word.style.width = `${el.width}%`;
    word.draggable = true;
    if (el.hidden) {
      word.classList.add("hidden");
    }

    word.addEventListener("click", moveWordOnClickBottom);
    if (row) {
      row.append(word);
    }
    word.addEventListener("dragstart", dragStartBottomSection);
    word.addEventListener("dragend", dragEndBottomSection);

    if (btn?.classList.contains("btn-active")) {
      word.classList.add("without-picture");
    }
  });
}

function renderBoard(): void {
  renderTopSection();
  renderBottomSection();
  renderCheckButton();
}

export function createPlayground(): void {
  getSentence();
  renderBoard();
  const checkBtn = <HTMLButtonElement>document.querySelector(".check-btn");
  checkBtn.addEventListener("click", transformCheckBtnToContinue);
}

export function createSentenceRow(): HTMLDivElement {
  sentenceRow.classList.add("sentence-row");
  return sentenceRow;
}

function showDefaultHint(): void {
  const translateHintContainer = document.querySelector(
    ".hint_tanslate-container",
  );
  const audioHintIco = document.querySelector(".audio-ico");
  const audioHintBtn = <HTMLButtonElement>(
    document.querySelector(".hint_audio-btn")
  );
  const textHintBtn = <HTMLButtonElement>(
    document.querySelector(".hint_translate-btn")
  );
  const imgHintBtn = <HTMLButtonElement>document.querySelector(".hint_img-btn");

  if (translateHintContainer && audioHintIco) {
    audioHintBtn.disabled = true;
    textHintBtn.disabled = true;
    imgHintBtn.disabled = true;
    translateHintContainer.classList.remove("invisible");
    audioHintIco.classList.remove("invisible");
  }
}

function checkButton(): void {
  const checkBtn = <HTMLButtonElement>document.querySelector(".check-btn");
  const board = <HTMLDivElement>document.querySelector(".board");

  if (
    topSentence.map((el) => el.element).join(" ") ===
    wordCollection.rounds[currentRound].words[currentSentence].textExample
  ) {
    const words = playground.querySelectorAll(".word");
    words.forEach((word) => word.classList.remove("without-picture"));
    checkBtn.innerHTML = "Continue";
    checkBtn.classList.add("continue");
    showDefaultHint();
    board.classList.add("disabled");
    const boardLines: NodeListOf<Element> =
      playground.querySelectorAll(".disabled");
    if (boardLines.length === 10) {
      showImageAfterWin();
      const pictureInfo = document.querySelector(".picture-info");
      if (pictureInfo) {
        pictureInfo.innerHTML = `${wordCollection.rounds[currentRound].levelData.author} - ${wordCollection.rounds[currentRound].levelData.name} (${wordCollection.rounds[currentRound].levelData.year})`;
      }
    }
  } else {
    topSentence.forEach((word, index) => {
      if (word.id !== index) {
        board.children.item(index)?.classList.add("invalid");
      } else {
        board.children.item(index)?.classList.add("valid");
      }
    });
    setTimeout(() => {
      board.querySelectorAll<HTMLDivElement>(".word").forEach((word) => {
        word.classList.remove("invalid");
        word.classList.remove("valid");
      });
    }, 2000);
  }
}

function hideDefaultHint(): void {
  const audioHintBtn = <HTMLButtonElement>(
    document.querySelector(".hint_audio-btn")
  );
  const textHintBtn = <HTMLButtonElement>(
    document.querySelector(".hint_translate-btn")
  );
  const imgHintBtn = <HTMLButtonElement>document.querySelector(".hint_img-btn");
  audioHintBtn.disabled = false;
  textHintBtn.disabled = false;
  imgHintBtn.disabled = false;
  checkHint(".hint_translate-btn", ".hint_tanslate-container");
  checkHint(".hint_audio-btn", ".audio-ico");
}

function continueButton(): void {
  const checkBtn = <HTMLButtonElement>document.querySelector(".check-btn");
  const board = <HTMLDivElement>document.querySelector(".board");
  checkBtn.innerHTML = "Check";
  checkBtn.classList.remove("continue");
  board.classList.add("completed-board");
  board.style.setProperty("--y-offset", `${-currentSentence * 0.1}`);
  currentSentence += 1;
  if (currentSentence >= wordCollection.rounds[currentRound].words.length) {
    currentSentence = 0;
    currentRound += 1;
    if (currentRound >= wordCollection.rounds.length) {
      currentRound = 0;
      currentLevel += 1;
      currentLevel %= wordCollections.length;
    }
    playground.innerHTML = "";
  } else {
    board.classList.remove("board");
    board.classList.add("completed-board");
  }
  hideDefaultHint();
  getSentence();
  renderBoard();
  updateSelectors();
}

function updateSelectors() {
  const selectLvl = <HTMLSelectElement>document.querySelector(".select-level");
  selectLvl.value = currentLevel.toString();
  const selectRound = <HTMLSelectElement>document.querySelector(".select-page");
  selectRound.value = currentRound.toString();
}

function transformCheckBtnToContinue(): void {
  const checkBtn = <HTMLButtonElement>document.querySelector(".check-btn");
  if (checkBtn.classList.contains("continue")) {
    continueButton();
  } else {
    checkButton();
  }
}

function renderCheckButton(): void {
  const checkBtn = <HTMLButtonElement>document.querySelector(".check-btn");
  checkBtn.disabled = topSentence.length !== bottomSentence.length;
}

export function showAnswer(e: MouseEvent): void {
  if (e.currentTarget instanceof HTMLElement) {
    topSentence = [];
    for (let i = 0; i < bottomSentence.length; i += 1) {
      const el = bottomSentence[i];
      el.hidden = true;
      topSentence.push(el);
    }

    topSentence = topSentence.sort((a, b): any => a.id - b.id);
    checkButton();
    renderBoard();
    const boardLines: NodeListOf<Element> =
      playground.querySelectorAll(".disabled");
    const words = playground.querySelectorAll(".word");
    words.forEach((word) => word.classList.remove("without-picture"));
    if (boardLines.length === 10) {
      showImageAfterWin();
    }
  }
}

function audioEnded() {
  const audioIco = <HTMLImageElement>document.querySelector(".audio-ico");
  audioIco.src = volume;
  audioIco.style.pointerEvents = "auto";
}

const audio = new Audio();
audio.addEventListener("ended", audioEnded);

export function playSentanceSound() {
  audio.src = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/${wordCollection.rounds[currentRound].words[currentSentence].audioExample}`;
  const audioIco = <HTMLImageElement>document.querySelector(".audio-ico");
  audioIco.style.pointerEvents = "none";
  audioIco.src = volumeActive;
  audio.play();
}
export function showAudioHint() {
  const btn = document.querySelector(".hint_audio-btn");
  const audioIco = document.querySelector(".audio-ico");
  audioIco?.classList.toggle("invisible");
  btn?.classList.toggle("btn-active");
}

export function fillLevelsSelect() {
  const selectLevel = document.querySelector(".select-level");

  for (let i = 0; i < wordCollections.length; i += 1) {
    const option = document.createElement("option");
    option.classList.add("level-option");
    option.value = String(i);
    option.text = String(i + 1);

    if (selectLevel) {
      selectLevel.appendChild(option);
    }
  }
  if (selectLevel) {
    selectLevel.addEventListener("change", selectLevelChange);
  }
}

export function fillRoundsSelect() {
  const selectPage = document.querySelector(".select-page");
  if (selectPage) {
    selectPage.innerHTML = "";
  }
  for (let i = 0; i < wordCollection.rounds.length; i += 1) {
    const option = document.createElement("option");
    option.value = String(i);
    option.classList.add("round-option");
    option.text = String(i + 1);
    if (selectPage) {
      selectPage.appendChild(option);
    }
  }
  if (selectPage) {
    selectPage.addEventListener("change", selectPageChange);
  }
}

function selectLevelChange() {
  if (playground) {
    playground.innerHTML = "";
  }
  currentSentence = 0;
  currentRound = 0;
  document.querySelectorAll(".round-option").forEach((el) => el.remove());
  const selectLevel = <HTMLSelectElement>(
    document.querySelector(".select-level")
  );
  if (selectLevel) {
    currentLevel = Number(selectLevel.value);
  }
  getSentence();
  renderBoard();
  fillRoundsSelect();
}

function selectPageChange() {
  if (playground) {
    playground.innerHTML = "";
  }
  currentSentence = 0;
  const selectLevel = <HTMLSelectElement>document.querySelector(".select-page");
  if (selectLevel) {
    currentRound = Number(selectLevel.value);
  }
  getSentence();
  renderBoard();
}
