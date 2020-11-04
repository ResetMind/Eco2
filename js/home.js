document.addEventListener("DOMContentLoaded", () => {
    doRequest();
});

function doRequest() {
    let xhr = request("php/home.php", null);
    xhr.onload = function() {
        if (xhr.status != 200) {
            console.log(xhr.status);
        } else {
            console.log(xhr.response);
            if (xhr.response == null) return;
            if(!checkAccessServer(xhr)) {
                window.location.href = "login.html?access=false";
            } else {
                let preloader = document.querySelector(".preloader");
                fadeOut(preloader);
            }
        }
    }
}

function checkAccessServer(xhr) {
    if (xhr.response.access_e.length > 0) {
        return false;
    }
    return true;
}