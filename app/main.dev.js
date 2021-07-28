/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron';
const os = require('os');
const upath = require('upath');

const {shell} = require('electron');

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('open-file-dialog-for-file', function (event) {
  if(os.platform() === 'linux' || os.platform() === 'win32'){
     dialog.showOpenDialog({
         properties: ['openDirectory']
     }, function (files) {
        if (files) event.sender.send('selected-file', files[0]);
     });
 } else {
     dialog.showOpenDialog({
         properties: ['openDirectory']
     }, function (files) {
         if (files) event.sender.send('selected-file', files[0]);
     });
 }});

ipcMain.on('start-napari', (event) => {
  shell.openItem(upath.toUnix(`${process.resourcesPath}/python/Napari/Napari.exe`));
})

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  if (os.platform() === 'linux') {
    shell.openItem(upath.toUnix(`${process.resourcesPath}/python/YeastMateBackend`));
  }
  if (os.platform() === 'darwin') {
    shell.openItem(upath.toUnix(`${process.resourcesPath}/python/YeastMateIO/YeastMateIO`));
  }
  if (os.platform() === 'win32') {
    shell.openItem(upath.toUnix(`${process.resourcesPath}/python/YeastMateIO/YeastMateIO.exe`));
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1200,
    height: 900,
    minHeight: 500,
    minWidth: 800,
    icon: __dirname + '/app/app.icns',
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  Menu.setApplicationMenu(null)

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
