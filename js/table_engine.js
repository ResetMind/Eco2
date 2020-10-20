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
let fast = document.querySelector(".fast");
let slow = document.querySelector(".slow");
let selected_td = null;
let selected_tds = null;
let selected_content = content[0];
let selected_content_i = 0;

onWindowResize();
setTableEngine(0);

function setTableEngine(n) {
    let tds = table_body[n].querySelectorAll("td");
    let ths = table_header[n].querySelectorAll("th");
    /*перемещение фиксированной шапки вместе со скроллом таблицы*/
    content[n].onscroll = function() {
        table_header[n].style.left = (-content[n].scrollLeft + vert_stub_left.getBoundingClientRect().width) + "px";
    }
    content_frame.onresize = function() {
        onWindowResize();
        onThResize(tds, ths, n);
    }
    onTdSelect(tds, ths, n);
    onThResize(tds, ths, n);
}

function onThResize(tds, ths, n) {
    let c = getBordersCoord();
    table_header[n].onmousemove = function(e) {
        let index = getBorder(c, e.clientX + content[n].scrollLeft);
        if (index != -1) {
            //console.log(index);
            table_header[n].style.cursor = "col-resize";
            table_header[n].onmousedown = function(e) {
                e.preventDefault();
                table_header[n].onmousemove = null;
                let start_x = e.clientX;
                let table_width = table_header[n].getBoundingClientRect().width;
                let col_width = ths[index - 1].getBoundingClientRect().width - parseInt(getComputedStyle(ths[index - 1]).paddingLeft) * 2;
                console.log(table_width + " " + col_width);
                document.body.onmousemove = function(e) {
                    document.body.style.cursor = "col-resize";
                    let new_col_width = col_width + (e.clientX - start_x);
                    if (new_col_width > 10) {
                        ths[index - 1].style.width = new_col_width + "px";
                        table_header[n].style.width = (table_width + e.clientX - start_x) + "px";
                        tds[index - 1].style.width = new_col_width + "px";
                        table_body[n].style.width = (table_width + e.clientX - start_x) + "px";
                    }
                }
                document.body.onmouseup = function() {
                    document.body.style.cursor = "default";
                    document.body.onmousemove = null;
                    onThResize(tds, ths, n);
                }
            }
        } else {
            table_header[n].style.cursor = "default";
        }
    }

    function getBordersCoord() {
        let c = [];
        for (let k = 0; k < ths.length; k++) {
            c.push(ths[k].getBoundingClientRect().left + content[n].scrollLeft); //5, 100, 195 вне зависимости от горизонтального скрол
        }
        return c;
    }

    function getBorder(c, x) {
        for (let k = 1; k < c.length; k++) {
            if (Math.abs(x - c[k]) <= 2) {
                return k;
            }
        }
        return -1;
    }
}

