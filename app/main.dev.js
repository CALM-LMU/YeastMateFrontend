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
const exec = require('child_process').exec;

var portscanner = require('portscanner');

const fs = require('fs'); 
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 100 });

let mainWindow = null;

let ioBackendRunning = false;
let decBackendRunning = false;

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
		upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateAnnotation`), 
    path, 
    scoreThresholds
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

ipcMain.on('start-backends', (event, ip, port, req, gpu) => {
  if (ip === '127.0.0.1' || ip === 'localhost') {
    var newport = 0
    if (port === 'automatic') {
      portscanner.findAPortNotInUse(11002, 11201, '127.0.0.1', function(error, freePort) {
        newport = freePort
      })
    }
    else {
      newport = port
    }
    
    // start windows backends
    if (os.platform() === 'win32') {
      fs.stat(upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateBackend.exe`), function(err, stat) {
        if (err == null) {
          if (ioBackendRunning === false) {
            let exepath = upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateBackend.exe`);
            let iospawn = exec( `start /wait "" "${exepath}" ${newport.toString()}` );
  
            ioBackendRunning = true;

            axios.post(
              'http://' + ip + ':' + port, req
            ).then(function (response) {
              console.log('big success!');
            })
            .catch(function (error) {
              console.log('Error when sending cached request');
            })
  
            iospawn.on('exit', (code, signal) => {
              ioBackendRunning = false;
            })
          }
        }
        else{
          axios.post(
            'http://' + ip + ':' + port, req
          ).then(function (response) {
            console.log('big success!');
          })
          .catch(function (error) {
            console.log('Error when sending cached request');
          })
        }
      })
      
      if (decBackendRunning === false) {
        fs.stat(upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateDetectionServer.exe`), function(err, stat) {
          if (err == null) {
            let exepath = upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateDetectionServer.exe`);
            let decspawn = exec( `start /wait "" "${exepath}" ${req.detection.port.toString()} ${gpu}` );
  
            ioBackendRunning = true;
  
            decspawn.on('exit', (code, signal) => {
              decBackendRunning = false;
            })
          }
        })
      }  
    }

    // start linux backends
    if (os.platform() === 'linux') {
      fs.stat(upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateBackend`), function(err, stat) {
        if (err == null) {
          if (ioBackendRunning === false) {            
            let iospawn = spawn('gnome-terminal', [
              '-e',
              '"' + upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateBackend`) + '"',
              ip,
              port
              ]);
              an.on ('error', (err) => { console.log (err); });
  
            ioBackendRunning = true;

            axios.post(
              'http://' + ip + ':' + port, req
            ).then(function (response) {
              console.log('big success!');
            })
            .catch(function (error) {
              console.log('Error when sending cached request');
            })
  
            iospawn.on('exit', (code, signal) => {
              ioBackendRunning = false;
            })
          }
        }
        else{
          axios.post(
            'http://' + ip + ':' + port, req
          ).then(function (response) {
            console.log('big success!');
          })
          .catch(function (error) {
            console.log('Error when sending cached request');
          })
        }
      })
      
      if (decBackendRunning === false) {
        fs.stat(upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateDetectionServer`), function(err, stat) {
          if (err == null) {
            let decspawn = spawn('gnome-terminal', [
              '-e',
              '"' + upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateDetectionServer`) + '"',
              req.port,
              gpu
              ]);
              an.on ('error', (err) => { console.log (err); });
  
            ioBackendRunning = true;
  
            decspawn.on('exit', (code, signal) => {
              decBackendRunning = false;
            })
          }
        })
      }  
    }

    // start osx backends
    if (os.platform() === 'darwin') {
      fs.stat(upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateBackend`), function(err, stat) {
        if (err == null) {
          if (ioBackendRunning === false) {
            let iospawn = exec("start /wait " + 
            '"' + upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateBackend`) + '"' + ' ' +
              ip.toString() + ' ' + 
              port.toString()
            );
  
            ioBackendRunning = true;

            axios.post(
              'http://' + ip + ':' + port, req
            ).then(function (response) {
              console.log('big success!');
            })
            .catch(function (error) {
              console.log('Error when sending cached request');
            })
  
            iospawn.on('exit', (code, signal) => {
              ioBackendRunning = false;
            })
          }
        }
        else{
          axios.post(
            'http://' + ip + ':' + port, req
          ).then(function (response) {
            console.log('big success!');
          })
          .catch(function (error) {
            console.log('Error when sending cached request');
          })
        }
      })
      
      if (decBackendRunning === false) {
        fs.stat(upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateDetectionServer`), function(err, stat) {
          if (err == null) {
            let decspawn = exec("start /wait " + 
            '"' + upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateDetectionServer` + '"' + ' ' +
              req.port.toString() + ' ' +
              gpu
            ));
  
            ioBackendRunning = true;
  
            decspawn.on('exit', (code, signal) => {
              decBackendRunning = false;
            })
          }
        })
      }  
    }

  }
  else {
    axios.post(
      'http://' + ip + ':' + port, req
    ).then(function (response) {
      console.log('big success!');
    })
    .catch(function (error) {
      console.log('Error when sending cached request');
    })
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
			let op = spawn('gnome-terminal', ['-e','/home/bunk/BioElectron/python/YeastMate/YeastMateIO']);
			op.on ('error', (err) => { console.log (err); });
      let det = spawn('gnome-terminal', ['-e','/home/bunk/BioElectron/python/YeastMate/YeastMateDetector']);
			det.on ('error', (err) => { console.log (err); });
		}
		if (os.platform() === 'darwin') {
		  shell.openItem(upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateIO`))
      shell.openItem(upath.toUnix(`${process.resourcesPath}/python/YeastMate/YeastMateDetector`))
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
