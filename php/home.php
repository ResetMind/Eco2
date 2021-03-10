<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
$bd_e = [];
$access_e = [];
$info = [];
$tables_e = [];

$email = null;
$name = null;
$link = null;

$factors_rows = [];
$fields_rows = [];
$cultures_rows = [];

require_once __DIR__ . "/connect.php";
if (!connect()) {
    echoJSON();
    exit();
}
require_once __DIR__ . "/form_checkers.php";
if (!checkAuth()) {
    echoJSON();
    exit();
}
require_once __DIR__ . "/load_table.php";
$factors_name = $email . "_factors";
if (!$factors_rows = loadTable($factors_name)) {
    echoJSON();
    exit();
} else {
    $factors_rows = removeId($factors_rows);
}
$fields_name = $email . "_fields";
if (!$fields_rows = loadTable($fields_name)) {
    echoJSON();
    exit();
} else {
    $fields_rows = removeId($fields_rows);;
}
$cultures_name = $email . "_cultures";
if (!$cultures_rows = loadTable($cultures_name)) {
    echoJSON();
    exit();
} else {
    $cultures_rows = removeId($cultures_rows);
}

echoJSON();

function removeId($rows) {
    $rows_temp = [];
    foreach ($rows as $row){
        unset($row["id"]);
        $rows_temp[] = $row;
    }
    return $rows_temp;
}

function echoJSON()
{
    global $bd_e, $access_e, $info, $tables_e, $factors_rows, $fields_rows, $cultures_rows;
    $arr = array(
        "bd_e" => $bd_e, "access_e" => $access_e, "info" => $info, "tables_e" => $tables_e,
        "factors_rows" => $factors_rows, "fields_rows" => $fields_rows, "cultures_rows" => $cultures_rows
    );
    $output = json_encode($arr, JSON_UNESCAPED_UNICODE);
    echo $output;
}
