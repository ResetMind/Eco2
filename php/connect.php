<?php
if (!connect()) {
    echoJSON();
    exit();
}

function connect()
{
    global $link, $bd_e;
    //$link = mysqli_connect("localhost", "root", "root", "reg_bd");
    $link = mysqli_connect("hostru11.fornex.host", "s74588_dbuser", 'ek<&$y$?7KwJ:WJT', "s74588_db");
    if (!$link) {
        $bd_e[] = "Ошибка соединения с базой данных";
        return false;
    }
    return true;
}