class MyUploadAdapter {
    constructor(loader) {
        // O carregador de arquivos
        this.loader = loader;
    }

    // Inicia o processo de upload
    upload() {
        return this.loader.file
            .then(file => new Promise((resolve, reject) => {
                this._initRequest();
                this._initListeners(resolve, reject, file);
                this._sendRequest(file);
            }));
    }

    // Aborta o processo de upload
    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    // Inicializa o objeto XMLHttpRequest
    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();

        // Configura a solicitação POST para a URL do servidor de upload
        xhr.open('POST', 'upload.php', true);
        xhr.responseType = 'json';
    }

    // Inicializa os ouvintes de eventos do XMLHttpRequest
    _initListeners(resolve, reject, file) {
        const xhr = this.xhr;
        const loader = this.loader;
        
        xhr.addEventListener('error', () => reject(`Erro ao carregar o arquivo: ${file.name}.`));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const response = xhr.response;

            if (!response || response.error) {
                return reject(response && response.error ? response.error.message : `Erro ao carregar o arquivo: ${file.name}.`);
            }

            // Resolve a promessa de upload com o URL do arquivo no servidor
            resolve({ default: response.url });
        });

        if (xhr.upload) {
            xhr.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }

    _sendRequest(file) {
        const data = new FormData();
        data.append('upload', file);
    
        // Inicializa o objeto XMLHttpRequest
        const xhr = new XMLHttpRequest();
    
        // Adiciona cabeçalhos CORS
        xhr.open('POST', '../upload.php', true);
        xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        xhr.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost'); // Substitua pelo seu domínio de front-end
        xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
        xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type');
    
        // Adiciona um evento para manipular a resposta da solicitação
        xhr.onload = function() {
            if (xhr.status === 200) {
                // Manipula a resposta do servidor
                console.log(xhr.responseText);
            } else {
                // Manipula erros de solicitação
                console.error('Erro ao fazer a solicitação: ' + xhr.status);
            }
        };
    
        // Envia a solicitação
        xhr.send(data);
    }
    
}
