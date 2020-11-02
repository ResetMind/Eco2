<?php
header("Content-Type: application/json; charset=utf-8");
$email = $_POST["email"];
$password = $_POST["password"];

$email_e = [];
$password_e = [];
$bd_e = [];

$link = null;

if (!connect()) {
    echoJSON();
    exit();
}

function connect()
{
    global $link, $bd_e;
    $link = mysqli_connect("localhost", "root", "root", "reg_bd");
    if (!$link) {
        $bd_e[] = "Ошибка соединения с базой данных";
        return false;
    }
    return true;
}

function echoJSON()
{
    global $email_e, $password_e, $bd_e;
    $arr = array(
        "email_e" => $email_e, "password_e" => $password_e, "bd_e" => $bd_e
    );
    $output = json_encode($arr, JSON_UNESCAPED_UNICODE);
    echo $output;
}
