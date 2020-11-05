let login_form = document.querySelector(".login_form");
let log_button = document.querySelector(".login_form .log_button");
let email = document.querySelector(".login_form .email");
let password = document.querySelector(".login_form .password");
let email_e = document.querySelector(".login_form .email_e");
let password_e = document.querySelector(".login_form .password_e");
let bd_e = document.querySelector(".login_form .bd_e");
let ver_span = document.querySelector(".login_content .ver_span");
let access_span = document.querySelector(".login_content .access_span");

document.addEventListener("DOMContentLoaded", () => {
    if ($_GET("verification") == "true") {
        ver_span.classList.add("active");
    }
    if ($_GET("email") != false) {
        email.value = $_GET("email");
    }
    if($_GET("access") == "false") {
        access_span.classList.add("active");
    }
    login_form.onsubmit = function(e) {
        e.preventDefault();
    }
    log_button.onclick = function() {
        let res1 = checkEmail(email, email_e);
        let res2 = checkPassword0(password, password_e);
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
                res1 = checkEmailServer(xhr, email, email_e);
                res2 = checkPassword0Server(xhr, password, password_e);
                let res3 = checkBdServer(xhr, bd_e);
                if (res1 && res2 && res3) {
                    window.location.href = "home.html";
                }
            }
        }
    }
    email.oninput = checkEmail.bind(null, email, email_e);
    password.oninput = checkPassword0.bind(null, password, password_e);
    fadeOut(document.querySelector(".preloader"));
});

function $_GET(key) {
    let p = window.location.search;
    p = p.match(new RegExp(key + '=([^&=]+)'));
    return p ? p[1] : false;
}