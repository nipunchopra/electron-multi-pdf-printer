const { ipcRenderer, contextBridge } = require("electron");

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

contextBridge.exposeInMainWorld("api", {
  //Electron Api
  electron: {
    sendNotifications(message) {
      ipcRenderer.send("notify", message);
    },
  },

  // Get all printers
  fetchAllPrinters: () => ipcRenderer.send(FETCH_ALL_PRINTERS),

  receiveAllPrinters: {
    add: (handler) => ipcRenderer.on(RECEIVE_ALL_PRINTERS, handler),
    remove: (handler) => ipcRenderer.removeListener(RECEIVE_ALL_PRINTERS, handler),
  },

  // verify files before printing
  fetchFilesToVerify: (files) => ipcRenderer.send(FETCH_FILES_TO_VERIFY, files),

  receiveVerifiedFiles: {
    add: (handler) => ipcRenderer.on(RECEIVE_VERIFIED_FILES, handler),
    remove: (handler) => ipcRenderer.removeListener(RECEIVE_VERIFIED_FILES, handler),
  },

  //files to print
  fetchFilesToPrint: (files) => ipcRenderer.send(FETCH_FILES_TO_PRINT, files),

  receivePrintedFiles: {
    add: (handler) => ipcRenderer.on(RECEIVE_PRINTED_FILES, handler),
    remove: (handler) => ipcRenderer.removeListener(RECEIVE_PRINTED_FILES, handler),
  },

  receivePrintingCompleted: {
    add: (handler) => ipcRenderer.on(RECEIVE_PRINTED, handler),
    remove: (handler) => ipcRenderer.removeListener(RECEIVE_PRINTED, handler),
  },

  fetchClear: () => ipcRenderer.send(FETCH_CLEAR),

  receiveClear: {
    add: (handler) => ipcRenderer.on(RECEIVE_CLEAR, handler),
    remove: (handler) => ipcRenderer.removeListener(RECEIVE_CLEAR, handler),
  },
});
