const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  changeOpacity: (direction) => ipcRenderer.send('scroll-opacity', direction)
});
