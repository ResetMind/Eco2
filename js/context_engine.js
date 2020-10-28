let r_copy = document.querySelector(".r_copy");
let r_paste = document.querySelector(".r_paste");
let r_cut = document.querySelector(".r_сut");
let r_row_up = document.querySelector(".r_row_up");
let r_row_down = document.querySelector(".r_row_down");
let right_context_menu = document.querySelector(".right_context_menu");
let left_context_menu = document.querySelector(".left_context_menu");
let new_rows_inner = ["<td contenteditable></td><td tabindex=\"0\"></td><td tabindex=\"0\"></td><td contenteditable></td><td contenteditable></td><td contenteditable></td><td contenteditable></td><td contenteditable></td><td contenteditable></td><td contenteditable></td><td contenteditable></td><td contenteditable></td><td contenteditable></td><td contenteditable></td><td contenteditable></td><td contenteditable></td><td contenteditable></td><td contenteditable></td><td contenteditable></td><td contenteditable></td><td contenteditable></td>", "<td tabindex=\"0\"></td><td contenteditable></td><td contenteditable></td><td contenteditable></td>", "<td tabindex=\"0\"></td><td contenteditable></td>"];
let copy_cut_array = null;
let ctrl = false;
setRightContextMenu();
setLeftContextMenu();

function createNewRow(index) {
    new_tr = document.createElement("tr");
    new_tr.innerHTML = new_rows_inner[index];
}

