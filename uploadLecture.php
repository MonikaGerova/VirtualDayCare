<?php
    $name = $_POST["name"];
    $url = '';
    $target_dir = "lessons/";
    $target_file = "";

    if($_FILES["file"]["name"]){
        $target_file = $target_dir . basename($_FILES["file"]["name"]);
        $url = basename($_FILES["file"]["name"]);
        if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
            echo basename( $_FILES["file"]["name"]). " has been uploaded.\n";
             $data = '{"name":"'.$name.'","url":"'.$url.'"}';
              $file = fopen($target_dir."lessons.txt","a+");
             fwrite($file,$data."\n");
             fclose($file);
        } else {
            http_response_code(400);
            echo "Sorry, there was an error uploading your file.\n";
        }
    }else{
        $url = $_POST["url"];
         $data = '{"name":"'.$name.'","url":"'.$url.'"}';
         $file = fopen($target_dir."lessons.txt","a+");
         fwrite($file,$data."\n");
         fclose($file);
         echo "Successfull url added";
    }

?>