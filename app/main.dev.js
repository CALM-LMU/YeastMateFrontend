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
const spawn = require("child_process").spawn;
const { exec } = require("child_process");

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

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('open-file-dialog-for-file', function (event) {
     dialog.showOpenDialog({
         properties: ['openDirectory']
     }, function (files) {
        if (files) event.sender.send('selected-file', files[0]);
     });
 });

ipcMain.on('start-napari', (event, path, scoreThresholds) => {
  if (os.platform() === 'linux') {
		let an = spawn('gnome-terminal', [
		'-e',
		'/home/bunk/BioElectron/python/YeastMate/YeastMateAnnotation ' + path + ' ' + scoreThresholds
		]);
    an.on ('error', (err) => { console.log (err); });
  }
  if (os.platform() === 'darwin') {
    let bat = spawn(upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateAnnotation`), [
      path,
      scoreThresholds
  ]);
  }
  if (os.platform() === 'win32') {
    let bat = spawn("cmd.exe", [
      "/c", 
      upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateAnnotation.exe`), 
      path,
      scoreThresholds
  ]);
  }
})

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
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

  mainWindow.webContents.on('did-finish-load', () => {
  	if (os.platform() === 'linux') {
			let op = spawn('gnome-terminal', ['-e', upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateIO`)]);
			op.on ('error', (err) => { console.log (err); });
      let det = spawn('gnome-terminal', ['-e', upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateDetector`)]);
			det.on ('error', (err) => { console.log (err); });
		}
		if (os.platform() === 'darwin') {
		  shell.openItem(upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateIO`))
      shell.openItem(upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateDetector`))
		}
		if (os.platform() === 'win32') {
		  shell.openItem(upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateIO.exe`))
      shell.openItem(upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateDetector.exe`))
		}
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
