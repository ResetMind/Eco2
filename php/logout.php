<?php
session_start();
$_SESSION = [];
setcookie("token", "", time() - 3600);
header("HTTP/1.1 301 Moved Permanently");
header("Location: ../login.html");