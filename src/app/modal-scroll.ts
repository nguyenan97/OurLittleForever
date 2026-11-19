let previousScrollY = 0;

export function lockModalScroll(): void {
  previousScrollY = window.scrollY;
  document.body.classList.add("modal-open");
  document.body.style.position = "fixed";
  document.body.style.top = `-${previousScrollY}px`;
  document.body.style.width = "100%";
}

export function unlockModalScroll(): void {
  document.body.classList.remove("modal-open");
  document.body.style.removeProperty("position");
  document.body.style.removeProperty("top");
  document.body.style.removeProperty("width");
  window.scrollTo({ top: previousScrollY, behavior: "instant" });
}
