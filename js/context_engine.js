let right_context_menu = document.querySelector(".right_context_menu");
let left_context_menu = document.querySelector(".left_context_menu");
createRows();
setRightContextMenu();
setLeftContextMenu();

function createNewRow() {
    new_row = table_body[selected_content_i].querySelector("tr");
    new_tr = document.createElement("tr");
    new_tr.innerHTML = new_row.innerHTML;
}

function setRightContextMenu() {
    document.body.oncontextmenu = function (e) {
        if (e.target.nodeName == "TD") {
            e.preventDefault();
            closeContextMenu(left_context_menu);
            if (selected_tds.length > 1) {
                right_context_menu.querySelector(".r_row_up").style.display = "none";
                right_context_menu.querySelector(".r_row_down").style.display = "none";
            } else {
                right_context_menu.querySelector(".r_row_up").style.display = "block";
                right_context_menu.querySelector(".r_row_down").style.display = "block";
            }
            showContextMenu(e.clientX, e.clientY, right_context_menu);
        }
    }
    right_context_menu.querySelector(".r_row_up").onclick = function () {
        createNewRow();
        let row = getColRow(selected_td_i, ths.length)[1];
        let ref = table_body[selected_content_i].querySelectorAll("tr")[row];
        ref.parentNode.insertBefore(new_tr, ref);
        setTableEngine(selected_content_i);
    }
    right_context_menu.querySelector(".r_row_down").onclick = function () {
        createNewRow();
        let row = getColRow(selected_td_i, ths.length)[1];
        let ref = table_body[selected_content_i].querySelectorAll("tr")[row];
        ref.parentNode.insertBefore(new_tr, ref.nextSibling);
        setTableEngine(selected_content_i);
    }
}

function setLeftContextMenu() {
    document.documentElement.onclick = function (e) {
        closeContextMenu(right_context_menu);
        if (e.target.nodeName != "TD" || selected_content_i != 0) {
            closeContextMenu(left_context_menu);
            return;
        }
        let td = e.target;
        let td_col = getColRow(arrayIndex(tds, td), ths.length)[0];
        if (td_col == 1) {
            createCulturesAndFieldsContext(2, 2);
            showContextMenu(e.clientX, e.clientY, left_context_menu);
        } else if (td_col == 2) {
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
    for (let i = 1; i < tds.length; i += step) {
        let li = document.createElement("li");
        li.innerHTML = tds[i].innerHTML;
        if (!left_context_menu.innerHTML.includes(li.innerHTML)) {
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