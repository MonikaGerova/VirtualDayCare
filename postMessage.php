<?php
$data = $_POST['data'];
$path = $_POST['path'];

$file = fopen($path,"a+");
fwrite($file,$data."\n");
fclose($file);
?>