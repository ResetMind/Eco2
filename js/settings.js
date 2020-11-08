let bd_e_preloader = document.querySelector(".bd_e_preloader");
let bd_e = document.querySelector(".settings_content .bd_e");
let set_button = document.querySelector(".set_button");
let bd_form = document.querySelector(".bd_form");
let name = document.querySelector(".name");
let name_e = document.querySelector(".name_e");
let email = document.querySelector(".email");
let email_e = document.querySelector(".email_e");
let password0 = document.querySelector(".password0");
let password0_e = document.querySelector(".password0_e");
let password1 = document.querySelector(".password1");
let password1_e = document.querySelector(".password1_e");
let password2 = document.querySelector(".password2");
let password2_e = document.querySelector(".password2_e");

document.addEventListener("DOMContentLoaded", () => {
    doRequest();
    bd_form.onsubmit = function(e) {
        e.preventDefault();
    }
    set_button.onclick = saveChanges;
    email.oninput = checkEmail.bind(null, email, email_e);
    name.oninput = checkName.bind(null, name, name_e);
    password1.oninput = checkPassword1.bind(null, password1, password1_e, password2, password2_e);
    password2.oninput = checkPassword2.bind(null, password1, password2, password2_e);
});

function doRequest() {
    let xhr = request("php/settings.php", null);
    xhr.onload = function() {
        if (xhr.status != 200) {
            console.log(xhr.status);
        } else {
            console.log(xhr.response);
            if (xhr.response == null) return;
            if(!checkBdServer(xhr, bd_e_preloader)) {
                return;
            }
            if(!checkAccessServer(xhr)) {
                window.location.href = "login.html?access=false";
                return;
            } else {
                fadeOut(document.querySelector(".preloader"));
            }
            if(xhr.response.email != null) {
                email.value = xhr.response.email;
            }
            if(xhr.response.name != null) {
                name.value = xhr.response.name;
            }
        }
    }
}

function saveChanges() {
    let xhr = request("php/change_user_data.php", new FormData(bd_form));
    xhr.onload = function() {
        if (xhr.status != 200) {
            console.log(xhr.status);
        } else {
            console.log(xhr.response);
            if (xhr.response == null) return;
            let res1 = checkEmailServer(xhr, email, email_e);
            let res2 = checkNameServer(xhr, name, name_e);
            let res3 = checkPassword0Server(xhr, password0, password0_e);
            let res4 = checkPassword1Server(xhr, password1, password1_e);
            let res5 = checkPassword2Server(xhr, password2, password2_e);
            let res6 = checkBdServer(xhr, bd_e);
            if (res1 && res2 && res3 && res4 && res5 && res6) {
                
            }
        }
    }
}