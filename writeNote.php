<?php
$data = $_POST['data'];
$path = $_POST['path'];

echo $data;
$file = fopen($path,"w");
fwrite($file,$data);
fclose($file);
?>