<?php
    $user = $_POST["username"];
    $target_dir = "users/".$user."/";

    $target_file = $target_dir . basename($_FILES["photo"]["name"]);
    $uploadOk = 1;


    if(isset($_POST["submit"])) {   // Check if image file is a actual image or fake image
        $check = getimagesize($_FILES["photo"]["tmp_name"]);
        if($check !== false) {
            $uploadOk = 1;
        } else {
            $uploadOk = 0;
        }
    }

    // Allow certain file formats
    $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
    if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
        echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.\n";
        $uploadOk = 0;
    }

    if ($uploadOk == 0) {
        echo "Sorry, your file was not uploaded.\n";
        http_response_code(400);
    } else {
        if (move_uploaded_file($_FILES["photo"]["tmp_name"], $target_file)) {
            echo basename( $_FILES["photo"]["name"]). " has been uploaded.\n";

            $file = fopen($target_dir."gallery.txt","a+");
            fwrite($file,$_FILES["photo"]["name"]."\n");
            fclose($file);

        } else {
            http_response_code(400);
            echo "Sorry, there was an error uploading your file.\n";
        }
    }
?>