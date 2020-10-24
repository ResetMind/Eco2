let right_context_menu = document.querySelector(".right_context_menu");
let left_context_menu = document.querySelector(".left_context_menu");
let tds = table_body[0].querySelectorAll("td");
let ths = table_header[0].querySelectorAll("th");
setRightContextMenu();
setLeftContextMenu();

function setRightContextMenu() {
    document.body.oncontextmenu = function (e) {
        if (e.target.nodeName == "TD") {
            e.preventDefault();
            closeContextMenu(left_context_menu);
            showContextMenu(e.clientX, e.clientY, right_context_menu);
        }
    }
}

function setLeftContextMenu() {
    document.documentElement.onclick = function (e) {
        closeContextMenu(right_context_menu);
        if (e.target.nodeName != "TD") {
            closeContextMenu(left_context_menu);
            return;
        }
        let td = e.target;
        let td_col = getColRow(arrayIndex(tds, td), ths.length)[0];
        if(td_col == 1) {
            createCulturesAndFieldsContext(2, 2);
            showContextMenu(e.clientX, e.clientY, left_context_menu);
        } else if(td_col == 2) {
            createCulturesAndFieldsContext(1, 4);
            showContextMenu(e.clientX, e.clientY, left_context_menu);
        } else {
            closeContextMenu(left_context_menu);
        }
    }
}

function createCulturesAndFieldsContext(table_num, step) {
    let tds = table_body[table_num].querySelectorAll("td");
    left_context_menu.innerHTML = "";
    for(let i = 1; i < tds.length; i+=step) {
        let li = document.createElement("li");
        li.innerHTML = tds[i].innerHTML;
        if(!left_context_menu.innerHTML.includes(li.innerHTML)) {
            left_context_menu.append(li);
        }
    }
}

function showContextMenu(x, y, menu) {
    menu.classList.add("active");
    if (y + menu.getBoundingClientRect().height > document.documentElement.clientHeight - footer.getBoundingClientRect().height - horiz_stub_bottom.getBoundingClientRect().height) {
        y = y - menu.getBoundingClientRect().height - 4;
    }
    if (x + menu.getBoundingClientRect().width > document.documentElement.clientWidth) {
        x = x - menu.getBoundingClientRect().width - 4;
    }
    menu.style.top = (y + 2) + "px";
    menu.style.left = (x + 2) + "px";
}

function closeContextMenu(menu) {
    menu.classList.remove("active");
}

function closeAllContext() {
    closeContextMenu(left_context_menu);
    closeContextMenu(right_context_menu);
}