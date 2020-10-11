let horiz_stub_up = document.querySelector(".horiz_stub_up");
let horiz_stub_bottom = document.querySelector(".horiz_stub_bottom");
let vert_stub_left = document.querySelector(".vert_stub_left");
let vert_stub_right = document.querySelector(".vert_stub_right");
let header = document.querySelector("header");
let footer = document.querySelector(".footer");
let table_header = document.querySelectorAll(".table_header");
let table_body = document.querySelectorAll(".table_body");
let content = document.querySelectorAll(".content");
let td_selection = document.querySelector(".td_selection");
let selected_td = null;
let selected_tds = null;
let selected_content = content[0];
let selected_content_i = 0;

onResize();
setTableEngine(0);

function setTableEngine(n) {
    let tds = table_body[n].querySelectorAll("td");
    let ths = table_header[n].querySelectorAll("th");
    /*перемещение фиксированной шапки вместе со скроллом таблицы*/
    content[n].onscroll = function() {
        table_header[n].style.left = (-content[n].scrollLeft + vert_stub_left.getBoundingClientRect().width) + "px";
    }
    onTdSelect(tds, ths, n);
}

function onTdSelect(tds, ths, cnt_i) {
    let first_col_i, first_row_i, second_col_i, second_row_i, min_col, min_row, start_cell_i;
    for (let i = 0; i < tds.length; i++) {
        tds[i].onclick = function() {
            getParameters(i);
            drawCellRect(tds[i], tds[i], content[cnt_i]);
        }
        tds[i].onmousedown = function(e) {
            getParameters(i);
            drawCellRect(tds[i], tds[i], content[cnt_i]);
            let scroll_interval = null;
            let last_target = null;
            let directions = {
                rs: false, //right slow
                rf: false, //right fast
                bs: false, //bottom slow
                bf: false, //bottom fast
                ls: false, //left slow
                lf: false, //left fast
                us: false, //up slow
                uf: false //up fast
            };
            /*скролл таблицы, когда драгаешь ячейку*/
            document.onmousemove = function(e) {
                let directions_clone = {};
                for (let key in directions) {
                    directions_clone[key] = directions[key];
                }
                directions = { rs: false, rf: false, bs: false, bf: false, ls: false, lf: false, us: false, uf: false };
                e.preventDefault();
                let scroll_width = selected_content.offsetWidth - selected_content.clientWidth > 0 ? selected_content.offsetWidth - selected_content.clientWidth : 10;
                let scroll_height = selected_content.offsetHeight - selected_content.clientHeight > 0 ? selected_content.offsetHeight - selected_content.clientHeight : 10;
                let right_pos_slow = document.documentElement.clientWidth - scroll_width - vert_stub_right.getBoundingClientRect().width;
                let right_pos_fast = document.documentElement.clientWidth - vert_stub_right.getBoundingClientRect().width;
                let left_pos_slow = scroll_width + vert_stub_right.getBoundingClientRect().width;
                let left_pos_fast = vert_stub_right.getBoundingClientRect().width;
                let up_pos_slow = header.getBoundingClientRect().height + horiz_stub_up.getBoundingClientRect().height + table_header[cnt_i].getBoundingClientRect().height;
                let up_pos_fast = header.getBoundingClientRect().height + horiz_stub_up.getBoundingClientRect().height;
                footer = document.querySelector("footer");
                let bottom_pos_slow = document.documentElement.clientHeight - footer.getBoundingClientRect().height - horiz_stub_bottom.getBoundingClientRect().height - scroll_height;
                let bottom_pos_fast = document.documentElement.clientHeight - footer.getBoundingClientRect().height;
                // right
                if (e.clientX >= right_pos_slow && e.clientX < right_pos_fast) {
                    directions.rs = true;
                }
                if (e.clientX >= right_pos_fast) {
                    directions.rf = true;
                }
                // bottom
                if (e.clientY >= bottom_pos_slow && e.clientY < bottom_pos_fast) {
                    directions.bs = true;
                }
                if (e.clientY >= bottom_pos_fast) {
                    directions.bf = true;
                }
                // left
                if (e.clientX <= left_pos_slow && e.clientX > left_pos_fast) {
                    directions.ls = true;
                }
                if (e.clientX <= left_pos_fast) {
                    directions.lf = true;
                }
                // up
                if (e.clientY <= up_pos_slow && e.clientY > up_pos_fast) {
                    directions.us = true;
                }
                if (e.clientY <= up_pos_fast) {
                    directions.uf = true;
                }
                if (!compareDirections(directions, directions_clone)) { // если направления изменились, чтобы не каждый раз интервал менять, когда двигаешь мышкой
                    clearInterval(scroll_interval);
                    // right-up slow
                    if (directions.rs == true && directions.us == true) {
                        scroll_interval = scrollOnDrag(-tds[i].getBoundingClientRect().height, tds[i].getBoundingClientRect().width, "smooth", selected_content, 250);
                    }
                    // right-up fast
                    else if ((directions.rs == true && directions.uf == true) || (directions.rf == true && (directions.us == true || directions.uf == true))) {
                        scroll_interval = scrollOnDrag(-tds[i].getBoundingClientRect().height * 2, tds[i].getBoundingClientRect().width, "auto", selected_content, 100);
                    }
                    //right-down slow
                    else if (directions.rs == true && directions.bs == true) {
                        scroll_interval = scrollOnDrag(tds[i].getBoundingClientRect().height, tds[i].getBoundingClientRect().width, "smooth", selected_content, 250);
                    }
                    //right-down fast
                    else if ((directions.rs == true && directions.bf == true) || (directions.rf == true && (directions.bs == true || directions.bf == true))) {
                        scroll_interval = scrollOnDrag(tds[i].getBoundingClientRect().height * 2, tds[i].getBoundingClientRect().width, "auto", selected_content, 100);
                    }
                    //left-down slow
                    else if (directions.ls == true && directions.bs == true) {
                        scroll_interval = scrollOnDrag(tds[i].getBoundingClientRect().height, -tds[i].getBoundingClientRect().width, "smooth", selected_content, 250);
                    }
                    //left-down fast
                    else if ((directions.ls == true && directions.bf == true) || (directions.lf == true && (directions.bs == true || directions.bf == true))) {
                        scroll_interval = scrollOnDrag(tds[i].getBoundingClientRect().height * 2, -tds[i].getBoundingClientRect().width, "auto", selected_content, 100);
                    }
                    //left-up slow 
                    else if (directions.ls == true && directions.us == true) {
                        scroll_interval = scrollOnDrag(-tds[i].getBoundingClientRect().height, -tds[i].getBoundingClientRect().width, "smooth", selected_content, 250);
                    }
                    //left-up fast
                    else if ((directions.ls == true && directions.uf == true) || (directions.lf == true && (directions.us == true || directions.uf == true))) {
                        scroll_interval = scrollOnDrag(-tds[i].getBoundingClientRect().height * 2, -tds[i].getBoundingClientRect().width, "auto", selected_content, 100);
                    }
                    //right slow
                    else if (directions.rs == true) {
                        scroll_interval = scrollOnDrag(0, tds[i].getBoundingClientRect().width, "smooth", selected_content, 250);
                    }
                    //right fast
                    else if (directions.rf == true) {
                        scroll_interval = scrollOnDrag(0, tds[i].getBoundingClientRect().width, "auto", selected_content, 100);
                    }
                    //down slow
                    else if (directions.bs == true) {
                        scroll_interval = scrollOnDrag(tds[i].getBoundingClientRect().height, 0, "smooth", selected_content, 250);
                    }
                    //down fast
                    else if (directions.bf == true) {
                        scroll_interval = scrollOnDrag(tds[i].getBoundingClientRect().height * 2, 0, "auto", selected_content, 100);
                    }
                    //left slow
                    else if (directions.ls == true) {
                        scroll_interval = scrollOnDrag(0, -tds[i].getBoundingClientRect().width, "smooth", selected_content, 250);
                    }
                    //left fast
                    else if (directions.lf == true) {
                        scroll_interval = scrollOnDrag(0, -tds[i].getBoundingClientRect().width, "auto", selected_content, 100);
                    }
                    //up slow
                    else if (directions.us == true) {
                        scroll_interval = scrollOnDrag(-tds[i].getBoundingClientRect().height, 0, "smooth", selected_content, 250);
                    }
                    //up fast
                    else if (directions.uf == true) {
                        scroll_interval = scrollOnDrag(-tds[i].getBoundingClientRect().height * 2, 0, "auto", selected_content, 100);
                    }
                }
                let target_cell = e.target;
                if (arrayIndex(tds, target_cell) != -1 && target_cell != last_target) {
                    let second_i = arrayIndex(tds, target_cell);
                    second_col_i = second_i % ths.length;
                    second_row_i = Math.floor(second_i / ths.length);
                    min_col = Math.min(first_col_i, second_col_i);
                    min_row = Math.min(first_row_i, second_row_i);
                    start_cell_i = min_row * ths.length + min_col;
                    let end_cell_i = start_cell_i + ths.length * Math.abs(first_row_i - second_row_i) + Math.abs(first_col_i - second_col_i);
                    //console.log(start_cell_i + " " + end_cell_i);
                    //console.log(Math.abs(first_col_i - second_col_i) + 1 + " " + Math.abs(first_row_i - second_row_i) + 1);
                    drawCellRect(tds[start_cell_i], tds[end_cell_i], selected_content);
                    last_target = target_cell;
                }
            }
            document.onmouseup = function() {
                // сохранить выделенные ячейки/ячейку в двумерный массив
                selected_tds = new Array();
                console.log("onup ");
                for(let k = min_row; k <= min_row + Math.abs(first_row_i - second_row_i); k++) {
                    let row_array = new Array();
                    for(let j = min_col; j <= min_col + Math.abs(first_col_i - second_col_i); j++) {
                        let cur_cell_i = k * ths.length + j;
                        row_array.push(tds[cur_cell_i]);
                    }
                    selected_tds.push(row_array);
                }
                /*for(let k = 0; k < selected_tds.length; k++) {
                    for(let j = 0; j < selected_tds[k].length; j++) {
                        console.log(selected_tds[k][j]);
                    }
                    console.log("");
                }*/
                clearInterval(scroll_interval);
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }
        tds[i].ondragstart = function() {
            return false;
        };
    }

    function scrollOnDrag(top, left, behavior, selected_content, delay) {
        return setInterval(() => selected_content.scrollBy({
            top: top,
            left: left,
            behavior: behavior
        }), delay);
    }

    function compareDirections(dir, dir_clone) {
        for (let key in dir) {
            if (dir[key] != dir_clone[key]) {
                return false;
            }
        }
        return true;
    }

    function getParameters(i) {
        selected_content = content[cnt_i];
        selected_td = tds[i];
        selected_content_i = cnt_i;
        first_col_i = i % ths.length; /*узнать в какой колонке ячейка*/
        first_row_i = Math.floor(i / ths.length); /*узнать в какой строке ячейка*/
        second_col_i = first_col_i;
        second_row_i = first_row_i;
        min_col = second_col_i;
        min_row = second_row_i;
        start_cell_i = i;
    }
}

/*рисование обводки ячейки*/
function drawCellRect(td_start, td_end, content) {
    let td_start_top = td_start.getBoundingClientRect().top + content.scrollTop - table_header[0].getBoundingClientRect().height - header.getBoundingClientRect().height - horiz_stub_up.getBoundingClientRect().height;
    let td_start_left = td_start.getBoundingClientRect().left + content.scrollLeft - vert_stub_left.getBoundingClientRect().width;
    td_selection.style.top = td_start_top + "px";
    td_selection.style.left = td_start_left + "px";
    let td_end_top = td_end.getBoundingClientRect().top + content.scrollTop - table_header[0].getBoundingClientRect().height - header.getBoundingClientRect().height - horiz_stub_up.getBoundingClientRect().height;
    let td_end_left = td_end.getBoundingClientRect().left + content.scrollLeft - vert_stub_left.getBoundingClientRect().width;
    td_selection.style.width = td_end.getBoundingClientRect().width + Math.abs(td_start_left - td_end_left) + "px";
    td_selection.style.height = td_end.getBoundingClientRect().height + Math.abs(td_start_top - td_end_top) + "px";
    td_selection.classList.add("active");
}

function resizeCellRect(width, height) {
    td_selection.style.width = width + "px";
    td_selection.style.height = height + "px";
}

window.onresize = onResize;

function onResize() {
    /*для корректного отображения стыка заголовка и таблицы*/
    for (let i = 0; i < content.length; i++) {
        content[i].style.top = table_header[i].getBoundingClientRect().height + header.getBoundingClientRect().height + horiz_stub_up.getBoundingClientRect().height + "px";
        //console.log("res " + i);
    }
    /*для корректного отображения выделения ячейки*/
    if (selected_tds != null) {
        drawCellRect(selected_tds[0][0], selected_tds[selected_tds.length-1][selected_tds[selected_tds.length-1].length - 1], selected_content);
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