let horiz_stub_up = document.querySelector(".horiz_stub_up");
let horiz_stub_bottom = document.querySelector(".horiz_stub_bottom");
let vert_stub_left = document.querySelector(".vert_stub_left");
let vert_stub_right = document.querySelector(".vert_stub_right");
let header = document.querySelector("header");
let footer = document.querySelector("footer");
let table_header = document.querySelectorAll(".table_header");
table_header[0].style.visibility = "visible";
let table_body = document.querySelectorAll(".table_body");
let content = document.querySelectorAll(".content");
content[0].style.display = "block";
let td_selection = document.querySelectorAll(".td_selection");
let td_selection_frame = document.getElementsByName("td_selection_frame");
let radios = document.querySelectorAll("input[type=\"radio\"]");
let fast = document.querySelector(".fast");
let slow = document.querySelector(".slow");
let selected_tds = null;
let selected_td_i = null;
let selected_content = content[0];
let selected_content_i = 0;
let tds, ths, col_i, row_i, td_i;

window.onload = function() {
    onRadioChange();
    setTableEngine(0);
}

function setTableEngine(n) {
    tds = table_body[n].querySelectorAll("td");
    ths = table_header[n].querySelectorAll("th");
    /*перемещение фиксированной шапки вместе со скроллом таблицы*/
    content[n].onscroll = function() {
        table_header[n].style.left = (-content[n].scrollLeft + vert_stub_left.getBoundingClientRect().width) + "px";
    }
    window.onresize = function() {
        onWindowResize(n);
    }
    onWindowResize(n);
    onTdSelect(tds, ths, n);
}

function onTdSelect(tds, ths, cnt_i) {
    table_body[cnt_i].onkeydown = function(e) {
        if (e.code == "Tab") {
            if (document.activeElement.nextElementSibling != null) {
                if (document.activeElement.nextElementSibling.nodeName == "TD") {
                    td_i = arrayIndex(tds, document.activeElement.nextElementSibling);
                    tds[td_i].onfocus = selectOnFocus;
                    selected_tds = [[tds[td_i]]];
                    getFirstCellParameters(td_i);
                    drawCellRect(tds[td_i], tds[td_i], cnt_i);
                }
            }
        }
        if (e.code == "Enter" || e.code == "Escape" || e.code == "NumpadEnter") {
            e.preventDefault();
            if (selected_tds != null) {
                tds[td_i].blur();
                selected_tds = null;
                document.getSelection().removeAllRanges();
            }
            console.log(e.code + " " + cnt_i);
            removeCellRect(cnt_i);
        }
    }
    table_body[cnt_i].onclick = function(e) {
        console.log("onmouseclick ");
        if (e.target.nodeName != "TD") {
            return false;
        }
        td_i = arrayIndex(tds, e.target);
        selected_tds = [[tds[td_i]]];
        tds[td_i].onfocus = selectOnFocus;
        getFirstCellParameters(td_i);
        drawCellRect(tds[td_i], tds[td_i], cnt_i);
    }

    function getFirstCellParameters(td_i) {
        selected_content = content[cnt_i];
        selected_content_i = cnt_i;
        [col_i, row_i] = getColRow(td_i, ths.length); /*узнать в какой колонке/line ячейка*/
    }

    function selectOnFocus() {
        console.log("tds[td_i].onfocus " + tds[td_i].innerHTML);
        let range = new Range();
        range.selectNodeContents(tds[td_i]);
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(range);
        tds[td_i].onfocus = null;
    }
}

function addBackground() {
    removeBackground();
    tds[td_i].classList.add("selected");
    ths[col_i].classList.add("selected");
}

function removeBackground() {
    for (let k = 0; k < tds.length; k++) {
        tds[k].classList.remove("selected");
    }
    for (let k = 0; k < ths.length; k++) {
        ths[k].classList.remove("selected");
    }
}

/*рисование обводки ячейки*/
function drawCellRect(td_start, td_end, cnt_i) {
    console.log("draw");
    let td_start_top = td_start.getBoundingClientRect().top + content[cnt_i].scrollTop - table_header[0].getBoundingClientRect().height - header.getBoundingClientRect().height - horiz_stub_up.getBoundingClientRect().height;
    let td_start_left = td_start.getBoundingClientRect().left + content[cnt_i].scrollLeft - vert_stub_left.getBoundingClientRect().width;
    td_selection[cnt_i].style.top = td_start_top + "px";
    td_selection[cnt_i].style.left = td_start_left + "px";
    let td_end_top = td_end.getBoundingClientRect().top + content[cnt_i].scrollTop - table_header[0].getBoundingClientRect().height - header.getBoundingClientRect().height - horiz_stub_up.getBoundingClientRect().height;
    let td_end_left = td_end.getBoundingClientRect().left + content[cnt_i].scrollLeft - vert_stub_left.getBoundingClientRect().width;
    addBackground();
    td_selection[cnt_i].style.width = td_end.getBoundingClientRect().width + Math.abs(td_start_left - td_end_left) + "px";
    td_selection[cnt_i].style.height = td_end.getBoundingClientRect().height + Math.abs(td_start_top - td_end_top) + "px";
    td_selection[cnt_i].classList.add("active");
}

function removeCellRect(cnt_i) {
    removeBackground();
    td_selection[cnt_i].classList.remove("active");
}

function onWindowResize(n) {
    /*для корректного отображения стыка заголовка и таблицы*/
    content[n].style.top = table_header[n].getBoundingClientRect().height + header.getBoundingClientRect().height + horiz_stub_up.getBoundingClientRect().height + "px";
    /*для корректного отображения выделения ячейки*/
    if (selected_tds != null) {
        if (arrayIndex(tds, selected_tds[0][0]) != -1) {
            console.log("selected_tds");
            drawCellRect(selected_tds[0][0], selected_tds[selected_tds.length - 1][selected_tds[selected_tds.length - 1].length - 1], selected_content_i);
        }
    } else {
        removeCellRect(n);
    }
}

function onRadioChange() {
    for (let i = 0; i < radios.length; i++) {
        console.log(i);
        radios[i].addEventListener("change", function() {
            content.forEach(elem => { elem.style.display = "none"; });
            content[i].style.display = "block";
            table_header.forEach(elem => { elem.style.visibility = "hidden"; });
            table_header[i].style.visibility = "visible";
            removeCellRect(selected_content_i);
            setTableEngine(i);
        });
    }
}

function arrayIndex(arr, el) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == el) {
            return i;
        }
    }
    return -1;
}

function getColRow(i, ths_lenght) {
    return [i % ths_lenght, Math.floor(i / ths_lenght)];
}