<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
$bd_e = [];
$info = [];

$link = null;

if (!isset($_SESSION["email"])) {
    return;
}
$email = $_SESSION["email"];
require_once __DIR__ . "/connect.php";
if (!connect()) {
    echoJSON();
    exit();
}
if (!saveTable()) {
    echoJSON();
    exit();
}
echoJSON();

function saveTable()
{
    global $link, $bd_e, $info, $email;
    mysqli_query($link, "SET NAMES 'utf8mb4'");
    $data = file_get_contents('php://input');
    $data = json_decode($data, true);
    $info[] = $data;
    $name = $email . "_" . $data["name"];
    $sqlreq = "DROP TABLE IF EXISTS `$name`";
    if (!mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка удаления таблицы";
        $info[] = mysqli_error($link);
        return false;
    }
    if ($data["name"] == "factors") {
        /*$sqlreq = "CREATE TABLE IF NOT EXISTS `$name`(id int not null primary key AUTO_INCREMENT, 
    year int, field varchar(100), culture varchar(100), sumO float, sumT float, 
    sumT10 float, sumT15 float, sumT20 float, sumO2 float, sumB int, sumB40 int, 
    sumB45 int, sumB50 int, chdO int, chdT10 int, chdT15 int, chdT20 int, 
    chdO2 int, chdB40 int, chdB45 int, chdB50 int);";*/
        $sqlreq = "CREATE TABLE IF NOT EXISTS `$name`(id int not null primary key AUTO_INCREMENT, 
    year int, field varchar(100), culture varchar(100), sumT float, sumT10 float, 
    sumT15 float, sumT20 float, chdT10 int, chdT15 int, chdT20 int, sumO float, 
    sumO2 float, chdO int, chdO2 int, sumB int, sumB40 int, sumB45 int, sumB50 int, 
    chdB40 int, chdB45 int, chdB50 int);";
    } else if ($data["name"] == "fields") {
        $sqlreq = "CREATE TABLE IF NOT EXISTS `$name`(id int not null primary key AUTO_INCREMENT, 
    cadastral varchar(50), coordinates varchar(100), owner varchar (100));";
    } else if ($data["name"] == "cultures") {
        $sqlreq = "CREATE TABLE IF NOT EXISTS `$name`(id int not null primary key AUTO_INCREMENT, 
    name varchar(100));";
    } else {
        return false;
    }
    if (!mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка создания таблицы";
        $info[] = mysqli_error($link);
        return false;
    }
    foreach ($data as $row) {
        if (!is_array($row)) {
            continue;
        }
        $sqlreq = "INSERT INTO `$name` VALUES (null";
        foreach ($row as $col) {
            $sqlreq .= ", " . ifEmpty($col);
        }
        $sqlreq .= ")";
        $info[] = $sqlreq;
        if (!mysqli_query($link, $sqlreq)) {
            $bd_e[] = "Ошибка сохранения данных";
            $info[] = mysqli_error($link);
            return false;
        }
    }
    return true;
}

function ifEmpty($cell)
{
    if ($cell == "") {
        return "DEFAULT";
    } else {
        return "'" . $cell . "'";
    }
    return $cell;
}

function echoJSON()
{
    global $bd_e, $info;
    $arr = array(
        "bd_e" => $bd_e, "info" => $info
    );
    $output = json_encode($arr, JSON_UNESCAPED_UNICODE);
    echo $output;
}
