<?php
$new_file_path = $_GET['file_path'];
$new_file_path = str_replace('./documents', '../documents', $new_file_path);
file_put_contents($new_file_path, '');
echo "file created ".$new_file_path;