function onTdSelect(tds, ths, cnt_i) {
    let first_col_i, first_row_i, second_col_i, second_row_i, min_col, min_row, start_cell_i, end_cell_i;
    let scroll_interval = null;
    for (let i = 0; i < tds.length; i++) {
        tds[i].onclick = function() {
            getFirstCellParameters(i);
            drawCellRect(tds[i], tds[i], content[cnt_i]);
        }
        tds[i].onmousedown = function(e) {
            if (e.which == 2) {
                return false;
            }
            getFirstCellParameters(i);
            drawCellRect(tds[i], tds[i], content[cnt_i]);
            scroll_interval = null;
            let last_target = null;
            let scroll_width = content[cnt_i].offsetWidth - content[cnt_i].clientWidth;
            let scroll_height = content[cnt_i].offsetHeight - content[cnt_i].clientHeight;
            let addit_width = scroll_width > 0 ? scroll_width : 10;
            let addit_height = scroll_height > 0 ? scroll_height : 10;
            let right_pos_fast = content[cnt_i].getBoundingClientRect().width > table_body[cnt_i].clientWidth ? content[cnt_i].offsetLeft + table_body[cnt_i].clientWidth : content[cnt_i].offsetLeft + content[cnt_i].getBoundingClientRect().width;
            let right_pos_slow = right_pos_fast - addit_width;
            let up_pos_slow = content[cnt_i].offsetTop;
            let up_pos_fast = up_pos_slow - table_header[cnt_i].getBoundingClientRect().height;
            let left_pos_fast = content[cnt_i].offsetLeft;
            let left_pos_slow = left_pos_fast + addit_width;
            let bottom_pos_fast = content[cnt_i].getBoundingClientRect().height > table_body[cnt_i].clientHeight ? content[cnt_i].offsetTop + table_body[cnt_i].clientHeight : content[cnt_i].offsetTop + content[cnt_i].getBoundingClientRect().height;
            let bottom_pos_slow = bottom_pos_fast - addit_height;
            let directions = {
                rs: false, //right slow
                rf: false, //right fast
                bs: false, //bottom slow
                bf: false, //bottom fast
                ls: false, //left slow
                lf: false, //left fast
                us: false, //up slow
                uf: false, //up fast
                end: false
            };
            let directions_mini = {
                r: false,
                b: false,
                l: false,
                u: false
            };
            /*скролл таблицы, когда драгаешь ячейку*/
            document.onmousemove = function(e) {
                let directions_clone = {};
                for (let key in directions) {
                    directions_clone[key] = directions[key];
                }
                directions = { rs: false, rf: false, bs: false, bf: false, ls: false, lf: false, us: false, uf: false, end: false };
                directions_mini = { r: false, b: false, l: false, u: false };
                e.preventDefault();

                let target = e.target;
                if (arrayIndex(tds, target) != -1 && target != last_target) {
                    [second_col_i, second_row_i] = getColRow(arrayIndex(tds, target), ths.length);
                    [start_cell_i, end_cell_i] = getStartEndCells();
                    drawCellRect(tds[start_cell_i], tds[end_cell_i], content[cnt_i]);
                    last_target = target;
                }
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
                if (areDirections(directions) || areDirections(directions_clone)) {
                    /*if(content[cnt_i].scrollHeight - content[cnt_i].scrollTop == content[cnt_i].clientHeight || content[cnt_i].scrollTop == 0) {
                        clearInterval(scroll_interval);
                    }*/
                    if (!compareDirections(directions, directions_clone)) { // если направления изменились, чтобы не каждый раз интервал менять, когда двигаешь мышкой
                        clearInterval(scroll_interval);
                        console.log("change");
                        // right-up slow
                        if (directions.rs == true && directions.us == true) {
                            scroll_interval = scrollOnDrag(-tds[i].getBoundingClientRect().height, tds[i].getBoundingClientRect().width, "smooth", content[cnt_i], 250, 1, -1);
                        }
                        // right-up fast
                        else if ((directions.rs == true && directions.uf == true) || (directions.rf == true && (directions.us == true || directions.uf == true))) {
                            scroll_interval = scrollOnDrag(-tds[i].getBoundingClientRect().height * 2, tds[i].getBoundingClientRect().width, "auto", content[cnt_i], 100, 1, -2);
                        }
                        //right-down slow
                        else if (directions.rs == true && directions.bs == true) {
                            scroll_interval = scrollOnDrag(tds[i].getBoundingClientRect().height, tds[i].getBoundingClientRect().width, "smooth", content[cnt_i], 250, 1, 1);
                        }
                        //right-down fast
                        else if ((directions.rs == true && directions.bf == true) || (directions.rf == true && (directions.bs == true || directions.bf == true))) {
                            scroll_interval = scrollOnDrag(tds[i].getBoundingClientRect().height * 2, tds[i].getBoundingClientRect().width, "auto", content[cnt_i], 100, 1, 2);
                        }
                        //left-down slow
                        else if (directions.ls == true && directions.bs == true) {
                            scroll_interval = scrollOnDrag(tds[i].getBoundingClientRect().height, -tds[i].getBoundingClientRect().width, "smooth", content[cnt_i], 250, -1, 1);
                        }
                        //left-down fast
                        else if ((directions.ls == true && directions.bf == true) || (directions.lf == true && (directions.bs == true || directions.bf == true))) {
                            scroll_interval = scrollOnDrag(tds[i].getBoundingClientRect().height * 2, -tds[i].getBoundingClientRect().width, "auto", content[cnt_i], 100, -1, 2);
                        }
                        //left-up slow 
                        else if (directions.ls == true && directions.us == true) {
                            scroll_interval = scrollOnDrag(-tds[i].getBoundingClientRect().height, -tds[i].getBoundingClientRect().width, "smooth", content[cnt_i], 250, -1, -1);
                        }
                        //left-up fast
                        else if ((directions.ls == true && directions.uf == true) || (directions.lf == true && (directions.us == true || directions.uf == true))) {
                            scroll_interval = scrollOnDrag(-tds[i].getBoundingClientRect().height * 2, -tds[i].getBoundingClientRect().width, "auto", content[cnt_i], 100, -1, -2);
                        }
                        //right slow
                        else if (directions.rs == true) {
                            scroll_interval = scrollOnDrag(0, tds[i].getBoundingClientRect().width, "smooth", content[cnt_i], 250, 1, 0);
                        }
                        //right fast
                        else if (directions.rf == true) {
                            scroll_interval = scrollOnDrag(0, tds[i].getBoundingClientRect().width, "auto", content[cnt_i], 100, 1, 0);
                        }
                        //down slow
                        else if (directions.bs == true) {
                            scroll_interval = scrollOnDrag(tds[i].getBoundingClientRect().height, 0, "smooth", content[cnt_i], 250, 0, 1);
                        }
                        //down fast
                        else if (directions.bf == true) {
                            scroll_interval = scrollOnDrag(tds[i].getBoundingClientRect().height * 2, 0, "auto", content[cnt_i], 100, 0, 2);
                        }
                        //left slow
                        else if (directions.ls == true) {
                            scroll_interval = scrollOnDrag(0, -tds[i].getBoundingClientRect().width, "smooth", content[cnt_i], 250, -1, 0);
                        }
                        //left fast
                        else if (directions.lf == true) {
                            scroll_interval = scrollOnDrag(0, -tds[i].getBoundingClientRect().width, "auto", content[cnt_i], 100, -1, 0);
                        }
                        //up slow
                        else if (directions.us == true) {
                            scroll_interval = scrollOnDrag(-tds[i].getBoundingClientRect().height, 0, "smooth", content[cnt_i], 250, 0, -1);
                        }
                        //up fast
                        else if (directions.uf == true) {
                            scroll_interval = scrollOnDrag(-tds[i].getBoundingClientRect().height * 2, 0, "auto", content[cnt_i], 100, 0, -2);
                        }
                    }
                    /* границы таблицы с запасом */
                    let left = left_pos_fast + 3;
                    let right = scroll_width == 0 ? right_pos_fast - 3 : right_pos_slow - 3;
                    let top = up_pos_slow + 3;
                    let bottom = scroll_width == 0 ? bottom_pos_fast - 3 : bottom_pos_slow - 3;
                    let cell = null;
                    /*fast.style.left = left_pos_fast + "px";
                    fast.style.top = up_pos_fast + "px";
                    fast.style.width = (right_pos_fast - left_pos_fast) + "px";
                    fast.style.height = (bottom_pos_fast - up_pos_fast) + "px";
                    fast.classList.add("active");*/
                    /*slow.style.left = left + "px";
                    slow.style.top = top + "px";
                    slow.style.width = (right - left) + "px";
                    slow.style.height = (bottom - top) + "px";
                    slow.classList.add("active");*/
                    if (e.clientX >= right) {
                        directions_mini.r = true;
                    }
                    if (e.clientY >= bottom) {
                        directions_mini.b = true;
                    }
                    if (e.clientX <= left) {
                        directions_mini.l = true;
                    }
                    if (e.clientY <= top) {
                        directions_mini.u = true;
                    }

                    if (directions_mini.r == true && directions_mini.u == true) {
                        while (arrayIndex(tds, cell) == -1) {
                            //console.log("ru");
                            right--;
                            top++;
                            cell = document.elementFromPoint(right, top);
                        }
                    } else if (directions_mini.u == true && directions_mini.l == true) {
                        while (arrayIndex(tds, cell) == -1) {
                            //console.log("lu");
                            left++;
                            top++;
                            cell = document.elementFromPoint(left, top);
                        }
                    } else if (directions_mini.l == true && directions_mini.b == true) {
                        while (arrayIndex(tds, cell) == -1) {
                            //console.log("lb");
                            left++;
                            bottom--;
                            cell = document.elementFromPoint(left, bottom);
                        }
                    } else if (directions_mini.b == true && directions_mini.r == true) {
                        while (arrayIndex(tds, cell) == -1) {
                            //console.log("rb");
                            right--;
                            bottom--;
                            cell = document.elementFromPoint(right, bottom);
                        }
                    } else if (directions_mini.r == true) {
                        while (arrayIndex(tds, cell) == -1) {
                            //console.log("r");
                            right--;
                            cell = document.elementFromPoint(right, e.clientY);
                        }
                    } else if (directions_mini.u == true) {
                        while (arrayIndex(tds, cell) == -1) {
                            //console.log("u");
                            top++;
                            cell = document.elementFromPoint(e.clientX, top);
                        }
                    } else if (directions_mini.l == true) {
                        while (arrayIndex(tds, cell) == -1) {
                            //console.log("l");
                            left++;
                            cell = document.elementFromPoint(left, e.clientY);
                        }
                    } else if (directions_mini.b == true) {
                        while (arrayIndex(tds, cell) == -1) {
                            //console.log("b");
                            bottom--;
                            cell = document.elementFromPoint(e.clientX, bottom);
                        }
                    }
                    if (cell != null) {
                        [second_col_i, second_row_i] = getColRow(arrayIndex(tds, cell), ths.length);
                        [start_cell_i, end_cell_i] = getStartEndCells();
                        drawCellRect(tds[start_cell_i], tds[end_cell_i], content[cnt_i]);
                    }
                }
            }
            document.onmouseup = function() {
                // сохранить выделенные ячейки/ячейку в двумерный массив
                selected_tds = new Array();
                console.log("onup ");
                for (let k = min_row; k <= min_row + Math.abs(first_row_i - second_row_i); k++) {
                    let row_array = new Array();
                    for (let j = min_col; j <= min_col + Math.abs(first_col_i - second_col_i); j++) {
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
        tds[i].ondragstart = function(e) {
            return false;
        };
    }

    function scrollOnDrag(top, left, behavior, selected_content, delay, step_col, step_row) {
        function scroll() {
            if ((selected_content.scrollHeight - selected_content.scrollTop === selected_content.clientHeight && top > 0) || (selected_content.scrollTop == 0 && top < 0)) {
                top = 0;
                console.log("top " + top);
            }
            if ((selected_content.offsetWidth + selected_content.scrollLeft >= selected_content.scrollWidth && left > 0) || (selected_content.scrollLeft == 0 && left < 0)) {
                left = 0;
                console.log("left " + left);
            }
            /*if ((selected_content.scrollWidth - selected_content.scrollLeft === selected_content.clientWidth && left > 0) || (selected_content.scrollLeft == 0 && left < 0)) {
                left = 0;
                console.log("left " + left);
            }*/
            if (top != 0 || left != 0) {
                second_col_i += step_col;
                second_row_i += step_row;
                second_col_i = second_col_i < 0 ? 0 : second_col_i;
                second_row_i = second_row_i < 0 ? 0 : second_row_i;
                second_col_i = second_col_i >= ths.length ? ths.length - 1 : second_col_i;
                second_row_i = second_row_i >= tds.length / ths.length ? tds.length / ths.length - 1 : second_row_i;
                [start_cell_i, end_cell_i] = getStartEndCells();
                drawCellRect(tds[start_cell_i], tds[end_cell_i], selected_content);
                selected_content.scrollBy({
                    top: top,
                    left: left,
                    behavior: behavior
                });
            }
        };
        return setInterval(scroll, delay);
    }

    td_selection_frame.onresize = function() {
        console.log("size");
        for (let k = 0; k < tds.length; k++) {
            tds[k].classList.remove("selected");
        }
        for (let k = 0; k < ths.length; k++) {
            ths[k].classList.remove("selected");
        }
        for (let k = min_row; k <= min_row + Math.abs(first_row_i - second_row_i); k++) {
            for (let j = min_col; j <= min_col + Math.abs(first_col_i - second_col_i); j++) {
                let cur_cell_i = k * ths.length + j;
                tds[cur_cell_i].classList.add("selected");
            }
        }
        for (let j = min_col; j <= min_col + Math.abs(first_col_i - second_col_i); j++) {
            ths[j].classList.add("selected");
        }
    }

    function compareDirections(dir, dir_clone) {
        for (let key in dir) {
            if (dir[key] != dir_clone[key]) {
                return false;
            }
        }
        return true;
    }

    function areDirections(dir) {
        for (let key in dir) {
            if (dir[key] == true) {
                return true;
            }
        }
        return false;
    }

    function getFirstCellParameters(i) {
        selected_content = content[cnt_i];
        selected_td = tds[i];
        selected_content_i = cnt_i;
        [first_col_i, first_row_i] = getColRow(i, ths.length); /*узнать в какой колонке/line ячейка*/
        second_col_i = first_col_i;
        second_row_i = first_row_i;
        min_col = second_col_i;
        min_row = second_row_i;
        start_cell_i = i;
    }

    function getStartEndCells() {
        min_col = Math.min(first_col_i, second_col_i);
        min_row = Math.min(first_row_i, second_row_i);
        start_cell_i = min_row * ths.length + min_col;
        end_cell_i = start_cell_i + ths.length * Math.abs(first_row_i - second_row_i) + Math.abs(first_col_i - second_col_i);
        return [start_cell_i, end_cell_i];
    }
}

/*рисование обводки ячейки*/
function drawCellRect(td_start, td_end, content) {
    //td_selection.classList.remove("active"); // firefox // лагает
    let td_start_top = td_start.getBoundingClientRect().top + content.scrollTop - table_header[0].getBoundingClientRect().height - header.getBoundingClientRect().height - horiz_stub_up.getBoundingClientRect().height;
    let td_start_left = td_start.getBoundingClientRect().left + content.scrollLeft - vert_stub_left.getBoundingClientRect().width;
    td_selection.style.top = td_start_top + "px";
    td_selection.style.left = td_start_left + "px";
    let td_end_top = td_end.getBoundingClientRect().top + content.scrollTop - table_header[0].getBoundingClientRect().height - header.getBoundingClientRect().height - horiz_stub_up.getBoundingClientRect().height;
    let td_end_left = td_end.getBoundingClientRect().left + content.scrollLeft - vert_stub_left.getBoundingClientRect().width;
    //td_selection.classList.add("active"); // chrome
    td_selection.style.width = "0px";
    td_selection.style.width = td_end.getBoundingClientRect().width + Math.abs(td_start_left - td_end_left) + "px";
    td_selection.style.height = td_end.getBoundingClientRect().height + Math.abs(td_start_top - td_end_top) + "px";
    td_selection.classList.add("active");
}

//window.onresize = onWindowResize;

function onWindowResize() {
    /*для корректного отображения стыка заголовка и таблицы*/
    for (let i = 0; i < content.length; i++) {
        content[i].style.top = table_header[i].getBoundingClientRect().height + header.getBoundingClientRect().height + horiz_stub_up.getBoundingClientRect().height + "px";
    }
    /*для корректного отображения выделения ячейки*/
    if (selected_tds != null) {
        drawCellRect(selected_tds[0][0], selected_tds[selected_tds.length - 1][selected_tds[selected_tds.length - 1].length - 1], selected_content);
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