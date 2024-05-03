export interface User {
  name: string;
  surname: string;
}

export default function addToLocalStorage(name: string, surname: string): void {
  const user = { name, surname };
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser(): User | null {
  const value: string | null = localStorage.getItem("user");
  if (typeof value === "string") {
    const savedUser: User = JSON.parse(value);
    return savedUser;
  }
  return null;
}
