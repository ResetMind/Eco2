let horiz_stub_up = document.querySelector(".horiz_stub_up");
let vert_stub_left = document.querySelector(".vert_stub_left");
let header = document.querySelector("header");
let footer = document.querySelector("footer");
let table_header = document.querySelectorAll(".table_header");
let table_body = document.querySelectorAll(".table_body");
let content = document.querySelectorAll(".content");
let tds_selection = document.querySelector(".tds_selection");

setHeaderMargin();
setTableEngine(0);

function setTableEngine(n) {
    let tds = table_body[n].querySelectorAll("td");
    let ths = table_header[n].querySelectorAll("th");
    /*перемещение фиксированной шапки вместе со скроллом таблицы*/
    content[n].onscroll = function() {
        table_header[n].style.left = (-content[n].scrollLeft + vert_stub_left.getBoundingClientRect().width) + "px";
    }
    onTdSelect(tds, ths);
}

function onTdSelect(tds, ths) {
    for(let i = 0; i < tds.length; i++) {
        tds[i].onclick = function() {
            let col_i = i % ths.length; /*узнать в какой колонке ячейка*/
            let row_i = Math.floor(i / ths.length); /*узнать в какой строке ячейка*/
            console.log(row_i + " " + col_i);
            console.log(tds[i].getBoundingClientRect().top + " " + tds[i].getBoundingClientRect().left);
            tds_selection.style.top = tds[i].getBoundingClientRect().top + "px";
            tds_selection.style.left = tds[i].getBoundingClientRect().left + "px";
            tds_selection.style.width = tds[i].getBoundingClientRect().width + "px";
            tds_selection.style.height = tds[i].getBoundingClientRect().height + "px";
            tds_selection.classList.add("active");
        }
    }
}

/*для корректного отображения стыка заголовка и таблицы при изменении масштаба*/
window.onresize = setHeaderMargin;
function setHeaderMargin() {
    for(let i = 0; i < content.length; i++) {
        content[i].style.top = table_header[i].getBoundingClientRect().height + header.getBoundingClientRect().height + horiz_stub_up.getBoundingClientRect().height + "px";
        console.log("res " + i);
    }
}