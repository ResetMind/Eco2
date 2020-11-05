let bd_e_preloader = document.querySelector(".bd_e_preloader");
let bd_e = document.querySelector(".settings_content .bd_e");

document.addEventListener("DOMContentLoaded", () => {
    doRequest();
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
            
        }
    }
}