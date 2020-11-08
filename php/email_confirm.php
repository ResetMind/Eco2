<!doctype html>
<html lang="ru">

<head>
    <meta charset="utf-8" />
    <title>Подтверждение почты</title>
    <link rel="stylesheet" href="../css/styles.css" />
    <link rel="stylesheet" href="../css/styles_auth.css" />
</head>

<header>
    <a href="../login.html">Вход</a>
    <span>Экопрогноз</span>
</header>

<body>
    <div class="verification">
        <div class="verification_content">
            <?php
            $link = null;
            require_once __DIR__ . "/connect.php";
            if (!connect()) {
                echo ("<span class='ver_e'>Ошибка соединения с базой данных</span>");
            } else {
                if (!empty($_GET['code']) && isset($_GET['code'])) {
                    $code = $_GET['code'];
                    $sqlreq = "SELECT id FROM users WHERE code='$code' and status='0'";
                    if (!$result = mysqli_query($link, $sqlreq)) {
                        echo ("<span class='ver_e'>Ошибка выполнения запроса к БД</span>");
                    } else {
                        if (mysqli_num_rows($result) == 1) {
                            $sqlreq = "UPDATE users SET status='1', code=null WHERE code='$code'";
                            if (!mysqli_query($link, $sqlreq)) {
                                echo ("<span class='ver_e'>Ошибка выполнения запроса к БД</span>");
                            } else {
                                echo ("<span>Активация успешна</span>");
                            }
                        } else {
                            echo ("<span>Ваш аккаунт уже активирован</span>");
                        }
                    }
                } else {
                    echo ("<span class='ver_e'>Пустой запрос</span>");
                }
            }
            ?>
        </div>
    </div>
</body>

</html>