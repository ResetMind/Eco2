<?php
session_start();
header("Content-Type: application/json; charset=utf-8");
$bd_e = [];
$access_e = [];
$info = [];

$email = null;
$name = null;

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
if (!getUserName()) {
    echoJSON();
    exit();
}
echoJSON();

function getUserName()
{
    global $link, $email, $name;
    $sqlreq = "SELECT name FROM users WHERE email='$email'";
    if (!$result = mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка выполнения запроса к БД";
        return false;
    } else {
        if (!$row = mysqli_fetch_assoc($result)) {
            $bd_e[] = "Ошибка выполнения запроса к БД";
            return false;
        } else {
            $name = $row["name"];
        }
    }
    return true;
}

function echoJSON()
{
    global $bd_e, $access_e, $info, $name, $email;
    $arr = array(
        "bd_e" => $bd_e, "access_e" => $access_e, "email" => $email, "name" => $name, "info" => $info
    );
    $output = json_encode($arr, JSON_UNESCAPED_UNICODE);
    echo $output;
}
