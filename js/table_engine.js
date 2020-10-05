let horiz_stub_up = document.querySelector(".horiz_stub_up");
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
            let x_start = e.clientX;
            let y_start = e.clientY;
            selected_content = content[cnt_i];
            selected_td = tds[i];
            drawCellRect(tds[i], content[cnt_i]);
            document.onmousemove = function(e) {
                if(e.target == vert_stub_right && scroll_interval == null) {
                    console.log(vert_stub_right);
                    scroll_interval = setInterval(() => selected_content.scrollBy(tds[i].getBoundingClientRect().width, 0), 250);
                }
                
                //console.log(document.documentElement.clientWidth + " " + document.documentElement.clientHeight);
                //console.log(e.clientX + " " + e.clientY);
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