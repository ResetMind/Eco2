<?
header("Content-Type: application/json; charset=utf-8");
session_start();
$bd_e = [];
$info = [];

$email = $_SESSION["email"];
$link = null;

$forecast_name = $email . "_forecast";
$forecast_result = [];
$forecast = "";

require_once __DIR__ . "/connect.php";
if (!connect()) {
    echoJSON();
    exit();
}
if (!update()) {
    echoJSON();
    exit();
}

echoJSON();

function update()
{
    global $link, $bd_e, $forecast_name, $forecast_result, $field_name, $step, $forecast;
    $data = file_get_contents('php://input');
    $data = json_decode($data, true);
    $field_name = $data["field_name"];
    $step = $data["step"];
    $forecast = $data["forecast"];
    if ($step == "0") {
        if($field_name == "") {
            $sqlreq = "SELECT * from `$forecast_name`";
        } else {
            $sqlreq = "SELECT * from `$forecast_name` where field='$field_name'";
        }
        if (!$result = mysqli_query($link, $sqlreq)) {
            $bd_e[] = "Ошибка выполнения запроса к БД";
            return false;
        }
        $forecast_result = mysqli_fetch_all($result, MYSQLI_ASSOC);
        if(count($forecast_result) == 0) {
            $sqlreq = "INSERT into `$forecast_name` values (null, '$field_name', '')";
            if (!$result = mysqli_query($link, $sqlreq)) {
                $bd_e[] = "Ошибка выполнения запроса к БД";
                return false;
            }
        }
        return $forecast_result;
    } elseif ($step == "1") {
        $sqlreq = "UPDATE `$forecast_name` SET forecast='$forecast' where field='$field_name'";
        if (!$result = mysqli_query($link, $sqlreq)) {
            $bd_e[] = "Ошибка выполнения запроса к БД";
            return false;
        }
        return true;
    }
}

function echoJSON()
{
    global $bd_e, $forecast_result, $field_name, $step, $forecast;
    $arr = array(
        "bd_e" => $bd_e, "forecast_result" => $forecast_result, "field_name" => $field_name, "step" => $step, "forecast" => $forecast
    );
    $output = json_encode($arr, JSON_UNESCAPED_UNICODE);
    echo $output;
}
