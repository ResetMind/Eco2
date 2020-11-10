content = null;
table_body = null;
table_header = null;
let td_selection = document.querySelectorAll(".td_selection");
let td_selection_frame = document.getElementsByName("td_selection_frame");
let tds, ths, col_i, row_i, td_i;
let selected_td = null;
let content_i = 0;

function setTableEngine(cnt, cnt_i, tbl_b, tbl_h) {
    content = cnt;
    content_i = cnt_i;
    table_body = tbl_b;
    table_header = tbl_h;
    tds = table_body.querySelectorAll("td");
    ths = table_header.querySelectorAll("th");
    content.onscroll = function() {
        table_header.style.left = -content.scrollLeft + "px";
    }
    window.onresize = function() {
        onWindowResize();
    }
    onTdSelect();
}

function onTdSelect() {
    table_body.onkeydown = function(e) {
        if (e.code == "Enter" || e.code == "Escape" || e.code == "NumpadEnter") {
            e.preventDefault();
            tds[td_i].blur();
            selected_td = null;
            document.getSelection().removeAllRanges();
            console.log(e.code + " " + content_i);
            removeCellRect();
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
        drawCellRect(tds[td_i]);
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
function drawCellRect(td) {
    let td_top = (td.getBoundingClientRect().top - table_body.getBoundingClientRect().top);
    let td_left = (td.getBoundingClientRect().left - table_body.getBoundingClientRect().left);
    console.log("draw " + td_top + " " + td_left);
    td_selection[content_i].style.top = td_top + "px";
    td_selection[content_i].style.left = td_left + "px";
    addBackground();
    td_selection[content_i].style.width = td.getBoundingClientRect().width + "px";
    td_selection[content_i].style.height = td.getBoundingClientRect().height + "px";
    td_selection[content_i].classList.add("active");
}

function removeCellRect() {
    removeBackground();
    td_selection[content_i].classList.remove("active");
}

function onWindowResize() {
    if (selected_td != null) {
        if (arrayIndex(tds, selected_td) != -1) {
            console.log("selected_tds");
            drawCellRect(selected_td, content, table_body);
        }
    } else {
        removeCellRect(content_i);
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