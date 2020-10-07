let horiz_stub_up = document.querySelector(".horiz_stub_up");
let horiz_stub_bottom = document.querySelector(".horiz_stub_bottom");
let vert_stub_left = document.querySelector(".vert_stub_left");
let vert_stub_right = document.querySelector(".vert_stub_right");
let header = document.querySelector("header");
let footer = document.querySelector(".footer");
console.log(footer);
let table_header = document.querySelectorAll(".table_header");
let table_body = document.querySelectorAll(".table_body");
let content = document.querySelectorAll(".content");
let td_selection = document.querySelector(".td_selection");
let selected_td = null;
let selected_content = content[0];

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
    for (let i = 0; i < tds.length; i++) {
        tds[i].onclick = function() {
            let col_i = i % ths.length; /*узнать в какой колонке ячейка*/
            let row_i = Math.floor(i / ths.length); /*узнать в какой строке ячейка*/
            /*console.log(row_i + " " + col_i);
            console.log(tds[i].getBoundingClientRect().top + " " + tds[i].getBoundingClientRect().left);*/
            selected_content = content[cnt_i];
            selected_td = tds[i];
            drawCellRect(tds[i], content[cnt_i]);
        }
        tds[i].onmousedown = function(e) {
            let scroll_interval = null;
            let x_start = e.clientX;
            let y_start = e.clientY;
            selected_content = content[cnt_i];
            selected_td = tds[i];
            drawCellRect(tds[i], content[cnt_i]);
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
                    let horiz_step = 
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
            }
            document.onmouseup = function() {
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
}

/*рисование обводки ячейки*/
function drawCellRect(td, content) {
    td_selection.style.top = td.getBoundingClientRect().top + content.scrollTop - table_header[0].getBoundingClientRect().height - header.getBoundingClientRect().height - horiz_stub_up.getBoundingClientRect().height + "px";
    td_selection.style.left = td.getBoundingClientRect().left + content.scrollLeft - vert_stub_left.getBoundingClientRect().width + "px";
    td_selection.style.width = td.getBoundingClientRect().width + "px";
    td_selection.style.height = td.getBoundingClientRect().height + "px";
    td_selection.classList.add("active");
}

window.onresize = onResize;

function onResize() {
    /*для корректного отображения стыка заголовка и таблицы*/
    for (let i = 0; i < content.length; i++) {
        content[i].style.top = table_header[i].getBoundingClientRect().height + header.getBoundingClientRect().height + horiz_stub_up.getBoundingClientRect().height + "px";
        console.log("res " + i);
    }
    /*для корректного отображения выделения ячейки*/
    if (selected_td != null) {
        drawCellRect(selected_td, selected_content);
    }
}