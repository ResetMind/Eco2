<?
if($_SERVER["REQUEST_URI"] == "/ecoprognoz.com/") {
    $page = "start";
} else {
    $page = substr($_SERVER["REQUEST_URI"], 16);
}
echo $page . "<br>";

session_start();

if(file_exists("auth/" . $page . ".php")) include "auth/" . $page . ".php";
else if(file_exists("guest/" . $page . ".php")) include "guest/" . $page . ".php";
else exit ("404");
?>