<?php
$dir = "/users/";

$dirs = array_filter(glob('users\*'), 'is_dir');

  echo json_encode($dirs);
?>