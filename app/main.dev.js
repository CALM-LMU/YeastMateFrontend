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

const spawn = require("child_process").spawn;
const exec = require('child_process').exec;

var runCommandTerminalMacOS = require('./callStuffMacOS').runCommandTerminalMacOS;

let mainWindow = null;

global.resourcesPath = process.resourcesPath;

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

ipcMain.on('start-napari', (event, folder) => {
  if (os.platform() === 'linux') {
		let an = spawn('gnome-terminal', [
		'-e',
		upath.toUnix(`${process.resourcesPath}/python/YeastMate/annotation`), 
    path
		]);
  }
  if (os.platform() === 'darwin') {
    let an = spawn(upath.toUnix(`${process.resourcesPath}/python/YeastMate/annotation`), [
      path
    ]);
  }
  if (os.platform() === 'win32') {
    let exepath = upath.toUnix(`${process.resourcesPath}/python/YeastMate/annotation.exe`);
    let an = exec(`start /wait "" "${exepath}" ${folder}`);
  }
})

ipcMain.on('start-io-backend', (event, port) => {
    // start windows backend
    if (os.platform() === 'win32') {
      let exepath = upath.toUnix(`${process.resourcesPath}/python/YeastMate/hueyserver.exe`);
      let iospawn = exec( `start /wait "" "${exepath}" --port ${port}` );
    }

    // start linux backends
    if (os.platform() === 'linux') { 
      
      let terminal = 'x-terminal-emulator';

      let exepath = upath.toUnix(`${process.resourcesPath}/python/YeastMate/hueyserver`);
      let iospawn = exec( `${terminal} -e "${exepath} --port ${port}"` );
    }

    // start osx backends
    if (os.platform() === 'darwin') {
      let exepath = upath.toUnix(`${process.resourcesPath}/python/YeastMate/hueyserver`)
      let iospawn = runCommandTerminalMacOS(`${exepath} --port ${port}`)
    }
})

ipcMain.on('start-detection-backend', (event, device, port, config, model) => {
  var deviceSwitch = ''
  if (device === 'gpu') {
    deviceSwitch = '--gpu'
  }

  if (os.platform() === 'win32') {
    let exepath = upath.toUnix(`${process.resourcesPath}/python/YeastMate/yeastmate_server.exe`);
    let decspawn = exec( `start /wait "" "${exepath}" ${deviceSwitch} --port ${port}` );
  }

  if (os.platform() === 'linux') {     

    let terminal = 'x-terminal-emulator';

    let exepath = upath.toUnix(`${process.resourcesPath}/python/YeastMate/yeastmate_server`);
    let decspawn = exec( `${terminal} -e "${exepath} ${deviceSwitch} --port ${port} --config ${config} --model ${model}"` )
  }

  if (os.platform() === 'darwin') {
    let exepath = upath.toUnix(`${process.resourcesPath}/python/YeastMate/yeastmate_server`);
    let decspawn = runCommandTerminalMacOS(`${exepath} ${deviceSwitch} --port ${port} --config ${config} --model ${model}`)
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

  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
