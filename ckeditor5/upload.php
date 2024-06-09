<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file'])) {
        $fileTmpPath = $_FILES['file']['tmp_name'];
        $fileName = $_FILES['file']['name'];
        $fileSize = $_FILES['file']['size'];
        $fileType = $_FILES['file']['type'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));

        $uploadFileDir = 'uploads/';
        chmod($uploadFileDir, 0777);        

        $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
        $dest_path = $uploadFileDir . $newFileName;
        
        if (move_uploaded_file($fileTmpPath, $dest_path)) {
            $response = [
                'url' => 'https://www.fatorcor.com.br/adm/ckeditor5/uploads/' . $newFileName
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
    header("HTTP/1.0 405 Method Not Allowed");
    echo "Método não permitido";
}
?>
