<?php
session_start();
header("Content-Type: application/json; charset=utf-8");
$email = $_POST["email"];
$password = $_POST["password"];

$email_e = [];
$password_e = [];
$bd_e = [];

$link = null;

include_once __DIR__ . "/connect.php";
findUser();
echoJSON();

function findUser()
{
    global $link, $email, $password, $email_e, $password_e, $bd_e;
    //$sqlreq = "SELECT email FROM users WHERE email=" . "'" . $email . "'" . "";
    $sqlreq = "SELECT email FROM users WHERE email='$email'";
    if (!$result = mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка выполнения запроса к БД";
        return false;
    } else {
        if (!mysqli_fetch_assoc($result)) {
            $email_e[] = "Пользователя с таким email не существует";
            return false;
        }
    }

    $sqlreq = "SELECT password FROM users WHERE email='$email'";
    if (!$result = mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка выполнения запроса к БД";
        return false;
    } else {
        if ($row = mysqli_fetch_assoc($result)) {
            if (!password_verify($password, $row["password"])) {
                $password_e[] = "Неправильный пароль";
                return false;
            }
        } else {
            $bd_e[] = "Ошибка выполнения запроса к БД";
            return false;
        }
    }
    $_SESSION["email"] = $email;
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
