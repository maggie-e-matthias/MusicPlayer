// Title Bar Buttons

const { ipcRenderer } = require("electron");
const minimizeBtn = document.getElementById("minimize");
const closeBtn = document.getElementById("close");

minimizeBtn.addEventListener("click", () =>
  ipcRenderer.send("window:minimize"),
);

closeBtn.addEventListener("click", () => ipcRenderer.send("window:close"));

// Tab buttons

const nowPlayingTab = document.getElementById("now-playing-tab");
const menuTab = document.getElementById("menu-tab");

const nowPlayingBtn = document.getElementById("now-playing");
const menuBtn = document.getElementById("menu");

// Tab Changing

nowPlayingBtn.addEventListener("click", function () {
  menuTab.style.display = "none";
  nowPlayingTab.style.display = "flex";
});

menuBtn.addEventListener("click", function () {
  nowPlayingTab.style.display = "none";
  menuTab.style.display = "flex";
});

// Track elements

const { pathToFileURL } = require("url");

async function loadTracks() {
  const tracks = await ipcRenderer.invoke("get-tracks");
  const tracksList = document.getElementById("track-list");

  for (const track of tracks) {
    const trackElement = document.createElement("button");
    trackElement.className = "a-track";
    trackElement.textContent = track.title + " \n " + track.artist;
    tracksList.appendChild(trackElement);

    //Play when clicked
    trackElement.addEventListener("click", () => {
      const audio = new Audio(pathToFileURL(track.filePath).href);

      audio
        .play()
        .then(() => {
          console.log("Now playing" + track.title);
        })
        .catch((error) => {
          console.error("Playing failed", error);
        });
    });
  }
}

loadTracks();
