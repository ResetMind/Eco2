<?
header("Content-Type: application/json; charset=utf-8");
session_start();
$bd_e = [];
$info = [];

$email = $_SESSION["email"];
$link = null;

$factors_name = $email . "_factors";
$factors_result = [];

require_once __DIR__ . "/connect.php";
if (!connect()) {
    echoJSON();
    exit();
}
if (!find()) {
    echoJSON();
    exit();
}

echoJSON();

function find() {
    global $link, $bd_e, $info, $factors_name, $factors_result;
	$arr = array();
	if ($_POST["year1"] != "") {
		$arr[] = "year >= " . $_POST["year1"];
	} else {
        $arr[] = "year >= 0";
    }
	if ($_POST["year2"] != "") {
		$arr[] = "year <= " . $_POST["year2"];
	}
	if ($_POST["culture"] != "") {
		$arr[] = "culture like '%" . $_POST["culture"] . "%'";
	}
	if ($_POST["field"] != "") {
		$arr[] = "square like '%" . $_POST["field"] . "%'";
	}
	$l = count($arr);
	if ($l == 0) {
        $info[] = "Совпадений не найдено";
        return false;
	}
	$request = "";
	for ($i = 0; $i < $l; $i++) {
		if ($i < count($arr) - 1) {
			$request .= $arr[$i] . " and ";
		} else {
			$request .= $arr[$i];
		}
	}
	$sqlreq = "SELECT * from `$factors_name` where " . $request;
	if (!$rows = mysqli_query($link, $sqlreq)) {
		$bd_e[] = "Ошибка выполнения запроса к БД";
		return false;
	}
	if ($row = mysqli_fetch_assoc($rows)) {
		$result = "";
		do {
            $result .= "<tr>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["year"]."</td>";
            $result .= "<td width=\"200px\" tabindex=\"0\" contenteditable>". $row["culture"]."</td>";
            $result .= "<td width=\"200px\" tabindex=\"0\" contenteditable>". $row["square"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumO"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumO"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT10"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumO"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT15"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumO"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT20"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumO2"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumO2"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT10"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumO2"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT15"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumO2"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT20"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumB"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumB"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT10"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumB"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT15"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumB"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT20"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumB40"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumB45"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumB50"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumB40"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT10"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumB40"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT15"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumB40"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT20"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumB45"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT10"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumB45"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT15"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumB45"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT20"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumB50"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT10"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumB50"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT15"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumB50"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["sumT20"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdO"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdT10"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdO"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdT15"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdO"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdT20"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdO2"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdT10"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdO2"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdT15"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdO2"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdT20"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdB40"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdT10"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdB40"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdT15"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdB40"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdT20"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdB45"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdT10"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdB45"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdT15"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdB45"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdT20"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdB50"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdT10"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdB50"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdT15"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdB50"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable>". $row["chdT20"]."</td>";
            $result .= "<td tabindex=\"0\" contenteditable></td>";
            $result .= "</tr>";
        } while ($row = mysqli_fetch_assoc($rows));
        $factors_result[] = $result;
		return true;
	} else {
        $info[] = "Совпадений не найдено";
		return false;
	}
}

function echoJSON()
{
    global $bd_e, $info, $tables_e, $factors_result;
    $arr = array(
        "bd_e" => $bd_e, "info" => $info, "tables_e" => $tables_e,
        "factors_result" => $factors_result
    );
    $output = json_encode($arr, JSON_UNESCAPED_UNICODE);
    echo $output;
}