'use strict'

require('dotenv').config();

import { app, BrowserWindow, Tray, Menu } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'

const isDevelopment = process.env.NODE_ENV !== 'production'
const assetsDir = path.resolve(app.getAppPath(), "build");
// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow
let isQuiting;
let tray;

function createMainWindow() {
  let windowOptions = {
    webPreferences: {
      nodeIntegration: false,
    },
    width: 1024,
    height: 600,
    title: 'CERN Phone'};

  process.stdout.write(assetsDir)
  // tray = new Tray('build/icon.png');
  //
  // tray.setContextMenu(Menu.buildFromTemplate([
  //   {
  //     label: 'Show App', click: function () {
  //       mainWindow.show();
  //     }
  //   },
  //   {
  //     label: 'Quit', click: function () {
  //       isQuiting = true;
  //       app.quit();
  //     }
  //   }
  // ]));

  const window = new BrowserWindow(windowOptions)

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

  // mainWindow = new BrowserWindow(windowOptions)

  // and load the index.html of the app.
  // mainWindow.loadURL(url.format({
  //     pathname: path.join(__dirname, 'index.html'),
  //     protocol: 'file:',
  //     slashes: true
  // }))
  process.stdout.write('your output to command prompt console or node js ')
  window.loadURL(process.env.WEBAPP_URL);

  // if (isDevelopment) {
  //   window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  // }
  // else {
  //   window.loadURL(formatUrl({
  //     pathname: path.join(__dirname, 'index.html'),
  //     protocol: 'file',
  //     slashes: true
  //   }))
  // }

  window.on('closed', () => {
    mainWindow = null
  })

  // window.on('minimize',function(event){
  //   event.preventDefault();
  //   mainWindow.hide();
  // });
  //
  // window.on('close', function (event) {
  //   if(!app.isQuiting){
  //     process.stdout.write(`Hiding application`)
  //     event.preventDefault();
  //     mainWindow.hide();
  //   }
  //
  //   return false;
  // });

  // window.on("close", (evt) => {
  //   evt.preventDefault();    // This will cancel the close
  //   window.hide();
  // });

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})

app.on('certificate-error', function (event, webContents, url, error, certificate, callback) {
  process.stdout.write(url)
  // if (url === 'https://imac02.cern.ch:3000/' || url === 'https://imac02.cern.ch:8080/') {
  process.stdout.write('Preventing certificate error')
  event.preventDefault();
  callback(true)
  // } else {
  //     process.stdout.write('Not allowing certificate error')
  //     callback(false)
  // }
});

app.on('before-quit', function () {
  isQuiting = true;
});
