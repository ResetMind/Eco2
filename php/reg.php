<?php
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

    if(!connect()) {
        echoJSON();
        exit();
    }
    if (!check_values()) {
        echoJSON();
        exit();
    }

    echo "!!!!!!!!!!";

    function connect()
    {
        global $link, $bd_e;
        $link = mysqli_connect("localhost", "root", "", "reg_bd");
        if (!$link) {
            $bd_e[] = "Ошибка соединения с базой данных";
            //echo "<br/>Не могу соединиться с сервером баз данных.<br/>";
            return false;
        }
        return true;
    }

    function check_values()
    {
        global $email_e, $name_e, $password1_e, $password2_e;
        global $email, $name, $password1, $password2;
        $res = true;
        if (strpos($email, "@") == false) {
            $email_e[] = "В email должен быть символ @";
            //echo "В email должен быть символ @<br>";
            $res = false;
        }
        if (mb_strlen($name) < 1 || mb_strlen($name) > 50) {
            $name_e[] = "Недопустимая длина имени (1-50 символов)";
            //echo "Недопустимая длина имени<br>";
            $res = false;
        }
        if (mb_strlen($password1) < 4 || mb_strlen($password1) > 12) {
            $password1_e[] = "Недопустимая длина пароля (4-12 символов)";
            //echo "Недопустимая длина пароля (4-12 символов)<br>";
            $res = false;
        }
        if ($password1 !== $password2) {
            $password2_e[] = "Пароли не совпадают";
            //echo "Пароли не совпадают";
            $res = false;
        }
        return $res;
    }

    function echoJSON()
    {
        global $email_e, $name_e, $password1_e, $password2_e, $bd_e;
        $arr = array("email_e" => $email_e, "name_e" => $name_e, "password1_e" => $password1_e,
            "password2_e" => $password2_e, "bd_e" => $bd_e);
        $output = json_encode($arr, JSON_UNESCAPED_UNICODE);
        echo $output;
    }
