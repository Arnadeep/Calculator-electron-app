const { app, BrowserWindow, shell, Tray, Menu, globalShortcut, ipcMain } = require('electron');
const path = require('path');

app.setLoginItemSettings({
  openAtLogin: true,
  path: process.execPath
});

app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });

  contents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
});

let win;
let tray = null;
let forceQuit = false;

function createWindow() {
  win = new BrowserWindow({
    height: 500,
    minHeight: 250,
    maxHeight: 800,
    resizable: true,
    fullscreenable: false,
    maximizable: false,
    frame: true,
    show: false,
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      alwaysOnTop: true,
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      enableRemoteModule: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      devTools: false,
      sandbox: true,
      spellcheck: false,
      backgroundThrottling: false,
    }
  });

  // win.on('minimize', (event) => {
  //   event.preventDefault();
  //   win.restore();
  //   setTimeout(() => {
  //     const [width, height] = win.getSize();
  //     win.setSize(width + 1, height + 1);
  //     win.setSize(width, height);
  //   }, 20);
  // });

  win.setAlwaysOnTop(true, 'screen-saver');
  win.setAspectRatio(0.642);
  win.setMenuBarVisibility(false);

  win.once('ready-to-show', () => {
    win.setOpacity(0);
    win.show();
    let opacity = 0;
    const fadeIn = setInterval(() => {
      opacity += 0.01;
      win.setOpacity(opacity);
      if (opacity >= 1) clearInterval(fadeIn);
    }, 10);
  });

  win.setBackgroundColor('#00000000');

  win.webContents.on('will-navigate', (event, url) => {
    if (url !== win.webContents.getURL()) {
      event.preventDefault();
    }
  });

  win.webContents.on('before-input-event', (event, input) => {
    const { control, shift, alt, meta, key } = input;
    if (
      key === 'F12' ||
      (control && shift && key.toLowerCase() === 'i') ||
      (control && shift && key.toLowerCase() === 'j') ||
      (control && shift && key.toLowerCase() === 'c') ||
      (control && key.toLowerCase() === 'u') ||
      (alt && key === 'F10') ||
      (meta && alt && key.toLowerCase() === 'i')
    ) {
      event.preventDefault();
    }
  });

  win.webContents.on('context-menu', (event) => {
    event.preventDefault();
  });

  win.webContents.on('certificate-error', (event, url, error, certificate, callback) => {
    event.preventDefault();
    callback(false);
  });

  win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(false);
  });

  win.loadFile(path.join(__dirname, 'index.html'));

  win.on('close', (event) => {
    if (win.webContents && !win.webContents.isDestroyed()) {
      win.webContents.session.clearStorageData();
    }
  });

  tray = new Tray(path.join(__dirname, 'assets/icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: () => { win.show(); win.focus(); } },
    { label: 'Quit', click: () => { forceQuit = true; app.quit(); } },
  ]);
  tray.setToolTip('Calculator');
  tray.setContextMenu(contextMenu);

  win.on('close', (event) => {
    if (!forceQuit) {
      event.preventDefault();
      win.hide();
    }
  });

  return win;
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      if (windows[0].isMinimized()) windows[0].restore();
      windows[0].focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();
  });
}

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.setAsDefaultProtocolClient('yourapp');

app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
      win.focus();
    }
  });
});

app.on('window-all-closed', (e) => {
});

let currentOpacity = 1;

ipcMain.on('scroll-opacity', (event, direction) => {
  const step = 0.2;
  if (direction === 'down') {
    currentOpacity = Math.max(0.1, currentOpacity - step);
  } else {
    currentOpacity = Math.min(1, currentOpacity + step);
  }
  if (win) win.setOpacity(currentOpacity);
});
