const { ipcRenderer } = require('electron');
const path = require('path');

document.getElementById('openFileBtn').addEventListener('click', async () => {
  // Solicita ao processo principal que abra o arquivo
  
  
  const filePath = await ipcRenderer.invoke('dialog:openFile');
      
  //await ipcRenderer.send('converte');
  
  if (filePath) {
    console.log("Arquivo selecionado:", filePath);

    const fileNameWithExt = path.basename(filePath);  // Nome do arquivo com extensão




    const fileName = path.parse(fileNameWithExt).name;  // Nome do arquivo sem a extensão

    // Atualiza a interface com o caminho do arquivo e o nome
    document.getElementById('filePath').textContent = `Caminho do arquivo: ${filePath}`;
///document.getElementById('fileContent').textContent = `Conteúdo do arquivo: ${fileName}`;
    ipcRenderer.send('converte', fileName,  filePath);  
    // Aqui você pode adicionar lógica para ler o conteúdo do arquivo e exibi-lo
  }
});



ipcRenderer.on('status-conversao', (event, message) => {
    document.getElementById('statusMensagem').textContent = message;  // Exibe a mensagem na página
  });
  
  // Recebe a notificação quando a conversão for concluída
  ipcRenderer.on('converte-concluida', (event, message) => {
    document.getElementById('statusMensagem').textContent = message;  // Exibe a mensagem de conclusão
    
  });