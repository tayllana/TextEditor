function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        // Retorne uma instância do seu adaptador de upload personalizado
        return new MyUploadAdapter(loader);
    };
}
