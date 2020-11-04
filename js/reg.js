let reg_form = document.querySelector(".registration_form");
let email = document.querySelector(".registration_form .email");
let name = document.querySelector(".registration_form .name");
let password1 = document.querySelector(".registration_form .password1");
let password2 = document.querySelector(".registration_form .password2");
let reg_button = document.querySelector(".registration_form .reg_button");
let email_e = document.querySelector(".registration_form .email_e");
let name_e = document.querySelector(".registration_form .name_e");
let password1_e = document.querySelector(".registration_form .password1_e");
let password2_e = document.querySelector(".registration_form .password2_e");
let bd_e = document.querySelector(".registration_content .bd_e");

document.addEventListener("DOMContentLoaded", () => {
    reg_form.onsubmit = function(e) {
        e.preventDefault();
    }

    reg_button.onclick = function() {
        let xhr = request(reg_form.getAttribute("action"), new FormData(reg_form));
        xhr.onload = function() {
            if (xhr.status != 200) {
                console.log(xhr.status);
            } else {
                console.log(xhr.response);
                if (xhr.response == null) return;
                let res1 = checkEmailServer(xhr);
                let res2 = checkNameServer(xhr);
                let res3 = checkPassword1Server(xhr);
                let res4 = checkPassword2Server(xhr);
                let res5 = checkBdServer(xhr);
                let res6 = checkEmailSendServer(xhr);
                if (res1 && res2 && res3 && res4 && res5 && res6) {
                    window.location.href = "login.html?verification=true&email=" + email.value;
                }
            }
        }
    }

    email.oninput = checkEmail;
    name.oninput = checkName;
    password1.oninput = checkPassword1;
    password2.oninput = checkPassword2;
    let preloader = document.querySelector(".preloader");
    fadeOut(preloader);
});

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

function checkEmailSendServer(xhr) {
    if (xhr.response.send_email_e.length > 0) {
        showError(bd_e, null, xhr.response.send_email_e[0]);
        return false;
    } else {
        removeError(bd_e, null);
        return true;
    }
}

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
    } else if (email.value.indexOf("@") == -1) {
        showError(email_e, email, "В email должен быть символ @");
    } else if (email.value[email.value.length - 1] == "@" && email.value.split("@").length <= 2) {
        showError(email_e, email, "В email должны быть символы после @");
    } else if (email.value.split("@").length > 2) {
        showError(email_e, email, "Часть email после @ не может содержать @");
    } else {
        removeError(email_e, email);
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

function checkName() {
    if (name.value.length < 2 || name.value.length > 50) {
        showError(name_e, name, "Недопустимая длина имени (2-50 символов)");
    } else {
        removeError(name_e, name);
    }
}

function checkNameServer(xhr) {
    if (xhr.response.name_e.length > 0) {
        showError(name_e, name, xhr.response.name_e[0]);
        return false;
    } else {
        removeError(name_e, name);
        return true;
    }
}

function checkPassword1() {
    if (password1.value.length < 4 || password1.value.length > 12) {
        showError(password1_e, password1, "Недопустимая длина пароля (4-12 символов)");
    } else {
        removeError(password1_e, password1);
    }
    checkPassword2();
}

function checkPassword1Server(xhr) {
    if (xhr.response.password1_e.length > 0) {
        showError(password1_e, password1, xhr.response.password1_e[0]);
        return false;
    } else {
        removeError(password1_e, password1);
        return true;
    }
}

function checkPassword2() {
    if (password1.value != password2.value) {
        showError(password2_e, password2, "Пароли не совпадают");
    } else {
        removeError(password2_e, password2);
    }
}

function checkPassword2Server(xhr) {
    if (xhr.response.password2_e.length > 0) {
        showError(password2_e, password2, xhr.response.password2_e[0]);
        return false;
    } else {
        removeError(password2_e, password2);
        return true;
    }
}