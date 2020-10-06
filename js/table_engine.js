let horiz_stub_up = document.querySelector(".horiz_stub_up");
let horiz_stub_bottom = document.querySelector(".horiz_stub_bottom");
let vert_stub_left = document.querySelector(".vert_stub_left");
let vert_stub_right = document.querySelector(".vert_stub_right");
let header = document.querySelector("header");
let footer = document.querySelector("footer");
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
            let last_target = null;
            let last_pos = "null";
            let x_start = e.clientX;
            let y_start = e.clientY;
            selected_content = content[cnt_i];
            selected_td = tds[i];
            drawCellRect(tds[i], content[cnt_i]);
            /*Плавный скролл таблицы, когда драгаешь ячейку*/
            document.onmousemove = function(e) {
                e.preventDefault();
                //console.log(e.clie);       
                /*if (e.target == vert_stub_right) {
                    if (scroll_interval == null) {
                        scroll_interval = scrollOnDrag(0, tds[i].getBoundingClientRect().width, selected_content, 250);
                    }
                } else if (e.target == vert_stub_left) {
                    if (scroll_interval == null) {
                        scroll_interval = scrollOnDrag(0, -tds[i].getBoundingClientRect().width, selected_content, 250);
                    }
                } else if (e.target == table_header[cnt_i] || table_header[cnt_i].contains(e.target) || e.target == horiz_stub_up) {
                    if (scroll_interval == null || last_target == header) {
                        clearInterval(scroll_interval);
                        scroll_interval = scrollOnDrag(-tds[i].getBoundingClientRect().height, 0, selected_content, 250);
                    }
                } else if (e.target == header) {
                    if (scroll_interval == null || last_target == horiz_stub_up || last_target == table_header[cnt_i] || table_header[cnt_i].contains(last_target)) {
                        clearInterval(scroll_interval);
                        scroll_interval = scrollOnDrag(-tds[i].getBoundingClientRect().height, 0, selected_content, 150);
                    }
                } else if (e.target == horiz_stub_bottom) {
                    if (scroll_interval == null) {
                        scroll_interval = scrollOnDrag(tds[i].getBoundingClientRect().height, 0, selected_content, 250);
                    }
                } else {
                    clearInterval(scroll_interval);
                    scroll_interval = null;
                }*/
                let scroll_width = selected_content.offsetWidth - selected_content.clientWidth > 0 ? selected_content.offsetWidth - selected_content.clientWidth : 10;
                let scroll_height = selected_content.offsetHeight - selected_content.clientHeight > 0 ? selected_content.offsetHeight - selected_content.clientHeight : 10;
                let right_pos_slow = document.documentElement.clientWidth - scroll_width - vert_stub_right.getBoundingClientRect().width;
                let left_pos_slow = scroll_width + vert_stub_right.getBoundingClientRect().width;
                let right_pos_fast = document.documentElement.clientWidth - vert_stub_right.getBoundingClientRect().width;
                let left_pos_fast = vert_stub_right.getBoundingClientRect().width;
                console.log(selected_content.offsetWidth - selected_content.clientWidth);
                console.log(vert_stub_left.getBoundingClientRect().width);
                if (e.clientX >= right_pos_slow && e.clientX < right_pos_fast) {
                    if (scroll_interval == null || last_pos.includes("left_pos_fast")) {
                        clearInterval(scroll_interval);
                        last_pos = "right_pos_slow";
                        scroll_interval = scrollOnDrag(0, tds[i].getBoundingClientRect().width, "smooth", selected_content, 250);
                    }
                } else if (e.clientX >= right_pos_fast) {
                    if (scroll_interval == null || last_pos.includes("right_pos_slow")) {
                        clearInterval(scroll_interval);
                        last_pos = "right_pos_fast";
                        scroll_interval = scrollOnDrag(0, tds[i].getBoundingClientRect().width, "auto", selected_content, 100);
                    }
                } else if (e.clientX <= left_pos_slow && e.clientX > left_pos_fast) {
                    if (scroll_interval == null || last_pos.includes("left_pos_fast")) {
                        clearInterval(scroll_interval);
                        last_pos = "left_pos_slow";
                        scroll_interval = scrollOnDrag(0, -tds[i].getBoundingClientRect().width, "smooth", selected_content, 250);
                    }
                } else if (e.clientX <= left_pos_fast) {
                    if (scroll_interval == null || last_pos.includes("left_pos_slow")) {
                        clearInterval(scroll_interval);
                        last_pos = "left_pos_fast";
                        scroll_interval = scrollOnDrag(0, -tds[i].getBoundingClientRect().width, "auto", selected_content, 100);
                    }
                } else {
                    clearInterval(scroll_interval);
                    scroll_interval = null;
                    last_pos = "null";
                }
                
                last_target = e.target
                console.log(document.documentElement.clientWidth + " " + document.documentElement.clientHeight);
                console.log(e.clientX + " " + e.clientY);
                //console.log(e.target);
                //else if()
                /*td_selection.style.width = td.getBoundingClientRect().width + "px";
                td_selection.style.height = td.getBoundingClientRect().height + "px";*/
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