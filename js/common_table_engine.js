let horiz_stub_up = document.querySelector(".horiz_stub_up");
let horiz_stub_bottom = document.querySelector(".horiz_stub_bottom");
let vert_stub_left = document.querySelector(".vert_stub_left");
let vert_stub_right = document.querySelector(".vert_stub_right");
let header = document.querySelector("header");
let footer = document.querySelector("footer");
let table_body = document.querySelectorAll(".table_body");
/*let td_selection = document.querySelectorAll(".td_selection");
let td_selection_frame = document.getElementsByName("td_selection_frame");
let radios = document.querySelectorAll("input[type=\"radio\"]");
let fast = document.querySelector(".fast");
let slow = document.querySelector(".slow");
let selected_tds = null;
let selected_td_i = null;
let selected_content = content[0];
let selected_content_i = 0;
let tds, ths, col_i, row_i, td_i;*/
let td_selection = document.querySelectorAll(".td_selection");
let td_selection_frame = document.getElementsByName("td_selection_frame");
let tds, ths, col_i, row_i, td_i;
let selected_td = null;
let cnt_i = 0;

function setTableEngine(content, content_i, table_body, table_header) {
    tds = table_body.querySelectorAll("td");
    ths = table_header.querySelectorAll("th");
    cnt_i = content_i;
    content.onscroll = function() {
        console.log(content.getBoundingClientRect().top);
        table_header.style.left = (-content.scrollLeft + vert_stub_left.getBoundingClientRect().width) + "px";
    }
    window.onresize = function() {
        onWindowResize(content, cnt_i, table_header);
    }
    onWindowResize(content, cnt_i, table_header);
    onTdSelect(content, table_body, tds, ths);
}

function onTdSelect(content, table_body, tds, ths) {
    table_body.onkeydown = function(e) {
        if (e.code == "Enter" || e.code == "Escape" || e.code == "NumpadEnter") {
            e.preventDefault();
            tds[td_i].blur();
            selected_td = null;
            document.getSelection().removeAllRanges();
            console.log(e.code + " " + cnt_i);
            removeCellRect(cnt_i);
        }
    }
    table_body.onclick = function(e) {
        console.log("onmouseclick ");
        if (e.target.nodeName != "TD") {
            return false;
        }
        td_i = arrayIndex(tds, e.target);
        tds[td_i].onfocus = selectOnFocus;
        selected_td = tds[td_i];
        [col_i, row_i] = getColRow(td_i, ths.length);
        drawCellRect(tds[td_i], content);
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
function drawCellRect(td, content) {
    /*console.log("draw");
    let td_top = td.getBoundingClientRect().top + content.scrollTop;
    let td_left = td.getBoundingClientRect().left + content.scrollLeft;
    td_selection[cnt_i].style.top = td_top + "px";
    td_selection[cnt_i].style.left = td_left + "px";
    addBackground();
    td_selection[cnt_i].style.width = td.getBoundingClientRect().width + "px";
    td_selection[cnt_i].style.height = td.getBoundingClientRect().height + "px";
    td_selection[cnt_i].classList.add("active");*/
}

function removeCellRect(cnt_i) {
    removeBackground();
    td_selection[cnt_i].classList.remove("active");
}

function onWindowResize(content, cnt_i, table_header) {
    /*для корректного отображения стыка заголовка и таблицы*/
    content.style.marginTop = table_header.getBoundingClientRect().height + "px";
    /*для корректного отображения выделения ячейки*/
    if (selected_td != null) {
        if (arrayIndex(tds, selected_td) != -1) {
            console.log("selected_tds");
            drawCellRect(selected_td, content);
        }
    } else {
        removeCellRect(cnt_i);
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