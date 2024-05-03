import "./loginForm.scss";
import addToLocalStorage from "../../localStorage";
import { authUpdated } from "../../event";

let user: string[] = [];

function isValid(
  errorField: HTMLSpanElement,
  input: HTMLInputElement,
  style: string,
): string {
  // eslint-disable-next-line no-param-reassign
  errorField.style.display = "none";
  input.classList.remove(style);
  return input.value;
}

function isInvalid(
  errorField: HTMLSpanElement,
  input: HTMLInputElement,
  style: string,
) {
  // eslint-disable-next-line no-param-reassign
  errorField.style.display = "block";
  input.classList.add(style);
}

function validateInput(
  inputName: string,
  lengthErrorField: string,
  symbolsErrorField: string,
  inputMinLength: number,
): void {
  const input = <HTMLInputElement>document.querySelector(`#${inputName}`);
  const errorLength = <HTMLSpanElement>(
    document.querySelector(`.${lengthErrorField}`)
  );
  const errorSymbols = <HTMLSpanElement>(
    document.querySelector(`.${symbolsErrorField}`)
  );
  const pattern = /^[A-Z][a-zA-Z-]*$/;

  if (input.value.length < inputMinLength) {
    isInvalid(errorLength, input, "length-input_invalid");
    isValid(errorSymbols, input, "symbols-input_invalid");
  } else if (
    input.value.length >= inputMinLength &&
    !pattern.test(input.value)
  ) {
    isValid(errorLength, input, "length-input_invalid");
    isInvalid(errorSymbols, input, "symbols-input_invalid");
  } else {
    isValid(errorLength, input, "length-input_invalid");
    isValid(errorSymbols, input, "symbols-input_invalid");
    user.push(isValid(errorLength, input, "length-input_invalid"));
  }
}

export function createInputField(
  name: string,
  placeholder: string,
  labelText: string,
  minLength: number,
): HTMLDivElement {
  const inputField = <HTMLDivElement>document.createElement("div");
  inputField.classList.add("input-field");
  const label = <HTMLLabelElement>document.createElement("label");
  label.innerHTML = `${labelText}`;
  label.setAttribute("for", `${name}`);
  inputField.append(label);
  const nameErrorLength = <HTMLSpanElement>document.createElement("span");
  nameErrorLength.classList.add(`${name}_error-length`);
  nameErrorLength.innerHTML = `This field must contain at least ${minLength} characters`;
  const nameErrorSymbols = <HTMLSpanElement>document.createElement("span");
  nameErrorSymbols.classList.add(`${name}_error-symbols`);
  nameErrorSymbols.innerHTML = `The ${name.split("-")[0]} must begin with a capital letter and contain only Latin letters or "-"`;
  const input = <HTMLInputElement>document.createElement("input");
  input.id = `${name}`;
  input.name = `${name}`;
  input.placeholder = `${placeholder}`;
  input.type = "text";
  inputField.append(input);
  inputField.append(nameErrorLength);
  inputField.append(nameErrorSymbols);
  return inputField;
}

function submitHandler(event: Event): void {
  event.preventDefault();
  user = [];
  validateInput(
    "name-input",
    "name-input_error-length",
    "name-input_error-symbols",
    3,
  );
  validateInput(
    "surname-input",
    "surname-input_error-length",
    "surname-input_error-symbols",
    4,
  );
  if (user[0] && user[1]) {
    addToLocalStorage(user[0], user[1]);
    document.body.dispatchEvent(authUpdated);
  }
}

export default function createLoginForm(): void {
  const container = <HTMLDivElement>document.querySelector(".container");
  container.innerHTML = "";
  const loginForm = <HTMLFormElement>document.createElement("form");
  loginForm.method = "get";
  loginForm.classList.add("login-form");
  const formTitle = <HTMLHeadingElement>document.createElement("h2");
  formTitle.innerHTML = "Welcome to RSS-Puzzle";
  loginForm.append(formTitle);
  const inputFirstName = createInputField(
    "name-input",
    "Your First Name",
    "Enter your First Name",
    3,
  );
  const inputSurName = createInputField(
    "surname-input",
    "Your Surname",
    "Enter your Surname",
    4,
  );
  const loginBtn = <HTMLButtonElement>document.createElement("button");
  loginBtn.textContent = "Login!";
  loginBtn.value = "Login!";
  loginBtn.type = "submit";
  loginBtn.classList.add("login-btn");
  loginForm.addEventListener("submit", submitHandler);
  container.append(loginForm);
  loginForm.append(inputFirstName);
  loginForm.append(inputSurName);
  loginForm.append(loginBtn);
}
