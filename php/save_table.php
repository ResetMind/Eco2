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

saveTable();
echoJSON();

function saveTable()
{
    global $link, $bd_e, $info, $email;
    $data = file_get_contents('php://input');
    $data = json_decode($data, true);
    $name = $email . "_" . $data[name];
    $info[] = $data;
    $info[] = $name;
    $sqlreq = "DROP TABLE IF EXISTS `$name`";
    if (!mysqli_query($link, $sqlreq)) {
        $bd_e[] = "Ошибка удаления таблицы";
        $info[] = mysqli_error($link);
        return false;
    }
    if ($data[name] == "factors") {
        $sqlreq = "CREATE TABLE IF NOT EXISTS `$name`(id int not null primary key AUTO_INCREMENT, 
    year int, culture varchar(100), square varchar(100), sumO float, sumT int, 
    sumT10 int, sumT15 int, sumT20 int, sumO2 float, sumB int, sumB40 int, 
    sumB45 int, sumB50 int, chdO int, chdT10 int, chdT15 int, chdT20 int, 
    chdO2 int, chdB40 int, chdB45 int, chdB50 int);";
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
            $sqlreq .= ", '$col'";
        }
        $sqlreq .= ")";
    }
    $info[] = $sqlreq;
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
