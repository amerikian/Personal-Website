/*
  Optional client-side access gate for static hosting.
  How to enable:
  1) Set REQUIRED_PASSCODE to a non-empty secret value.
  2) Host on private repo/pages and treat this as an extra convenience gate only.
*/

(() => {
  const REQUIRED_PASSCODE = "";
  const STORAGE_KEY = "acp-command-center-passcode";

  if (!REQUIRED_PASSCODE) {
    return;
  }

  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached === REQUIRED_PASSCODE) {
    return;
  }

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(12, 16, 26, 0.86)";
  overlay.style.zIndex = "9999";
  overlay.style.display = "grid";
  overlay.style.placeItems = "center";
  overlay.style.backdropFilter = "blur(3px)";

  const box = document.createElement("div");
  box.style.width = "min(420px, 90vw)";
  box.style.padding = "16px";
  box.style.borderRadius = "14px";
  box.style.background = "#fff";
  box.style.border = "1px solid #d5d9e4";
  box.style.boxShadow = "0 16px 30px rgba(0,0,0,.22)";
  box.innerHTML = `
    <h2 style="margin:0 0 8px; font:700 1.1rem system-ui, sans-serif; color:#17223b;">Command Center Access</h2>
    <p style="margin:0 0 10px; color:#42506b; font:500 .9rem system-ui, sans-serif;">Enter passcode to continue.</p>
    <input id="cc-passcode" type="password" style="width:100%;padding:9px 10px;border:1px solid #c8d2ea;border-radius:10px;" />
    <button id="cc-unlock" style="margin-top:10px;width:100%;padding:9px 10px;border-radius:10px;border:1px solid #9fb0dc;background:#edf2ff;color:#17223b;font-weight:700;cursor:pointer;">Unlock</button>
    <p id="cc-err" style="margin:8px 0 0;color:#b91c1c;font:600 .82rem system-ui,sans-serif;"></p>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const input = box.querySelector("#cc-passcode");
  const button = box.querySelector("#cc-unlock");
  const error = box.querySelector("#cc-err");

  const unlock = () => {
    if (input.value === REQUIRED_PASSCODE) {
      localStorage.setItem(STORAGE_KEY, REQUIRED_PASSCODE);
      overlay.remove();
      return;
    }
    error.textContent = "Invalid passcode.";
  };

  button.addEventListener("click", unlock);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      unlock();
    }
  });
})();
