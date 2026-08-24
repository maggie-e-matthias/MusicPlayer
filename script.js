// Title Bar Buttons

const {ipcRenderer} = require("electron"); 
const minimizeBtn = document.getElementById("minimize-btn");
const closeBtn = document.getElementById("close-btn");

minimizeBtn.addEventListener("click", () =>
    ipcRenderer.send("window:minimize"),
);

closeBtn.addEventListener("click", () =>
    ipcRenderer.send("window:close"),
);