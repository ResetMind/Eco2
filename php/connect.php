<?php
function connect()
{
    global $link, $bd_e;
    $link = mysqli_connect("localhost", "root", "root", "s74588_db");
    //$link = mysqli_connect("localhost", "s83034_dbuser", "HXVO<x76*lS?<7>I", "s83034_db");
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