<?php
header("Content-Type: application/json; charset=utf-8");
$email = $_POST["email"];
$email_e = [];
$bd_e = [];
$send_email_e = [];

$link = null;
$activation_code = null;
$new_password = null;

$base_url = "http://s74588.hostru11.fornex.host/ecoprognoz.org/php";

require_once __DIR__ . "/connect.php";
if (!connect()) {
    echoJSON();
    exit();
}
require_once __DIR__ . "/form_checkers.php";
if (!findEmail()) {
    echoJSON();
    exit();
}
if (!findStatus()) {
    echoJSON();
    exit();
}
if(!setActivationCode()) {
    echoJSON();
    exit();
}
require_once __DIR__ . "/send_email.php";
$subject = "Восстановление пароля на ecoprognoz.org";
$verify_link = "$base_url/new_password_confirm.php?code=$activation_code";
$message = "Здравствуйте, $email!<br>Вы получили это письмо, потому что вы (либо кто-то, выдающий себя за вас) запросили сброс пароля. Если вы не просили выслать пароль, проигнорируйте это письмо.<br>Ваш новый пароль: $new_password<br>Вы сможете сменить его в настройках сайта.<br>Для активации пароля пройдите по <a href='$verify_link'>ссылке</a><br>Это письмо отправлено автоматически. Отвечать на него не нужно.";
if (!sendEmail($email, $subject, $message)) {
    echoJSON();
    exit();
}
echoJSON();

function setActivationCode()
{
    global $activation_code, $new_password, $email, $link, $bd_e;
    $activation_code = md5($email . time());
    $new_password = genPassword(6);
    $new_password_hash = password_hash($new_password, PASSWORD_BCRYPT);
    $sqlreq = "UPDATE users SET code='$activation_code', new_password='$new_password_hash' WHERE email='$email'";
    if (!mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка выполнения запроса к БД";
        return false;
    }
    return true;
}

function genPassword($length)
{
    $chars = "qazxswedcvfrtgbnhyujmkiolp1234567890QAZXSWEDCVFRTGBNHYUJMKIOLP";
    $size = strlen($chars) - 1;
    $password = '';
    while ($length--) {
        $password .= $chars[random_int(0, $size)];
    }
    return $password;
}

function echoJSON()
{
    global $email_e, $bd_e, $send_email_e;
    $arr = array(
        "email_e" => $email_e, "bd_e" => $bd_e, "send_email_e" => $send_email_e
    );
    $output = json_encode($arr, JSON_UNESCAPED_UNICODE);
    echo $output;
}
