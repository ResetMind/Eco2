<!doctype html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Сброс пароля</title>
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
                    $sqlreq = "SELECT * FROM users WHERE code='$code'";
                    if (!$result = mysqli_query($link, $sqlreq)) {
                        echo ("<span class='ver_e'>Ошибка выполнения запроса к БД</span>");
                    } else {
                        if ($row = mysqli_fetch_assoc($result)) {
                            $new_password = $row["new_password"];
                            if ($new_password != null) {
                                $sqlreq = "UPDATE users SET password='$new_password', code=null, new_password=null WHERE code='$code'";
                                if (!mysqli_query($link, $sqlreq)) {
                                    echo ("<span class='ver_e'>Ошибка выполнения запроса к БД</span>");
                                } else {
                                    echo ("<span>Активация нового пароля успешна</span>");
                                }
                            } else {
                                echo ("<span>Новый пароль уже активирован</span>");
                            }
                        } else {
                            echo ("<span>Новый пароль уже активирован</span>");
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