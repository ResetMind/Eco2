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
$send_email_e = [];

$link = null;
$activation_code = null;

$base_url = "http://s74588.hostru11.fornex.host/ecoprognoz.org/php";

require_once __DIR__ . "/connect.php";

if (!connect()) {
    echoJSON();
    exit();
}
if (!check_values()) {
    echoJSON();
    exit();
}
if (!addUser()) {
    echoJSON();
    exit();
}
require_once __DIR__ . "/send_email.php";
$subject = "Регистрация на ecoprognoz.org";
$verify_link = "$base_url/verification.php?code=$activation_code";
$message = "Здравствуйте, $name!<br>Для подтверждения регистрации пройдите по <a href='$verify_link'>ссылке</a><br>Это письмо отправлено автоматически. Отвечать на него не нужно.";
if (!sendEmail($email, $subject, $message)) {
    //deleteUser();
    echoJSON();
    exit();
}
echoJSON();

/*function deleteUser()
{
    global $link, $bd_e, $email;
    $sqlreq = "DELETE FROM users WHERE email='$email'";
    if (!mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка удаления пользователя";
        return false;
    }
    return true;
}*/

function addUser()
{
    global $link, $bd_e, $email, $name, $password1, $activation_code;
    $activation_code = md5($email . time());
    $password1 = password_hash($password1, PASSWORD_BCRYPT);
    $sqlreq = "INSERT INTO users (id, email, name, password, code) VALUES (null, '$email', '$name', '$password1', '$activation_code')";
    if (!mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка регистрации";
        return false;
    }
    return true;
}

function check_values()
{
    require_once __DIR__ . "/form_checkers.php";
    $res = true;
    if(!checkEmail()) {
        $res = false;
    } 
    if(!checkName()) {
        $res = false;
    }
    if(!checkPassword1()) {
        $res = false;
    }
    if(!checkPassword2()) {
        $res = false;
    }
    return $res;
}

function echoJSON()
{
    global $email_e, $name_e, $password1_e, $password2_e, $bd_e, $send_email_e;
    $arr = array(
        "email_e" => $email_e, "name_e" => $name_e, "password1_e" => $password1_e,
        "password2_e" => $password2_e, "bd_e" => $bd_e, "send_email_e" => $send_email_e
    );
    $output = json_encode($arr, JSON_UNESCAPED_UNICODE);
    echo $output;
}
