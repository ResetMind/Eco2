<?php
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
    $res = true;
    $email_match = null;
    $sqlreq = "SELECT email FROM users";
    if (!$result = mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка выполнения запроса к БД";
        return false;
    } else {
        while ($row = mysqli_fetch_assoc($result)) {
            if ($row["email"] == $email) {
                $email_match = $row["email"];
                break;
            }
        }
    }
    if($email_match == null) {
        $email_e[] = "Пользователя с таким email не существует";
        return false;
    }

    $password = password_hash($password, PASSWORD_BCRYPT);
    $sqlreq = "SELECT email FROM users";
    if (!$result = mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка выполнения запроса к БД";
        return false;
    } else {
        while ($row = mysqli_fetch_assoc($result)) {
            if ($row["email"] == $email) {
                $email_match = $row["email"];
                break;
            }
        }
    }


    /*$email = "'" . $email . "'";
    $password = "'" . $password . "'";
    $status = '0';
    $sqlreq = "INSERT INTO users (id, email, name, password, status) VALUES (null, " . $email . ", " . $name . ", " . $password1 . " , " . $status . ")";
    if (!mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка регистрации";
        $res = false;
    }
    return $res;*/
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
