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

/*email.onkeyup = checkEmail;
name.onkeyup = checkName;
password1.onkeyup = checkPassword1;
password2.onkeyup = checkPassword2;*/

reg_form.onsubmit = function(e) {
    e.preventDefault();
}

reg_button.onclick = function() {
    console.log("onclick");
    let xhr = request(reg_form.getAttribute("action"), new FormData(reg_form));
    xhr.onload = function() { xhr.status != 200 ? console.log(xhr.status) : console.log(xhr.response) };
}

email.oninput = function() {
    let xhr = request(reg_form.getAttribute("action"), new FormData(reg_form));
    xhr.onload = function() { xhr.status != 200 ? console.log(xhr.status) : checkEmail(xhr) };
}

name.oninput = function() {
    let xhr = request(reg_form.getAttribute("action"), new FormData(reg_form));
    xhr.onload = function() { xhr.status != 200 ? console.log(xhr.status) : checkName(xhr) };
}

password1.oninput = function() {
    let xhr = request(reg_form.getAttribute("action"), new FormData(reg_form));
    xhr.onload = function() { xhr.status != 200 ? console.log(xhr.status) : checkPassword1(xhr) };
}

password2.oninput = function() {
    let xhr = request(reg_form.getAttribute("action"), new FormData(reg_form));
    xhr.onload = function() { xhr.status != 200 ? console.log(xhr.status) : checkPassword2(xhr) };
}

function showError(span, input, text) {
    span.classList.add("show");
    span.classList.remove("close");
    input.classList.add("error");
    span.innerHTML = text;
}

function removeError(span, input) {
    if(span.classList.contains("show")) {
        span.classList.add("close");
    }
    span.classList.remove("show");
    input.classList.remove("error");
}

function checkEmail(xhr) {
    xhr.response.email_e.length > 0 ? showError(email_e, email, xhr.response.email_e[0]) : removeError(email_e, email);
    console.log(xhr.response.email_e);
}

function checkName(xhr) {
    xhr.response.name_e.length > 0 ? showError(name_e, name, xhr.response.name_e[0]) : removeError(name_e, name);
    console.log(xhr.response.name_e);
}

function checkPassword1(xhr) {
    xhr.response.password1_e.length > 0 ? showError(password1_e, password1, xhr.response.password1_e[0]) : removeError(password1_e, password1);
    console.log(xhr.response.password1_e);
}

function checkPassword2(xhr) {
    xhr.response.password2_e.length > 0 ? showError(password2_e, password2, xhr.response.password2_e[0]) : removeError(password2_e, password2);
    console.log(xhr.response.password2_e);
}

function disableButton(button) {

}
//reg_button.classList.add("disabled");