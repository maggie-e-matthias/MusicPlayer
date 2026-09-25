// Title Bar Buttons

const {ipcRenderer} = require("electron"); 
const minimizeBtn = document.getElementById("minimize");
const closeBtn = document.getElementById("close");

minimizeBtn.addEventListener("click", () =>
    ipcRenderer.send("window:minimize"),
);

closeBtn.addEventListener("click", () =>
    ipcRenderer.send("window:close"),
);

// Tab buttons

const nowPlayingTab = document.getElementById("now-playing-tab");
const menuTab = document.getElementById("menu-tab");

const nowPlayingBtn = document.getElementById("now-playing");
const menuBtn = document.getElementById("menu");


// Tab Changing

nowPlayingBtn.addEventListener("click",
    function(){
        menuTab.style.display = "none";
        nowPlayingTab.style.display = "flex";
});

menuBtn.addEventListener("click",
    function(){
        nowPlayingTab.style.display = "none";
        menuTab.style.display = "flex";
});


 
// Track elements

async function loadTracks(){
    const tracks = await ipcRenderer.invoke('get-tracks');
    const tracksList = document.getElementById('track-list');

    for (const track of tracks) {
        const trackElement = document.createElement('div');
        trackElement.className = 'a-track';
        trackElement.textContent = track.title + " - " + track.artist;
        tracksList.appendChild(trackElement);
    }
}

loadTracks();