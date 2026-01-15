const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    authenticate: (reason) => ipcRenderer.invoke('auth:prompt-touch-id', reason),
});
