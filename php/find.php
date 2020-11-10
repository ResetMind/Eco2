<?
header("Content-Type: application/json; charset=utf-8");
session_start();
$bd_e = [];
$info = [];

$email = $_SESSION["email"];
$link = null;

$factors_rows = [];

require_once __DIR__ . "/connect.php";
if (!connect()) {
    echoJSON();
    exit();
}

