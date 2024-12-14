const { app, BrowserWindow, ipcMain, dialog, Menu} = require('electron');
const path = require('path');
const { execFile } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const menu = Menu.buildFromTemplate([]);
Menu.setApplicationMenu(menu); // desativa o dev tool




let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,  // Permite usar o `require` no lado do renderizador
    }
  });

  // Carrega o arquivo index.html
  mainWindow.loadFile('index.html');
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

 



// Manipula a abertura do arquivo
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile']
  });
  return result.filePaths[0]; // Retorna o caminho do arquivo selecionado
});

 


 


 
 

ipcMain.on('converte', (event, nome_arquivo, filePath) => {
  console.log('Iniciando a conversão do arquivo:', filePath);
  event.reply('status-conversao', 'A conversão está sendo realizada...');



  // Define o caminho de entrada (o arquivo MP4 que foi passado pelo frontend)
  const inputFile = filePath;  // Aqui, o `filePath` é o caminho do arquivo MP4 que você quer converter.

  // Define o caminho de saída para o arquivo MP3
  const outputFile = path.join(__dirname, `${nome_arquivo}.mp3`);  // Caminho para o arquivo MP3 gerado

  // Comando FFmpeg para converter o vídeo em MP3
  const command = ffmpegPath;  // Caminho para o executável do FFmpeg fornecido pelo ffmpeg-static
  const args = [
    '-i', inputFile,          // Especifica o arquivo de entrada
    '-vn',                    // Não inclui o vídeo (só áudio)
    '-acodec', 'libmp3lame',   // Codec de áudio MP3
    '-ab', '192k',            // Taxa de bits de áudio
    '-ar', '44100',           // Taxa de amostragem de áudio
    outputFile                // Caminho de saída para o MP3
  ];

  // Executa o comando FFmpeg
  execFile(command, args, (err, stdout, stderr) => {
    if (err) {
      console.error('Erro durante a conversão:', err);
      event.reply('converte-concluida', `Erro durante a conversão: ${err.message}`);
      return;
    }
 
    
    event.reply('converte-concluida', `Conversão de ${path.basename(filePath)} para MP3 concluída com sucesso!`);
    
  });
});


 