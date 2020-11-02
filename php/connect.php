<?php
if (!connect()) {
    echoJSON();
    exit();
}

function connect()
{
    global $link, $bd_e;
    $link = mysqli_connect("localhost", "root", "root", "reg_bd");
    if (!$link) {
        $bd_e[] = "Ошибка соединения с базой данных";
        return false;
    }
    return true;
}