function setRightContextMenu() {
    document.body.oncontextmenu = function(e) {
        if (e.target.nodeName == "TD") {
            e.preventDefault();
            closeContextMenu(left_context_menu);
            if (selected_tds.length > 1) {
                r_row_up.style.display = "none";
                r_row_down.style.display = "none";
            } else {
                r_row_up.style.display = "block";
                r_row_down.style.display = "block";
            }
            if (copy_cut_array != null) {
                r_paste.style.display = "block";
            } else {
                r_paste.style.display = "none";
            }
            showContextMenu(e.clientX, e.clientY, right_context_menu);
        }
    }
    table_body[0].onkeyup = onKeyUp;
    table_body[1].onkeyup = onKeyUp;
    table_body[2].onkeyup = onKeyUp;
    r_copy.setAttribute("data-clipboard-action", "copy");
    r_copy.onmousedown = copy;
    r_copy.onclick = function() {
        if (!isSingleSelect()) {
            console.log("r_copy.onclick multi");
            copy_cut_array = getSelectedInners(false);
            table_body[0].onkeydown = onKeyDown;
            table_body[1].onkeydown = onKeyDown;
            table_body[2].onkeydown = onKeyDown;
        }
        onClipboardSuccess();
    }
    r_cut.setAttribute("data-clipboard-action", "cut");
    r_cut.onmousedown = cut;
    r_cut.onclick = function() {
        if (!isSingleSelect()) {
            console.log("r_cut.onclick multi");
            copy_cut_array = getSelectedInners(true);
            table_body[0].onkeydown = onKeyDown;
            table_body[1].onkeydown = onKeyDown;
            table_body[2].onkeydown = onKeyDown;
        }
        onClipboardSuccess();
    }
    r_paste.onclick = function() {
        console.log("r_paste.onclick");
        printTwoDimArray(copy_cut_array);
        paste();
        onClipboardSuccess();
    }
    r_row_up.onclick = function() {
        createNewRow(selected_content_i);
        let row = getColRow(selected_td_i, ths.length)[1];
        let ref = table_body[selected_content_i].querySelectorAll("tr")[row];
        ref.parentNode.insertBefore(new_tr, ref);
        setTableEngine(selected_content_i);
        tds[selected_td_i + ths.length].dispatchEvent(new Event("mousedown", { bubbles: true }));
        tds[selected_td_i + ths.length].dispatchEvent(new Event("mouseup", { bubbles: true }));
    }
    r_row_down.onclick = function() {
        createNewRow(selected_content_i);
        let row = getColRow(selected_td_i, ths.length)[1];
        let ref = table_body[selected_content_i].querySelectorAll("tr")[row];
        ref.parentNode.insertBefore(new_tr, ref.nextSibling);
        setTableEngine(selected_content_i);
    }

    function onKeyUp(e) {
        if (e.code == "KeyC" && ctrl) {
            console.log("ctrl c");
            r_copy.dispatchEvent(new Event("mousedown"));
            r_copy.dispatchEvent(new Event("click"));
        }
        if (e.code == "KeyX" && ctrl) {
            console.log("ctrl x");
            r_cut.dispatchEvent(new Event("mousedown"));
            r_cut.dispatchEvent(new Event("click"));
        }
        if (e.code == "KeyV" && ctrl) {
            if (copy_cut_array != null) {
                console.log("ctrl v");
                r_paste.dispatchEvent(new Event("click"));
            }
        }
        ctrl = e.code == "ControlLeft";
    }

    function onKeyDown(e) {
        if (e.code == "KeyV" && ctrl) {
            e.preventDefault();
            console.log("ctrl v onKeyDown");
        }
        ctrl = e.code == "ControlLeft";
    }

    function copy() {
        if (isSingleSelect()) {
            console.log("singlecopy " + selected_tds[0][0].innerHTML);
            setClipParam(r_copy, selected_tds[0][0]);
            copy_cut_array = null;
        } else {
            destroyClipboard();
        }
    }

    function cut() {
        if (isSingleSelect()) {
            console.log("singlecut " + selected_tds[0][0].innerHTML);
            setClipParam(r_cut, selected_tds[0][0]);
            copy_cut_array = null;
        } else {
            destroyClipboard();
        }
    }

    function paste() {
        for (let k = 0; k < selected_tds.length; k++) {
            if (k > copy_cut_array.length - 1) {
                break;
            }
            for (let j = 0; j < selected_tds[k].length; j++) {
                if (j > copy_cut_array[k].length - 1) {
                    break;
                }
                selected_tds[k][j].innerHTML = copy_cut_array[k][j];
            }
        }
    }

    function isSingleSelect() {
        return selected_tds.length == 1 && selected_tds[0].length == 1;
    }

    function getSelectedInners(cut) {
        let array = [];
        for (let k = 0; k < selected_tds.length; k++) {
            let row = [];
            for (let j = 0; j < selected_tds[k].length; j++) {
                row.push(selected_tds[k][j].innerHTML);
                if (cut) {
                    selected_tds[k][j].innerHTML = "";
                }
            }
            array.push(row);
        }
        return array;
    }
}

function setLeftContextMenu() {
    document.documentElement.onclick = function(e) {
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
    let cultures = [];
    let tds = table_body[table_num].querySelectorAll("td");
    left_context_menu.innerHTML = "";
    if (table_num == 2) {
        existingCultures();
    }
    //console.log(cultures);
    for (let i = 1; i < tds.length; i += step) {
        let li = document.createElement("li");
        li.innerHTML = tds[i].innerHTML;
        if (table_num == 2) { //c
            if (!left_context_menu.innerHTML.includes(li.innerHTML) && arrayIndex(cultures, li.innerHTML) == -1) {
                left_context_menu.append(li);
                li.onclick = function() {
                    selected_tds[0][0].innerHTML = selected_tds[0][0].innerHTML == "" ? li.innerHTML : selected_tds[0][0].innerHTML + ", " + li.innerHTML;
                }
            }
        } else { //f
            if (!left_context_menu.innerHTML.includes(li.innerHTML)) {
                left_context_menu.append(li);
                li.onclick = function() {
                    selected_tds[0][0].innerHTML = li.innerHTML;
                }
            }
        }

    }

    function existingCultures() {
        cultures = selected_tds[0][0].innerHTML.split(", ");
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