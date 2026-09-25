// App window creation

require('electron-reload')(__dirname)
const {app, BrowserWindow, ipcMain} = require('electron');

function createWindow(){
    const win = new BrowserWindow({
        width: 320, 
        height: 420, 
        resizable: false,
        maximizable: false, 
        fullscreen: false, 
        center: true, 
        frame: false,
        transparent: true,
        alwaysOnTop: true, 
        webPreferences: {
            nodeIntegration: true, 
            contextIsolation: false
        }
    });

    win.loadFile('index.html');

    /*Window contron ipc handlers - Title Bar Buttons */
    ipcMain.on('window:minimize', () => win.minimize());
    ipcMain.on('window:close', () => win.close());
    

    // Track data ipc handler

    ipcMain.handle('get-tracks', async () => {
        const tracks = await scanMusicFolder();
        return tracks;
    });

}

app.whenReady().then(createWindow);


// Music Meta Data Reading

const os = require('os');
const path = require('path');
const fs = require('fs');
const mm = require('music-metadata');

async function scanMusicFolder(){
    // 1. Find user's home directory and the Music subfolder path
    const musicFolderPath = path.join(os.homedir(), 'Music');

    // 2. Get the files in that folder
    const files = fs.readdirSync(musicFolderPath);

    // 3. Keep only audio files (using a filter with extension)
    const audioFiles = files.filter(file => file.endsWith('.mp3'));

    //  4. Extract metadata of each audio file
    const tracks = [];

    for (const fileName of audioFiles){
        const fullPath = path.join(musicFolderPath, fileName);
        const metadata = await mm.parseFile(fullPath);

        tracks.push({
            title: metadata.common.title || fileName,
            artist: metadata.common.artist || "Unknown Artist",
            album: metadata.common.album || "Unknown Album", 
            filePath: fullPath
        });

    }

    return tracks;
}

module.exports = {scanMusicFolder};