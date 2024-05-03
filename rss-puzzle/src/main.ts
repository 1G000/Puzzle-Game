import "./style.scss";
import createLoginForm from "./components/loginForm/loginForm";
import createStartScreen from "./components/startScreen/startsScreen";
import { getUser } from "./localStorage";
import { EVENT_NAME } from "./event";

let currentUser = getUser();

function createContainer(): void {
  const body = <HTMLBodyElement>document.querySelector(".body");
  const container = <HTMLDivElement>document.createElement("div");
  container.classList.add("container");
  body.appendChild(container);

  const resizeObservalbe = new ResizeObserver(() => {
    container.style.setProperty(
      "--image-width",
      `${container.getBoundingClientRect().width}px`,
    );
  });
  resizeObservalbe.observe(container);
}
createContainer();

document.body.addEventListener(EVENT_NAME, () => {
  currentUser = getUser();
  if (currentUser) {
    createStartScreen(currentUser);
  } else {
    createLoginForm();
  }
});

if (currentUser) {
  createStartScreen(currentUser);
} else {
  createLoginForm();
}
