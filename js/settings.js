let settings_form = document.querySelector(".settings_form");
let settings_button = document.querySelector(".settings_form .settings_button");
let email = document.querySelector(".settings_form .email");
let name = document.querySelector(".settings_form .name");
let password0 = document.querySelector(".settings_form .password0");
let password1 = document.querySelector(".settings_form .password1");
let password2 = document.querySelector(".settings_form .password2");
let email_e = document.querySelector(".settings_form .email_e");
let name_e = document.querySelector(".settings_form .name_e");
let password0_e = document.querySelector(".settings_form .password0_e");
let password1_e = document.querySelector(".settings_form .password1_e");
let password2_e = document.querySelector(".settings_form .password2_e");
let bd_e = document.querySelector(".settings_form .bd_e");
let bd_e_preloader = document.querySelector(".preloader span.bd_e");
let send_email_e = document.querySelector(".settings_form .send_email_e");
let popup = document.querySelector("div.popup");
let theme_radios = document.querySelectorAll("input[type=\"radio\"].theme_rad");

doRequest();

settings_form.onsubmit = function (e) {
    e.preventDefault();
}

settings_button.onclick = function () {
    let xhr = request(settings_form.getAttribute("action"), new FormData(settings_form));
    xhr.onload = function () {
        if (xhr.status != 200) {
            console.log(xhr.status);
        } else {
            console.log(xhr.response);
            if (xhr.response == null) return;
            checkEmailServer(xhr, email, email_e);
            checkNameServer(xhr, name, name_e);
            checkPassword0Server(xhr, password0, password0_e);
            checkPassword1Server(xhr, password1, password1_e);
            checkPassword2Server(xhr, password2, password2_e);
            checkBdServer(xhr, bd_e);
            //checkEmailSendServer(xhr, send_email_e);
            let results = getResultsServer(xhr);
            if(results) {
                showPopup(popup, results, false);
            }
        }
    }
}
email.oninput = checkEmail.bind(null, email, email_e);
name.oninput = checkName.bind(null, name, name_e);
password1.oninput = checkPassword1.bind(null, password1, password1_e, password2, password2_e);
password2.oninput = checkPassword2.bind(null, password1, password2, password2_e);

function onThemeChange() {
    if(getCookie("theme") == 1) {
        theme_radios[1].checked = true;
    }
    for (let i = 0; i < theme_radios.length; i++) {
        theme_radios[i].onchange = function() {
            setTheme(i);
        };
    }
}

function doRequest() {
    let xhr = request("php/settings.php", null);
    xhr.onload = function () {
        if (xhr.status != 200) {
            console.log(xhr.status);
        } else {
            console.log(xhr.response);
            if (xhr.response == null) return;
            if (!checkBdServer(xhr, bd_e_preloader)) {
                return;
            }
            if (!checkAccessServer(xhr)) {
                window.location.href = "login.html?access=false";
                return;
            } else {
                fadeOut(document.querySelector(".preloader"));
            }
            if (xhr.response.email != null) {
                email.value = xhr.response.email;
            }
            if (xhr.response.name != null) {
                name.value = xhr.response.name;
            }
            onThemeChange();
        }
    }
}