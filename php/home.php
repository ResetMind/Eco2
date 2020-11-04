<?php
session_start();
$bd_e = [];
$access_e = [];
$info = [];

require_once __DIR__ . "/connect.php";
if (!connect()) {
    echoJSON();
    exit();
}
if(!checkAuth()) {
    echoJSON();
    exit();
}
echoJSON();

function checkAuth() {
    global $access_e, $info;
    if(!isset($_SESSION["email"])) {
        $info[] = "!isset";
        $access_e[] = "Войдите для доступа к запрашиваемой странице";
        return false;
    }
    $info[] = $_SESSION["email"];
    return true;
}

function echoJSON()
{
    global $bd_e, $access_e, $info;
    $arr = array(
        "bd_e" => $bd_e, "access_e" => $access_e, "info" => $info
    );
    $output = json_encode($arr, JSON_UNESCAPED_UNICODE);
    echo $output;
}