let wrapper = document.querySelectorAll(".wrapper");
let radios = document.querySelectorAll(".tabs input[type=\"radio\"]");
let table = document.querySelectorAll("div.table");

setTableEngine(table[0]);
onRadioChange();

function onRadioChange() {
    for (let i = 0; i < radios.length; i++) {
        radios[i].addEventListener("change", function() {
            wrapper.forEach(elem => { elem.style.display = "none"; });
            wrapper[i].style.display = "flex";
            /*removeCellRect(selected_content_i);
            setTableEngine(i);*/
        });
    }
}