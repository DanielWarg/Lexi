const { app, BrowserWindow, ipcMain, systemPreferences } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        titleBarStyle: 'hiddenInset', // Mac style
        backgroundColor: '#000000',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // In Dev, load Vite server
    const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:5173';
    mainWindow.loadURL(startUrl);

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// --- IPC Handlers ---

// Native Auth (TouchID / FaceID)
ipcMain.handle('auth:prompt-touch-id', async (event, reason) => {
    if (process.platform !== 'darwin') {
        return { success: true, message: 'Not on macOS, bypassing auth (Dev Mode)' };
    }

    try {
        // Check if biometric is available
        const canPrompt = await systemPreferences.canPromptTouchID();
        if (!canPrompt) {
            // Fallback or error? For A0, we might just allow or fail.
            return { success: false, error: 'TouchID not available' };
        }

        await systemPreferences.promptTouchID(reason || 'Unlock Lexi Prime');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});
