<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['upload']) && $_FILES['upload']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['upload']['tmp_name'];
        $fileName = $_FILES['upload']['name'];
        $fileSize = $_FILES['upload']['size'];
        $fileType = $_FILES['upload']['type'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));

        // Definir um diretório para armazenar os arquivos carregados
        $uploadFileDir = './uploads/';
        if (!file_exists($uploadFileDir)) {
            mkdir($uploadFileDir, 0777, true);
        }

        $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
        $dest_path = $uploadFileDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $dest_path)) {
            $response = [
                'url' => 'uploads/' . $newFileName
            ];
            echo json_encode($response);
        } else {
            $response = [
                'error' => 'Houve um problema ao mover o arquivo carregado para o diretório de destino.'
            ];
            echo json_encode($response);
        }
    } else {
        $response = [
            'error' => 'Não foi possível carregar o arquivo.'
        ];
        echo json_encode($response);
    }
} else {
    header("HTTP/1.0 405 Method Not Allowed testeeeeeeeeee");
    echo "Método não permitido";
}
?>
