const { app, BrowserWindow } = require('electron');

function createWindow() {
  // Crear la ventana del navegador.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // y carga el index.html de la aplicación.
  mainWindow.loadURL('http://localhost:3000');

  // Abre las herramientas de desarrollo (DevTools).
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
