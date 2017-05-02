// Use fs like in Node to access the filesystem
const fs = require('fs')

// Now connect renderer process to main process, which is the only process that can interact with the OS and thus open dialog boxes and such.
// shell lets the file be opened in the file browser and lets the OS resolve some other shit for you
// clipboard for clipboard
const { remote, shell, clipboard } = require('electron')
const getTextStatistics = require('./lib/get-statistics')

// refers to the current window
const currentWindow = remote.getCurrentWindow()

// know the current file and get the current state to know if there are unsaved changes
let currentFile = null
// above: when first opening, there is no content
let originalContent = ''
// above: when the user deletes everything from the input area, it is an empty string. If the initial were null then deleting everything would not be represent that the file has nothing to save.

// Caching a bunch of DOM selectors here
const content = document.getElementById('content')
const lineCount = document.getElementById('line-count')
const wordCount = document.getElementById('word-count')
const readingTime = document.getElementById('reading-time')
const openFile = document.getElementById('open-file')
const saveFile = document.getElementById('save-file')
const copyToClipboard = document.getElementById('copy-to-clipboard')

const updateUserInterface = (content) => {
  const { lines, words, text } = getTextStatistics(content)
  wordCount.textContent = words
  lineCount.textContent = lines
  readingTime.textContent = text

  // check to see if the content has been edited
  // reflects in OS to show if it's edited or not
  currentWindow.setDocumentEdited(content !== originalContent)
}

content.addEventListener('keydown', () => {
  updateUserInterface(content.value)
})

// COMMENT: this is also good
// content.addEventListener('keyup', () => {
//   updateUserInterface(content.value)
// })

openFile.addEventListener('click', () => {
  // triggers a dialog from the MAIN process
  // get the dialog module from main
  // title: Windows gives the dialog box title text
  // properties: Open, Save, etc but we just want open
  // filter: prevent opening a PDF for instance
  const files = remote.dialog.showOpenDialog(currentWindow, {
    title: 'Open File',
    properties: ['openFile'],
    filters: [
      {name: 'Text Files', extensions: ['txt', 'text']},
      {name: 'Markdown', extensions: ['md', 'markdown']}
    ]
  })

  // Saving the file into the files constant

  // return out if the user cancels opening
  if (!files) { return }

  // otherwise, get the name of the file
  currentFile = files[0]

  // get the file and the content of the file
  // toString to prevent getting buffer from Node
  const file = currentFile
  const text = fs.readFileSync(file).toString()

  // puts it in!
  updateCurrentFile(file, text)
})

saveFile.addEventListener('click', () => {
  // If the currentfile is known just save it
  // If not, then bring up the dialog to save it
  // Defaults to documents folder on MAC ONLY with defaultpath setting
  const file = currentFile || remote.dialog.showSaveDialog(currentWindow, {
    title: 'Save File',
    defaultPath: remote.app.getPath('documents'),
    filters: [
      { name: 'Text Files', extensions: ['txt', 'text'] },
      { name: 'Markdown', extensions: ['markdown', 'md'] }
    ]
  })

  // If cancel, don't write
  if (!file) { return }

  // Need current file
  // updateCurrentFile needed for new files to update location
  // shell to show location in file system.
  fs.writeFileSync(file, content.value)
  updateCurrentFile(file, content.value)
  shell.showItemInFolder(file)
})

copyToClipboard.addEventListener('click', () => {
  clipboard.writeText(content.value)
})

const updateCurrentFile = (file, text) => {
  currentFile = file
  originalContent = text
  content.value = text

  // See current file name in Title bar
  currentWindow.setTitle(file)

  // Lets you drag the little icon in the title bar.
  currentWindow.setRepresentedFilename(file)

  // Add to OS recent documents list
  remote.app.addRecentDocument(file)

  // As declared above with keydowns, refresh the stats
  updateUserInterface(text)
}
