class MyUploadAdapter {
  constructor(loader) {
    // O carregador de arquivos
    this.loader = loader;
  }

  // Inicia o processo de upload
  upload() {
    return this.loader.file
      .then(file => new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/adm/ckeditor5/upload.php', true);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            xhr.upload.addEventListener('progress', (evt) => {
                if (evt.lengthComputable) {
                    const percentComplete = (evt.loaded / evt.total) * 100;
                    console.log(percentComplete);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    resolve({
                        default: response.url
                    });
                } else {
                    reject(xhr.statusText);
                }
            });

            xhr.addEventListener('error', () => {
                reject(xhr.statusText);
            });

            xhr.send(formData);
      }));
  }

  // Aborta o processo de upload
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

}