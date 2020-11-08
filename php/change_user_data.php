<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

$email = $_POST["email"];
$name = $_POST["name"];
$password = $_POST["password0"];
$password1 = $_POST["password1"];
$password2 = $_POST["password2"];

$bd_e = [];
$email_e = [];
$name_e = [];
$password_e = [];
$password1_e = [];
$password2_e = [];
$send_email_e = [];
$info = [];

$link = null;

require_once __DIR__ . "/connect.php";
if (!connect()) {
    echoJSON();
    exit();
}
if (!check_values()) {
    echoJSON();
    exit();
}
if (!saveChanges()) {
    echoJSON();
    exit();
}
echoJSON();

function check_values()
{
    global $email, $name, $password, $password1, $password2;
    require_once __DIR__ . "/form_checkers.php";
    $res = true;
    if ($_SESSION["email"] != $email) {
        if (!checkEmail()) {
            $res = false;
        }
    }
    if ($_SESSION["name"] != $name) {
        if (!checkName()) {
            $res = false;
        }
    }
    if (strlen($password) > 0 || strlen($password1) > 0 || strlen($password2) > 0) {
        if (!findPassword($_SESSION["email"])) {
            $res = false;
        }
        if (!checkPassword1()) {
            $res = false;
        }
        if (!checkPassword2()) {
            $res = false;
        }
    }
    return $res;
}

function saveChanges()
{
    global $email, $name, $password, $password1, $password2, $info;
    $res = true;
    if ($_SESSION["name"] != $name) {
        $info[] = "change name";
        if(!changeName($_SESSION["email"], $name)) {
            $res = false;
        }
    }
    return $res;
}

function changeName($email, $name) {
    global $link;
    $sqlreq = "UPDATE users SET name='$name' WHERE email='$email'";
    if (!mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка выполнения запроса к БД";
        return false;
    }
    $_SESSION["name"] = $name;
    return true;
}

function echoJSON()
{
    global $bd_e, $email_e, $name_e, $password_e, $password1_e, $password2_e, $send_email_e, $info;
    $arr = array(
        "email_e" => $email_e, "name_e" => $name_e, "password_e" => $password_e, "password1_e" => $password1_e,
        "password2_e" => $password2_e, "bd_e" => $bd_e, "send_email_e" => $send_email_e, "info" => $info
    );
    $output = json_encode($arr, JSON_UNESCAPED_UNICODE);
    echo $output;
}
