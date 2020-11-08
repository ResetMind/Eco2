<?php
session_start();
header("Content-Type: application/json; charset=utf-8");
$email = $_POST["email"];
$password = $_POST["password"];

$email_e = [];
$password_e = [];
$bd_e = [];
$info = [];

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
    global $link, $email, $password, $email_e, $password_e, $bd_e, $info;
    //$sqlreq = "SELECT email FROM users WHERE email=" . "'" . $email . "'" . "";
    /*$sqlreq = "SELECT email FROM users WHERE email='$email'";
    if (!$result = mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка выполнения запроса к БД";
        return false;
    } else {
        if (!mysqli_fetch_assoc($result)) {
            $email_e[] = "Пользователя с таким email не существует";
            return false;
        }
    }*/
    require_once __DIR__ . "/form_checkers.php";
    if(!findEmail()) {
        return false;
    }
    if(!findPassword()) {
        return false;
    }
    if(!findStatus()) {
        return false;
    }
    /*$sqlreq = "SELECT password, status FROM users WHERE email='$email'";
    if (!$result = mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка выполнения запроса к БД";
        return false;
    } else {
        if ($row = mysqli_fetch_assoc($result)) {
            if (!password_verify($password, $row["password"])) {
                $password_e[] = "Неправильный пароль";
                return false;
            } else {
                if ($row["status"] != "1") {
                    $email_e[] = "Ваш аккаунт не подтвержден";
                    return false;
                }
            }
        } else {
            $bd_e[] = "Ошибка выполнения запроса к БД";
            return false;
        }
    }*/
    if (isset($_POST["remember_me_checkbox"])) {
        $token = password_hash($email . time(), PASSWORD_BCRYPT);
        $sqlreq = "UPDATE users SET token='$token' WHERE email='$email'";
        if (!mysqli_query($link, $sqlreq)) {
            $bd_e[] = "Ошибка выполнения запроса к БД";
            return false;
        } else {
            setcookie("token", $token, time() + (60/* * 60 * 24 * 7*/));
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
}

function echoJSON()
{
    global $email_e, $password_e, $bd_e, $info;
    $arr = array(
        "email_e" => $email_e, "password_e" => $password_e, "bd_e" => $bd_e, "info" => $info
    );
    $output = json_encode($arr, JSON_UNESCAPED_UNICODE);
    echo $output;
}
