let login_form = document.querySelector(".login_form");
let log_button = document.querySelector(".login_form .log_button");
let email = document.querySelector(".login_form .email");
let password = document.querySelector(".login_form .password");
let email_e = document.querySelector(".login_form .email_e");
let password_e = document.querySelector(".login_form .password_e");
let bd_e = document.querySelector(".login_form .bd_e");
let ver_span = document.querySelector(".login_content .ver_span");

document.addEventListener("DOMContentLoaded", () => {
    /*if ($_GET("verification") == "true") {
        ver_span.classList.add("active");
    }
    if ($_GET("email") != false) {
        email.value = $_GET("email");
    }*/
    login_form.onsubmit = function(e) {
        e.preventDefault();
    }
    log_button.onclick = function() {
        ver_span.classList.add("active");
        /*let res1 = checkEmail();
        let res2 = checkPassword();
        if (!res1 || !res2) {
            return;
        }
        let xhr = request(login_form.getAttribute("action"), new FormData(login_form));
        xhr.onload = function() {
            if (xhr.status != 200) {
                console.log(xhr.status);
            } else {
                console.log(xhr.response);
                if (xhr.response == null) return;
                res1 = checkEmailServer(xhr);
                res2 = checkPasswordServer(xhr);
                let res3 = checkBdServer(xhr);
                if (res1 && res2 && res3) {
                    window.location.href = "home.html";
                }
            }
        }*/
    }

    email.oninput = checkEmail;
    password.oninput = checkPassword;
});

function checkBdServer(xhr) {
    if (xhr.response.bd_e.length > 0) {
        showError(bd_e, null, xhr.response.bd_e[0]);
        return false;
    } else {
        removeError(bd_e, null);
        return true;
    }
}

function checkEmail() {
    if (email.value[0] == "@") {
        showError(email_e, email, "Email не может начинаться с символа @");
        return false;
    } else if (email.value.indexOf("@") == -1) {
        showError(email_e, email, "В email должен быть символ @");
        return false;
    } else if (email.value[email.value.length - 1] == "@" && email.value.split("@").length <= 2) {
        showError(email_e, email, "В email должны быть символы после @");
        return false;
    } else if (email.value.split("@").length > 2) {
        showError(email_e, email, "Часть email после @ не может содержать @");
        return false;
    } else {
        removeError(email_e, email);
        return true;
    }
}

function checkEmailServer(xhr) {
    if (xhr.response.email_e.length > 0) {
        showError(email_e, email, xhr.response.email_e[0]);
        return false;
    } else {
        removeError(email_e, email);
        return true;
    }
}

function checkPassword() {
    if (password.value.length < 1) {
        showError(password_e, password, "Недопустимая длина пароля");
        return false;
    } else {
        removeError(password_e, password);
        return true;
    }
}

function checkPasswordServer(xhr) {
    if (xhr.response.password_e.length > 0) {
        showError(password_e, password, xhr.response.password_e[0]);
        return false;
    } else {
        removeError(password_e, password);
        return true;
    }
}

function showError(span, input, text) {
    span.classList.add("show");
    span.classList.remove("close");
    if (input != null) {
        input.classList.add("error");
    }
    span.innerHTML = text;
}

function removeError(span, input) {
    if (span.classList.contains("show")) {
        span.classList.add("close");
    }
    span.classList.remove("show");
    if (input != null) {
        input.classList.remove("error");
    }
}

function $_GET(key) {
    var p = window.location.search;
    p = p.match(new RegExp(key + '=([^&=]+)'));
    return p ? p[1] : false;
}