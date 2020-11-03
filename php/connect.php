<?php
if (!connect()) {
    echoJSON();
    exit();
}

function connect()
{
    global $link, $bd_e;
    //$link = mysqli_connect("localhost", "root", "root", "reg_bd");
    $link = mysqli_connect("localhost", "s74588_dbuser", "3pyvl2uulhwnw6admf", "s74588_db");
    if (!$link) {
        $bd_e[] = "Ошибка соединения с базой данных";
        return false;
    }
    return true;
}