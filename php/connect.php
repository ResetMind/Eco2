<?php
function connect()
{
    global $link, $bd_e;
    $link = mysqli_connect("localhost", "root", "root", "reg_bd");
    //$link = mysqli_connect("localhost", "s74588_dbuser", "3pyvl2uulhwnw6admf", "s74588_db");
    if (!$link) {
        $bd_e[] = "Ошибка соединения с базой данных";
        return false;
    }
    if (!mysqli_set_charset($link, "utf8")) {
        $bd_e[] = "Ошибка установки кодировки базы данных";
        return false;
    }
    return true;
}