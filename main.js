// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Notification, dialog, Menu } = require("electron");
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const { lstatSync } = require("fs");

const { print } = require("pdf-to-printer");
const isDev = !app.isPackaged;

const {
  FETCH_ALL_PRINTERS,
  RECEIVE_ALL_PRINTERS,
  FETCH_FILES_TO_VERIFY,
  RECEIVE_VERIFIED_FILES,
  FETCH_FILES_TO_PRINT,
  RECEIVE_PRINTED_FILES,
  RECEIVE_PRINTED,
  FETCH_CLEAR,
  RECEIVE_CLEAR,
} = require("./utils/constants");

let mainWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: "PDF Printer - Bhartiya Electric Press",
    width: 850,
    height: 505,
    icon: "./public/logo.ico",
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecutionJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("./public/index.html");

  // Open the DevTools.
  // isDev && mainWindow.webContents.openDevTools();

  Menu.setApplicationMenu(null);
}

if (isDev) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// app.disableHardwareAcceleration();

ipcMain.on("notify", (_, message) => {
  new Notification({ title: "Notification", body: message }).show();
});

ipcMain.on(FETCH_ALL_PRINTERS, () => {
  let list = mainWindow.webContents.getPrinters();
  mainWindow.send(RECEIVE_ALL_PRINTERS, list);
});

ipcMain.on(FETCH_FILES_TO_VERIFY, (_, files) => {
  let fileList = [];

  for (const file of files) {
    let fileSystem = lstatSync(file.path);

    if (fileSystem.isFile()) {
      var ext = file.name.split(".").reverse()[0];

      if (ext.toLowerCase() === "pdf") {
        fileList.push(file);
      }
    }
  }

  mainWindow.send(RECEIVE_VERIFIED_FILES, fileList);
});

ipcMain.on(FETCH_FILES_TO_PRINT, (_, data) => {
  let options = {
    printer: data.printer,
    scale: "fit",
  };

  if (data.subset === "odd" || data.subset === "even") {
    Object.assign(options, { subset: data.subset });
  }

  let length = data.files.length;

  data.files.forEach((file, k) => {
    readPdf(file.path)
      .then(function (response) {
        let pages = "3-" + response;

        Object.assign(options, { pages: pages });

        print(file.path, options)
          .then(() => {
            mainWindow.send(RECEIVE_PRINTED_FILES, { printed: true, id: k });
            printingCompleted(k, length);
          })
          .catch(() => printingFailed(k, length));
      })
      .catch(() => printingFailed(k, length));
  });
});

const printingFailed = (k, length) => {
  mainWindow.send(RECEIVE_PRINTED_FILES, { printed: false, id: k });
  printingFailed(k, length);
};

const printingCompleted = (k, length) => {
  if (k === length - 1) {
    dialog.showMessageBoxSync(mainWindow, { title: "Files Printed", type: "info", message: "All files Printed" });

    mainWindow.send(RECEIVE_PRINTED);
  }
};

ipcMain.on(FETCH_CLEAR, () => {
  let response = dialog.showMessageBoxSync(mainWindow, {
    title: "Clear file list?",
    type: "question",
    message: "Want to clear file list?",
    buttons: ["cancel", "Confirm"],
    cancelId: 0,
  });

  if (response === 1) {
    mainWindow.send(RECEIVE_CLEAR);
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const readPdf = async (uri) => {
  const buffer = fs.readFileSync(uri);
  try {
    const data = await pdfParse(buffer);

    return data.numpages;
  } catch (err) {
    throw new Error(err);
  }
};
