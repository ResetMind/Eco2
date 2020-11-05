<?php
session_start();
$bd_e = [];
$access_e = [];
$info = [];

$email = null;

$link = null;

require_once __DIR__ . "/connect.php";
if (!connect()) {
    echoJSON();
    exit();
}
require_once __DIR__ . "/form_checkers.php";
if (!checkAuth()) {
    echoJSON();
    exit();
}
echoJSON();

function echoJSON()
{
    global $bd_e, $access_e, $info;
    $arr = array(
        "bd_e" => $bd_e, "access_e" => $access_e, "info" => $info
    );
    $output = json_encode($arr, JSON_UNESCAPED_UNICODE);
    echo $output;
}