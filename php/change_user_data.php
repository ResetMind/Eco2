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
$results = [];

$link = null;
$email_changed = false;

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
        if (!findPassword($_SESSION["email"], FALSE)) {
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
    global $email, $email_changed, $name, $password, $password1, $password2, $info, $results;
    $res = true;
    $email_changed = false;
    if ($_SESSION["name"] != $name) {
        $info[] = "change name";
        if (!changeName($_SESSION["email"], $name)) {
            $res = false;
        } else {
            $results[] = "Имя изменено";
        }
    }
    if ($_SESSION["email"] != $email) {
        $info[] = "change email";
        if (!changeEmail($_SESSION["email"], $email)) {
            $res = false;
        } else {
            $results[] = "Подтвердите email";
            $_SESSION = [];
            setcookie("token", "", time() - 3600);
        }
    }
    if (strlen($password) > 0 || strlen($password1) > 0 || strlen($password2) > 0) {
        $info[] = "change pass";
        if (!changePassword($_SESSION["email"], $password1)) {
            $res = false;
        } else {
            $results[] = "Пароль изменен";
            $_SESSION = [];
            setcookie("token", "", time() - 3600);
        }
    }
    return $res;
}

function changePassword($email, $new_password) {
    global $link;
    $new_password = password_hash($new_password, PASSWORD_BCRYPT);
    $sqlreq = "UPDATE users SET password='$new_password' WHERE email='$email'";
    if (!mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка выполнения запроса к БД";
        return false;
    }
    return true;
}

function changeName($email, $name)
{
    global $link;
    $sqlreq = "UPDATE users SET name='$name' WHERE email='$email'";
    if (!mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка выполнения запроса к БД";
        return false;
    }
    $_SESSION["name"] = $name;
    return true;
}

function changeEmail($old_email, $new_email)
{
    global $link;
    $activation_code = md5($new_email . time());
    $sqlreq = "UPDATE users SET new_email='$new_email', code='$activation_code' WHERE email='$old_email'";
    if (!mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка выполнения запроса к БД";
        return false;
    } else {
        require_once __DIR__ . "/send_email.php";
        $base_url = "http://s83034.hostru08.fornex.host//ecoprognoz.com/php";
        $subject = "Смена email на ecoprognoz.org";
        $verify_link = "$base_url/email_change.php?code=$activation_code";
        $name = $_SESSION["name"];
        $message = "Здравствуйте, $name!<br>Вы получили это письмо, потому что вы (либо кто-то, выдающий себя за вас) запросили изменение email. Если вы не делали такой запрос, проигнорируйте это письмо. Для подтверждения смены почты пройдите по <a href='$verify_link'>ссылке</a><br>Это письмо отправлено автоматически. Отвечать на него не нужно.";
        if (!sendEmail($new_email, $subject, $message)) {
            return false;
        }
    }
    return true;
}

function echoJSON()
{
    global $bd_e, $email_e, $name_e, $password_e, $password1_e, $password2_e, $send_email_e, $info, $results;
    $arr = array(
        "email_e" => $email_e, "name_e" => $name_e, "password_e" => $password_e, "password1_e" => $password1_e,
        "password2_e" => $password2_e, "bd_e" => $bd_e, "send_email_e" => $send_email_e, "info" => $info, "results" => $results
    );
    $output = json_encode($arr, JSON_UNESCAPED_UNICODE);
    echo $output;
}
