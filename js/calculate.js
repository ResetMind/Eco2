let bd_e_preloader = document.querySelector(".bd_e_preloader");
let content = document.querySelectorAll(".content");
let radios = document.querySelectorAll("input[type=\"radio\"]");

document.addEventListener("DOMContentLoaded", () => {
    search.year1.onkeyup = find;
    search.year2.onkeyup = find;
    search.culture.onkeyup = find;
    search.field.onkeyup = find;
    search.calculate.onkeyup = find;
    content[0].style.display = "flex";
    setTableEngine(content[0].querySelector(".body_content"), 0, content[0].querySelector(".table_body"), content[0].querySelector(".table_header"));
    onRadioChange();
    doRequest();
});

function doRequest() {
    let xhr = request("php/calculate.php", null);
    xhr.onload = function() {
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

        }
    }
}

function find() {
    let xhr = request("php/find.php", null);
    xhr.onload = function() {
        if (xhr.status != 200) {
            console.log(xhr.status);
        } else {
            console.log(xhr.response);
            if (xhr.response == null) return;
            

        }
    }
}

function onRadioChange() {
    for (let i = 0; i < radios.length; i++) {
        console.log(i);
        radios[i].addEventListener("change", function() {
            content.forEach(elem => { elem.style.display = "none"; });
            content[i].style.display = "flex";
            //removeCellRect(selected_content_i);
            //setTableEngine(i);
        });
    }
}