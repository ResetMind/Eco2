<?php
header("Content-Type: application/json; charset=utf-8");
$email = $_POST["email"];
$name = $_POST["name"];
$password1 = $_POST["password1"];
$password2 = $_POST["password2"];

$email_e = [];
$name_e = [];
$password1_e = [];
$password2_e = [];
$bd_e = [];

$link = null;

include_once __DIR__ . "/connect.php";

if (!check_values()) {
    echoJSON();
    exit();
} else {
    addUser();
    echoJSON();
    exit();
}

function addUser()
{
    global $link, $bd_e, $email, $name, $password1;
    $password1 = password_hash($password1, PASSWORD_BCRYPT);
    $res = true;
    $email = "'" . $email . "'";
    $name = "'" . $name . "'";
    $password1 = "'" . $password1 . "'";
    $status = '0';
    $sqlreq = "INSERT INTO users (id, email, name, password, status) VALUES (null, " . $email . ", " . $name . ", " . $password1 . " , " . $status . ")";
    if (!mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка регистрации";
        $res = false;
    }
    return $res;
}

function check_values()
{
    global $email_e, $name_e, $password1_e, $password2_e;
    global $email, $name, $password1, $password2;
    global $link, $bd_e;
    $res = true;
    if (substr($email, 0) == "@") {
        $email_e[] = "Email не может начинаться с символа @";
        $res = false;
    } else if (strpos($email, "@") == false) {
        $email_e[] = "В email должен быть символ @";
        $res = false;
    } else if (substr($email, -1) == "@") {
        $email_e[] = "В email должны быть символы после @";
        $res = false;
    } else if (substr_count($email, "@") > 1) {
        $email_e[] = "Часть email после @ не может содержать @";
        $res = false;
    } else {
        $sqlreq = "SELECT email FROM users";
        if (!$result = mysqli_query($link, $sqlreq)) {
            $bd_e[] = "Ошибка выполнения запроса к БД";
            $res = false;
        } else {
            while ($row = mysqli_fetch_assoc($result)) {
                if ($row["email"] == $email) {
                    $email_e[] = "Пользователь с таким email уже существует";
                    $res = false;
                    break;
                }
            }
        }
    }
    if (mb_strlen($name) < 2 || mb_strlen($name) > 50) {
        $name_e[] = "Недопустимая длина имени (2-50 символов)";
        $res = false;
    }
    if (mb_strlen($password1) < 4 || mb_strlen($password1) > 12) {
        $password1_e[] = "Недопустимая длина пароля (4-12 символов)";
        $res = false;
    }
    if (strcmp($password1, $password2) !== 0) {
        $password2_e[] = "Пароли не совпадают";
        $res = false;
    }
    return $res;
}

function echoJSON()
{
    global $email_e, $name_e, $password1_e, $password2_e, $bd_e;
    $arr = array(
        "email_e" => $email_e, "name_e" => $name_e, "password1_e" => $password1_e,
        "password2_e" => $password2_e, "bd_e" => $bd_e
    );
    $output = json_encode($arr, JSON_UNESCAPED_UNICODE);
    echo $output;
}
