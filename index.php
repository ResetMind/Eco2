<?
if($_SERVER["REQUEST_URI"] == "/ecoprognoz.com/") {
    $page = "start";
} else {
    $page = substr($_SERVER["REQUEST_URI"], 16);
}

session_start();

if(file_exists("auth/" . $page . ".php")) include "auth/" . $page . ".php";
else if(file_exists("guest/" . $page . ".php")) include "guest/" . $page . ".php";
else exit ("404");

function top($title) {
    echo '<!doctype html>
    <html lang="ru">
    
    <head>
        <meta charset="utf-8" />
        <title>' . $title . '</title>
        <link rel="stylesheet" href="styles.css"/>
        <script src="guest/guest_script.js"></script>
    </head>
    
    <header>
        <span>Экопрогноз</span>
    </header>
    <body>';
}

function bottom() {
    echo '</body>
    <footer>
    sdfsdf
    </footer>
    </html>';
}
?>