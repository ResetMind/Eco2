<?php
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

function checkEmail()
{
    global $email, $email_e, $link, $bd_e;
    if (substr($email, 0) == "@") {
        $email_e[] = "Email не может начинаться с символа @";
        return false;
    } else if (strpos($email, "@") == false) {
        $email_e[] = "В email должен быть символ @";
        return false;
    } else if (substr($email, -1) == "@") {
        $email_e[] = "В email должны быть символы после @";
        return false;
    } else if (substr_count($email, "@") > 1) {
        $email_e[] = "Часть email после @ не может содержать @";
        return false;
    } else {
        $sqlreq = "SELECT email FROM users WHERE email='$email'";
        if (!$result = mysqli_query($link, $sqlreq)) {
            $bd_e[] = "Ошибка выполнения запроса к БД";
            return false;
        } else {
            if (mysqli_fetch_assoc($result)) {
                $email_e[] = "Пользователь с таким email уже существует";
                return false;
            }
        }
    }
    return true;
}

function checkName()
{
    global $name, $name_e;
    if (mb_strlen($name) < 2 || mb_strlen($name) > 50) {
        $name_e[] = "Недопустимая длина имени (2-50 символов)";
        return false;
    }
    return true;
}

function checkPassword1()
{
    global $password1, $password1_e;
    if (mb_strlen($password1) < 4 || mb_strlen($password1) > 12) {
        $password1_e[] = "Недопустимая длина пароля (4-12 символов)";
        return false;
    }
    return true;
}

function checkPassword2()
{
    global $password1, $password2, $password2_e;
    if (strcmp($password1, $password2) !== 0) {
        $password2_e[] = "Пароли не совпадают";
        return false;
    }
    return true;
}
