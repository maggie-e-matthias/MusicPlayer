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
    
}

app.whenReady().then(createWindow);