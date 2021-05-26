<!doctype html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Подтверждение почты</title>
    <link rel="stylesheet" href="../css/light_theme.css" />
    <link rel="stylesheet" href="../css/common_styles.css" />
    <link rel="stylesheet" href="../css/auth_styles.css" />
</head>

<body>
    <div class="container">
        <header>
            <ul class="navigation">
                <li><a href="../login.html">Вход</a>
            </ul>
            <span class="app_name">Экопрогноз</span>
        </header>
        <div class="wrapper">
            <div></div>
            <div class="auth_content">
            <span>Активация успешна</span>
                <!--<?php
                $link = null;
                require_once __DIR__ . "/connect.php";
                if (!connect()) {
                    echo ("<span class='ver_error'>Ошибка соединения с базой данных</span>");
                } else {
                    if (!empty($_GET['code']) && isset($_GET['code'])) {
                        $code = $_GET['code'];
                        $sqlreq = "SELECT id FROM users WHERE code='$code' and status='0'";
                        if (!$result = mysqli_query($link, $sqlreq)) {
                            echo ("<span class='ver_error'>Ошибка выполнения запроса к БД</span>");
                        } else {
                            if (mysqli_num_rows($result) == 1) {
                                $sqlreq = "UPDATE users SET status='1', code=null WHERE code='$code'";
                                if (!mysqli_query($link, $sqlreq)) {
                                    echo ("<span class='ver_error'>Ошибка выполнения запроса к БД</span>");
                                } else {
                                    echo ("<span>Активация успешна</span>");
                                }
                            } else {
                                echo ("<span>Ваш аккаунт уже активирован</span>");
                            }
                        }
                    } else {
                        echo ("<span class='ver_error'>Пустой запрос</span>");
                    }
                }
                ?>-->
            </div>
            <div></div>
        </div>
    </div>
</body>

</html>