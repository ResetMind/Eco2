let home = document.querySelectorAll(".home");
let radios = document.querySelectorAll(".tabs input[type=\"radio\"]");

onRadioChange();

function onRadioChange() {
    for (let i = 0; i < radios.length; i++) {
        radios[i].addEventListener("change", function() {
            home.forEach(elem => { elem.style.display = "none"; });
            home[i].style.display = "flex";
            /*removeCellRect(selected_content_i);
            setTableEngine(i);*/
        });
    }
}