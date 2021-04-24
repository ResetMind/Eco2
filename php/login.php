<?php
session_start();
header("Content-Type: application/json; charset=utf-8");
$email = $_POST["email"];
$password = $_POST["password"];
$name = null;

$bd_e = [];

$link = null;

require_once __DIR__ . "/connect.php";
if (!connect()) {
    echoJSON();
    exit();
}
findUser();
echoJSON();

function findUser()
{
    global $link, $email, $name, $password, $bd_e;
    require_once __DIR__ . "/form_checkers.php";
    if(!findEmail()) {
        return false;
    }
    if(!findPassword($email)) {
        return false;
    }
    if(!findStatus()) {
        return false;
    }
    if (isset($_POST["remember_me_checkbox"])) {
        $token = password_hash($email . time(), PASSWORD_BCRYPT);
        $sqlreq = "UPDATE users SET token='$token' WHERE email='$email'";
        if (!mysqli_query($link, $sqlreq)) {
            $bd_e[] = "Ошибка выполнения запроса к БД";
            return false;
        } else {
            setcookie("token", $token, time() + (60 * 60 * 24 * 7));
        }
    } else {
        $sqlreq = "UPDATE users SET token=null WHERE email='$email'";
        if (!mysqli_query($link, $sqlreq)) {
            $bd_e[] = "Ошибка выполнения запроса к БД";
            return false;
        } else {
            setcookie("token", "", time() - 3600);
        }
    }
    $_SESSION["email"] = $email;
    $_SESSION["name"] = $name;
}

function echoJSON()
{
    global $bd_e;
    $arr = array(
        "bd_e" => $bd_e
    );
    $output = json_encode($arr, JSON_UNESCAPED_UNICODE);
    echo $output;
}
