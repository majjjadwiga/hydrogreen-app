import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

import { generateMockCanFrame } from './carSimulator';
import { parseFccuCurrents, parseFccuEnvironment, parseFccuPower, parseFccuHydrogen, parseFccuState } from '../domain/carDomain';

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
   startCanSimulation(mainWindow);


}


function startCanSimulation(mainWindow: Electron.BrowserWindow){
  setInterval(() => {
        
        const rawFrame500 = generateMockCanFrame(0x500);
        
        if (rawFrame500.canId === 0x500) {
            
            const decodedData = parseFccuState(rawFrame500.buffer);

           
            mainWindow.webContents.send('can-data-updated', decodedData);
        }

        const rawFrame501 = generateMockCanFrame(0x501);
        
        if(rawFrame501.canId === 0x501){
          const decodedData = parseFccuHydrogen(rawFrame501.buffer);
          mainWindow.webContents.send('can-data-updated', decodedData);
        }

        const rawFrame502 = generateMockCanFrame(0x502);
        
        if(rawFrame502.canId === 0x502){
          const decodedData = parseFccuPower(rawFrame502.buffer);
          mainWindow.webContents.send('can-data-updated', decodedData);
        }

        const rawFrame503 = generateMockCanFrame(0x503);
        
        if(rawFrame503.canId === 0x503){
          const decodedData = parseFccuEnvironment(rawFrame503.buffer);
          mainWindow.webContents.send('can-data-updated', decodedData);
        }

        const rawFrame504 = generateMockCanFrame(0x504);
        
        if(rawFrame504.canId === 0x504){
          const decodedData = parseFccuCurrents(rawFrame504.buffer);
          mainWindow.webContents.send('can-data-updated', decodedData);
        }


    }, 1000);
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })



  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})