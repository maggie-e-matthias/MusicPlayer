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

// Audio variables

let tracks = []; // Array of all the tracks scanned
let audio = new Audio(); // The currently playing audio
let currentIndex = -1; // Tracks array index
let isPlaying = false; // Play/Pause state

const tracksList = document.getElementById("track-list");
const trackNameE = document.getElementById("track-name");
const trackArtist = document.getElementById("track-artist");

// Scan tracks from device
async function loadTracks() {
  tracks = await ipcRenderer.invoke("get-tracks");

  tracks.forEach((track, index) => {
    const trackElement = document.createElement("button");
    trackElement.className = "a-track";
    trackElement.dataset.index = index;
    trackElement.textContent = track.title + " \n " + track.artist;
    tracksList.appendChild(trackElement);
  });
}

// Event listener for all tracks 
tracksList.addEventListener("click", (event) => {
  const button = event.target.closest(".a-track");
  if(!button) return;
  playTrack(Number(button.dataset.index));
});

// Play the music 

function playTrack(index){
  // If same track is clicked again, just toggle
  if (index === currentIndex){
    togglePlayPause();
    return;
  }

  // If a different track is playing (or nothing at all), just Play
  const track = tracks[index];
  audio.pause();
  audio.src = pathToFileURL(track.filePath).href; 
  audio.play().catch((error) => console.error("Failed to play", error));

  currentIndex = index;
  isPlaying = true; 
  updateNowPlaying(track);
}

function togglePlayPause() {
  if (currentIndex === -1) return; // No tracks available
  if (isPlaying){
    audio.pause();
  }else {
    audio.play();
  }

  isPlaying = !isPlaying;
}

function updateNowPlaying(track){
  trackNameE.textContent = track.title;
  trackArtist.textContent = track.artist;
}

// Update on track finishes
audio.addEventListener("ended", () => {
  isPlaying = false;
});

// Toggle play/pause button 
document.getElementById("play").addEventListener("click", togglePlayPause);
loadTracks();
