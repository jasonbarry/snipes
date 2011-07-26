<?php

header('Content-type: application/javascript');

$data['ip'] = $_SERVER['REMOTE_ADDR'];
$data['host'] = $_SERVER['REMOTE_HOST'];
$data['ref'] = $_SERVER['HTTP_REFERER'];
$data['lang'] = $_SERVER['HTTP_ACCEPT_LANGUAGE'];

echo json_encode($data);

?>
