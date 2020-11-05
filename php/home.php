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
if (!checkAuth()) {
    echoJSON();
    exit();
}
echoJSON();

function checkAuth()
{
    global $access_e, $info, $email;
    if (!isset($_SESSION["email"]) && !checkCookie()) {
        $access_e[] = "Войдите для доступа к запрашиваемой странице";
        return false;
    }
    $info[] = $_SESSION["email"];
    $info[] = $_COOKIE["token"];
    $email = $_SESSION["email"];
    return true;
}

function checkCookie()
{
    if(!isset($_COOKIE["token"])) {
        return false;
    }
    global $link, $bd_e;
    $token = $_COOKIE["token"];
    $sqlreq = "SELECT email FROM users WHERE token='$token'";
    if (!$result = mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка выполнения запроса к БД";
        return false;
    } else {
        if ($row = mysqli_fetch_assoc($result)) {
            $_SESSION["email"] = $row["email"];
            return true;
        }
        return false;
    }
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
