<!doctype html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Смена почты</title>
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
            session_start();
            $link = null;
            require_once __DIR__ . "/connect.php";
            if (!connect()) {
                echo ("<span class='ver_e'>Ошибка соединения с базой данных</span>");
            } else {
                if (!empty($_GET['code']) && isset($_GET['code'])) {
                    $code = $_GET['code'];
                    $sqlreq = "SELECT * FROM users WHERE code='$code' and new_email!='null'";
                    if (!$result = mysqli_query($link, $sqlreq)) {
                        echo ("<span class='ver_e'>Ошибка выполнения запроса к БД</span>");
                    } else {
                        if ($row = mysqli_fetch_assoc($result)) {
                            $new_email = $row["new_email"];
                            $sqlreq = "UPDATE users SET email='$new_email', code=null, new_email=null WHERE code='$code'";
                            if (!mysqli_query($link, $sqlreq)) {
                                echo ("<span class='ver_e'>Ошибка выполнения запроса к БД</span>");
                            } else {
                                echo ("<span>Смена почты успешна</span>");
                            }
                        } else {
                            echo ("<span>Почта уже изменена</span>");
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