<?
top("Вход - Экопрогноз");
?>
<div class="guest_container">
    <h3>Вход</h3>
    <form name="signin">
        <p><input type="email" name="email" placeholder="Электронная почта"></p>
        <p><input type="password" name="password1" placeholder="Пароль"></p>
        <p><input type="password" name="password2" placeholder="Повторите пароль"></p>
        <p><button onclick="sign_in()">Войти</button></p>
        <p>Забыли пароль? <a href="">Восстановите его</a></p>
    </form>
</div>
<?
bottom();
?>