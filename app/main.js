const { app, BrowserWindow } = require('electron')

// When Electron starts, it will check this main file as designated by the package.json
// for the main process of the application. In this main process, there is app and BrowserWindow

let mainWindow

// On the ready event, we will start a new window and give it these dimensions.
// We will also declare mainWindow in the global scope and with let so it doesn't
// get garbage collected inside the event listener below.
// Min size so that you can't shrink it too small.
// file://{__dirname} tells it to look for index.html in the same folder as main.js

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    minWidth: 500,
    minHeight: 300
  })

  // mainWindow.webContents.loadURL(`file://${__dirname}/index.html`)
  mainWindow.loadURL(`file://${__dirname}/index.html`)
})
