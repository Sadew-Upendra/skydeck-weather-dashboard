export function hideSplash() {
  const el = document.getElementById("splash");
  if (!el || el.dataset.hiding) return;
  el.dataset.hiding = "true";
  el.classList.add("splash-hide");
  setTimeout(() => el.remove(), 500);
}
