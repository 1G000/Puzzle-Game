export function showTranslateHint() {
  const btn = document.querySelector(".hint_translate-btn");
  const hintTranslateContainer = document.querySelector(
    ".hint_tanslate-container",
  );
  if (btn && hintTranslateContainer) {
    hintTranslateContainer.classList.toggle("invisible");
    btn.classList.toggle("btn-active");
  }
}

export function checkHint(btnClass: string, itemClass: string) {
  const btn = document.querySelector(btnClass);
  const hintTranslateContainer = document.querySelector(itemClass);
  if (btn && hintTranslateContainer) {
    if (
      !btn?.classList.contains("btn-active") ||
      hintTranslateContainer.classList.contains("invisible")
    ) {
      hintTranslateContainer.classList.remove("invisible");
    }
    if (
      btn?.classList.contains("btn-active") ||
      hintTranslateContainer.classList.contains("invisible")
    ) {
      hintTranslateContainer.classList.add("invisible");
    }
  }
}

export function toggleImageHint() {
  const board = document.querySelector(".board");
  const btn = document.querySelector(".hint_img-btn");
  const row = document.querySelector(".row");
  btn?.classList.toggle("btn-active");
  if (row && board) {
    const words = [
      ...row.querySelectorAll(".word"),
      ...board.querySelectorAll(".word"),
    ];
    words.forEach((word) => word.classList.toggle("without-picture"));
  }
}

export function showImageAfterWin() {
  const words: NodeListOf<Element> = document.querySelectorAll(".word");
  for (let i = 0; i < words.length; i += 1) {
    words[i].innerHTML = "";
    words[i].classList.add("without-border");
    words[i].classList.remove("without-picture");
  }
}
