export default function createSelect(style: string): HTMLSelectElement {
  const selectList = document.createElement("select");
  selectList.classList.add(style);

  return selectList;
}
