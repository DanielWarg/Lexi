/**
 * Shell Adapter
 * Abstracting the differences between Electron and Tauri window controls.
 */

let ipcRenderer = null;

// Electron Detection
try {
    if (window.require) {
        const electron = window.require('electron');
        ipcRenderer = electron.ipcRenderer;
    }
} catch (e) {
    console.log("Lexi: Not running in Electron mode.");
}

// Tauri Detection
const isTauri = !!window.__TAURI__;

export const shell = {
    minimize: async () => {
        if (ipcRenderer) {
            ipcRenderer.send('window-minimize');
        } else if (isTauri) {
            try {
                const { getCurrentWindow } = await import('@tauri-apps/api/window');
                await getCurrentWindow().minimize();
            } catch (e) {
                console.error("Tauri minimize error:", e);
            }
        } else {
            console.warn("Shell: minimize not supported in this environment");
        }
    },

    maximize: async () => {
        if (ipcRenderer) {
            ipcRenderer.send('window-maximize');
        } else if (isTauri) {
            try {
                const { getCurrentWindow } = await import('@tauri-apps/api/window');
                await getCurrentWindow().toggleMaximize();
            } catch (e) {
                console.error("Tauri maximize error:", e);
            }
        } else {
            console.warn("Shell: maximize not supported in this environment");
        }
    },

    close: async () => {
        if (ipcRenderer) {
            ipcRenderer.send('window-close');
        } else if (isTauri) {
            try {
                const { getCurrentWindow } = await import('@tauri-apps/api/window');
                await getCurrentWindow().close();
            } catch (e) {
                console.error("Tauri close error:", e);
            }
        } else {
            console.warn("Shell: close not supported in this environment");
        }
    }
};

export const getEnvironment = () => {
    if (ipcRenderer) return 'electron';
    if (isTauri) return 'tauri';
    return 'browser';
};
