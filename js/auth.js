let reg_form = document.querySelector("#registration_form");
let email = document.querySelector("#registration_form #email");
let name = document.querySelector("#registration_form #name");
let password1 = document.querySelector("#registration_form #password1");
let password2 = document.querySelector("#registration_form #password2");
let reg_button = document.querySelector("#registration_form #reg_button");

email.onkeyup = checkEmail;
name.onkeyup = checkName;
password1.onkeyup = checkPassword1;
password2.onkeyup = checkPassword2;

reg_form.onsubmit = function(e) {
    e.preventDefault();
    let form_data = new FormData(reg_form);
    request(reg_form.getAttribute("action"), form_data);
}

function checkEmail() {
    if((email.value + "").indexOf("@") == -1) {
        email.classList.add("error");
    } else {
        email.classList.remove("error");
    }
}

function checkName() {
    if((name.value + "").length < 1 || (name.value + "").length > 50) {
        name.classList.add("error");
    } else {
        name.classList.remove("error");
    }
}

function checkPassword1() {
    if((password1.value + "").length < 4 || (password1.value + "").length > 12) {
        password1.classList.add("error");
    } else {
        password1.classList.remove("error");
    }
}

function checkPassword2() {
    if(password1.value != password2.value) {
        password2.classList.add("error");
    } else {
        password2.classList.remove("error");
    }
}

function disableButton(button) {

}
//reg_button.classList.add("disabled");