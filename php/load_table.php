<?php
function loadTable($name)
{
    global $link, $bd_e, $info, $tables_e;
    $sqlreq = "SELECT * FROM `$name`";
    if (!$result = mysqli_query($link, $sqlreq)) {
        $tables_e[] = "Некоторые таблицы отсутствуют";
        return false;
    }
    $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
    return $rows;
}
