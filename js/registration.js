let reg_form = document.querySelector(".registration_form");
let reg_button = document.querySelector(".registration_form .reg_button");
let email = document.querySelector(".registration_form .email");
let name = document.querySelector(".registration_form .name");
let password1 = document.querySelector(".registration_form .password1");
let password2 = document.querySelector(".registration_form .password2");
let email_e = document.querySelector(".registration_form .email_e");
let name_e = document.querySelector(".registration_form .name_e");
let password1_e = document.querySelector(".registration_form .password1_e");
let password2_e = document.querySelector(".registration_form .password2_e");
let bd_e = document.querySelector(".registration_content .bd_e");
let send_email_e = document.querySelector(".registration_content .send_email_e");

reg_form.onsubmit = function (e) {
    e.preventDefault();
}
reg_button.onclick = function () {
    let xhr = request(reg_form.getAttribute("action"), new FormData(reg_form));
    xhr.onload = function () {
        if (xhr.status != 200) {
            console.log(xhr.status);
        } else {
            console.log(xhr.response);
            if (xhr.response == null) return;
            let res1 = checkEmailServer(xhr, email, email_e);
            let res2 = checkNameServer(xhr, name, name_e);
            let res3 = checkPassword1Server(xhr, password1, password1_e);
            let res4 = checkPassword2Server(xhr, password2, password2_e);
            let res5 = checkBdServer(xhr, bd_e);
            //let res6 = checkEmailSendServer(xhr, send_email_e);
            if (res1 && res2 && res3 && res4 && res5) {
                window.location.href = "login.html?verification=true&email=" + email.value;
            }
        }
    }
}
email.oninput = checkEmail.bind(null, email, email_e);
name.oninput = checkName.bind(null, name, name_e);
password1.oninput = checkPassword1.bind(null, password1, password1_e, password2, password2_e);
password2.oninput = checkPassword2.bind(null, password1, password2, password2_e);
fadeOut(document.querySelector(".preloader"));