let r_copy = document.querySelector("li.r_copy");
let r_paste = document.querySelector("li.r_paste");
let r_cut = document.querySelector("li.r_сut");
let r_clear = document.querySelector("li.r_clear");
let r_row_up = document.querySelector("li.r_row_up");
let r_row_down = document.querySelector("li.r_row_down");
let r_delete_row = document.querySelector("li.r_delete_row");
let r_col_right = document.querySelector("li.r_col_right");
let r_col_left = document.querySelector("li.r_col_left");
let r_delete_col = document.querySelector("li.r_delete_col");
let r_new_set = document.querySelector("li.r_new_set");
let right_context_menu = document.querySelector("ul.right_context_menu");
let left_context_menu = document.querySelector("ul.left_context_menu");
let context_menu = document.querySelectorAll("ul.context_menu");
let copy_cut_array;
let ctrl = false;

window.onresize = function() {
    closeAllContext();
}

document.body.addEventListener("mousedown", function() {
    closeAllContext();
});

function setRightContextMenu(table) { //div.table
    let table_body = table.querySelector("table.table_body");
    setOptions();
    table_body.oncontextmenu = function(e) {
        if (e.target.nodeName == "TD") {
            e.preventDefault();
            closeAllContext();
            if (!hasEditableCells()) {
                setDisplay(r_paste, "none");
                setDisplay(r_cut, "none");
                setDisplay(r_clear, "none");
            } else {
                if (!copy_cut_array) {
                    setDisplay(r_paste, "none");
                } else {
                    setDisplay(r_paste, "block");
                }
                setDisplay(r_cut, "block");
                setDisplay(r_clear, "block");
            }
            if (!hasDeletableRows()) {
                setDisplay(r_delete_row, "none");
            } else {
                setDisplay(r_delete_row, "block");
                if (r_delete_row) {
                    if (window.selected_cells.length > 1) {
                        r_delete_row.innerHTML = "Удалить строки";
                    } else {
                        r_delete_row.innerHTML = "Удалить строку";
                    }
                }
            }
            if(r_delete_col) {
                if (window.selected_cells[0].length > 1) {
                    r_delete_col.innerHTML = "Удалить колонки";
                } else {
                    r_delete_col.innerHTML = "Удалить колонку";
                }
            }
            showContextMenu(e.clientX, e.clientY, right_context_menu);
        }
    }
    table_body.onkeyup = function(e) {
        if (e.code == "KeyC" && ctrl && r_copy) {
            console.log("ctrl c");
            r_copy.dispatchEvent(new Event("mousedown"));
        }
        if (e.code == "KeyX" && ctrl && r_cut) {
            console.log("ctrl x");
            r_cut.dispatchEvent(new Event("mousedown"));
        }
        if (e.code == "KeyV" && ctrl && r_paste) {
            if (copy_cut_array) {
                console.log("ctrl v");
                r_paste.dispatchEvent(new Event("mousedown"));
            }
        }
        if (e.code == "Delete" && r_clear) {
            console.log("delete");
            r_clear.dispatchEvent(new Event("mousedown"));
        }
        ctrl = e.code == "ControlLeft";
    }
}

function setDisplay(option, value) {
    if (option) {
        option.style.display = value;
    }
}

function hasEditableCells() {
    for (let i = 0; i < window.selected_cells.length; i++) {
        for (let j = 0; j < window.selected_cells[i].length; j++) {
            if (window.selected_cells[i][j].hasAttribute("contenteditable") || window.selected_cells[i][j].classList.contains("context_input")) {
                return true;
            }
        }
    }
    return false;
}

function hasDeletableRows() {
    let rows = window.active_table_body.querySelectorAll("tr");
    let count = 0;
    for (let i = 0; i < window.selected_cells.length; i++) {
        let row = getTwoDimArrayIndex(window.active_cells, window.selected_cells[i][0])[0];
        if (rows[row].classList.contains("undeletable")) {
            count++;
        }
    }
    if (count == window.selected_cells.length) { //все строки неудаляемые
        return false;
    }
    return true;
}

function setOptions() {
    if (r_copy) {
        r_copy.onmousedown = function() {
            console.log("r_copy.onmousedown");
            copy_cut_array = getSelectedInners(false);
            onClipboardSuccess();
        }
    }

    if (r_paste) {
        r_paste.onmousedown = function() {
            console.log("r_paste.onmousedown");
            for (let k = 0; k < window.selected_cells.length; k++) {
                if (k > copy_cut_array.length - 1) {
                    break;
                }
                for (let j = 0; j < window.selected_cells[k].length; j++) {
                    if (j > copy_cut_array[k].length - 1) {
                        break;
                    }
                    if (window.selected_cells[k][j].hasAttribute("contenteditable") || window.selected_cells[k][j].classList.contains("context_input")) {
                        window.selected_cells[k][j].innerHTML = copy_cut_array[k][j];
                        window.selected_cells[k][j].dispatchEvent(new Event("beforeinput", { bubbles: true }));
                        window.selected_cells[k][j].dispatchEvent(new Event("input", { bubbles: true })); // чтобы срабатывало инпут при изменении содержимого
                    }
                }
            }
        }
    }

    if (r_cut) {
        r_cut.onmousedown = function() {
            console.log("r_cut.onclick multi");
            copy_cut_array = getSelectedInners(true);
            onClipboardSuccess();
        }
    }

    if (r_clear) {
        r_clear.onmousedown = function() {
            for (let k = 0; k < window.selected_cells.length; k++) {
                for (let j = 0; j < window.selected_cells[k].length; j++) {
                    if (window.selected_cells[k][j].hasAttribute("contenteditable") || window.selected_cells[k][j].classList.contains("context_input")) {
                        window.selected_cells[k][j].innerHTML = "";
                    }
                }
            }
        }
    }

    if (r_row_up) {
        r_row_up.onmousedown = function() {
            let new_row = createNewRow();
            let row = getTwoDimArrayIndex(window.active_cells, window.selected_cells[0][0])[0];
            let ref = window.active_table_body.querySelectorAll("tr")[row];
            ref.parentNode.insertBefore(new_row, ref);
            setTableEngine(window.active_table);
        }
    }

    if (r_row_down) {
        r_row_down.onmousedown = function() {
            let new_row = createNewRow();
            let row = getTwoDimArrayIndex(window.active_cells, window.selected_cells[window.selected_cells.length - 1][0])[0];
            let ref = window.active_table_body.querySelectorAll("tr")[row];
            ref.parentNode.insertBefore(new_row, ref.nextSibling);
            setTableEngine(window.active_table);
        }
    }

    if (r_delete_row) {
        r_delete_row.onmousedown = function() {
            //remove()
            let rows = window.active_table_body.querySelectorAll("tr");
            for (let i = 0; i < window.selected_cells.length; i++) {
                for (let j = 0; j < window.selected_cells[i].length; j++) {
                    let row = getTwoDimArrayIndex(window.active_cells, window.selected_cells[i][j])[0];
                    let rows_num = window.active_table_body.querySelectorAll("tr").length;
                    if (rows_num == 1) {
                        let cells = rows[row].querySelectorAll("td");
                        for (let k = 0; k < cells.length; k++) {
                            cells[k].innerHTML = null;
                        }
                        break;
                    }
                    if (!rows[row].classList.contains("undeletable")) {
                        rows[row].remove();
                    }
                }
            }
            setTableEngine(window.active_table);
        }
    }

    if (r_new_set) {
        r_new_set.onmousedown = function() {
            let [new_penultimate_row, new_last_row] = createNewSet();
            let rows = window.active_table_body.querySelectorAll("tr");
            let ref = window.active_table_body.querySelectorAll("tr")[rows.length - 1];
            ref.parentNode.insertBefore(new_penultimate_row, ref.nextSibling);
            rows = window.active_table_body.querySelectorAll("tr");
            ref = window.active_table_body.querySelectorAll("tr")[rows.length - 1];
            ref.parentNode.insertBefore(new_last_row, ref.nextSibling);
            window.active_table.dispatchEvent(new CustomEvent("context_listener"));
            //addOn2DImitationParamsChangeListeners({ table: window.active_table, update_sets: true });
        }
    }

    if (r_col_right) {
        r_col_right.onmousedown = function() {
            let col = getTwoDimArrayIndex(window.active_cells, window.selected_cells[window.selected_cells.length - 1][0])[1];
            rows = window.active_table_body.querySelectorAll("tr");
            for (let i = 0; i < rows.length; i++) {
                let tds = rows[i].querySelectorAll("td");
                let td;
                if(i % 2 == 0) td = newTd({ contenteditable: true });
                else td = newTd({});
                tds[col].parentNode.insertBefore(td, tds[col].nextSibling);
            }
            let ths = window.active_table_header.querySelectorAll("th:not(.not_res)");
            let th_inner;
            if (col == ths.length - 1) {
                th_inner = parseFloat(ths[col].innerHTML) + 1;
            } else {
                th_inner = (parseFloat(ths[col].innerHTML) + parseFloat(ths[col + 1].innerHTML)) / 2;
            }
            ths[col].parentNode.insertBefore(newTh({ inner: th_inner, contenteditable: true, cl: "double" }), ths[col].nextSibling);
            window.active_table.dispatchEvent(new CustomEvent("context_listener"));
            //addOn2DImitationParamsChangeListeners({ table: window.active_table, update_sets: true });
        }
    }

    if (r_col_left) {
        r_col_left.onmousedown = function() {
            let col = getTwoDimArrayIndex(window.active_cells, window.selected_cells[0][0])[1];
            rows = window.active_table_body.querySelectorAll("tr");
            for (let i = 0; i < rows.length; i++) {
                let tds = rows[i].querySelectorAll("td");
                let td;
                if(i % 2 == 0) td = newTd({ contenteditable: true });
                else td = newTd({});
                tds[col].parentNode.insertBefore(td, tds[col]);
            }
            let ths = window.active_table_header.querySelectorAll("th:not(.not_res)");
            let th_inner;
            if (col == 0) {
                th_inner = parseFloat(ths[col].innerHTML) - 1;
            } else {
                th_inner = (parseFloat(ths[col].innerHTML) + parseFloat(ths[col - 1].innerHTML)) / 2;
            }
            ths[col].parentNode.insertBefore(newTh({ inner: th_inner, contenteditable: true, cl: "double" }), ths[col]);
            window.active_table.dispatchEvent(new CustomEvent("context_listener"));
            //addOn2DImitationParamsChangeListeners({ table: window.active_table, update_sets: true });
        }
    }

    if (r_delete_col) {
        r_delete_col.onmousedown = function() {
            let rows = window.active_table_body.querySelectorAll("tr");
            let ths = window.active_table_header.querySelectorAll("th:not(.not_res)");
            for (let i = 0; i < rows.length; i++) {
                let tds = rows[i].querySelectorAll("td");
                for (let j = 0; j < window.selected_cells[0].length; j++) {
                    let col = getTwoDimArrayIndex(window.active_cells, window.selected_cells[0][j])[1];
                    if(rows[i].querySelectorAll("td").length == 1) {
                        tds[col].innerHTML = null;
                        continue;
                    }
                    if(i == 0) {
                        ths[col].remove();
                    }
                    tds[col].remove();
                }
            }
            window.active_table.dispatchEvent(new CustomEvent("context_listener"));
            //addOn2DImitationParamsChangeListeners({ table: window.active_table, update_sets: true });
        }
    }
}

function setLeftContextMenu(table) { //div.table
    document.documentElement.onclick = function(e) {
        closeAllContext();
        let cell = e.target;
        if (e.target.nodeName != "TD" || !table.contains(cell)) {
            return;
        }
        let col = getTwoDimArrayIndex(window.active_cells, cell)[1];
        if (col == 1) {
            createFieldsContext(cell);
            showContextMenu(e.clientX, e.clientY, left_context_menu);
        } else if (col == 2) {
            createCulturesContext(cell)
            showContextMenu(e.clientX, e.clientY, left_context_menu);
        } else {
            closeAllContext();
        }
    }

    function createCulturesContext(cell) {
        left_context_menu.innerHTML = "";
        let cultures_body_cells = document.querySelectorAll("table.cultures td");
        let cell_cultures = cell.innerHTML.split(", ");
        for (let i = 0; i < cultures_body_cells.length; i++) {
            let li = document.createElement("li");
            li.innerHTML = cultures_body_cells[i].innerHTML;
            if (!left_context_menu.innerHTML.includes(li.innerHTML) && getArrayIndex(cell_cultures, li.innerHTML) == -1) {
                left_context_menu.append(li);
                li.onmousedown = function() {
                    cell.innerHTML = cell.innerHTML == "" ? li.innerHTML : cell.innerHTML + ", " + li.innerHTML;
                }
            }
        }
    }

    function createFieldsContext(cell) {
        left_context_menu.innerHTML = "";
        let fields_body_cells = document.querySelectorAll("table.fields td");
        for (let i = 0; i < fields_body_cells.length; i++) {
            let li = document.createElement("li");
            li.innerHTML = fields_body_cells[i].innerHTML;
            if (!left_context_menu.innerHTML.includes(li.innerHTML)) {
                left_context_menu.append(li);
                li.onmousedown = function() {
                    cell.innerHTML = li.innerHTML;
                }
            }
        }
    }
}

function showContextMenu(x, y, menu) {
    menu.classList.add("active");
    if (y + menu.getBoundingClientRect().height > document.documentElement.clientHeight) {
        y = y - menu.getBoundingClientRect().height - 5;
    }
    if (x + menu.getBoundingClientRect().width > document.documentElement.clientWidth) {
        x = x - menu.getBoundingClientRect().width - 5;
    }
    menu.style.top = (y + 2) + "px";
    menu.style.left = (x + 2) + "px";
}

function closeAllContext() {
    for (let i = 0; i < context_menu.length; i++) {
        context_menu[i].classList.remove("active");
    }
}

function createNewRow() {
    let first_row = window.active_table_body.querySelector("tr");
    let new_row = newTr();
    new_row.innerHTML = first_row.innerHTML;
    let cells = new_row.querySelectorAll("td");
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = null;
    }
    //console.log(new_row);
    return new_row;
}

function createNewSet() {
    let rows = window.active_table_body.querySelectorAll("tr");
    let last_row = rows[rows.length - 1];
    let penultimate_row = rows[rows.length - 2];
    let new_last_row = newTr();
    let new_penultimate_row = newTr();
    new_last_row.innerHTML = last_row.innerHTML;
    new_penultimate_row.innerHTML = penultimate_row.innerHTML;
    let last_cells = new_last_row.querySelectorAll("td");
    let penultimate_cells = new_penultimate_row.querySelectorAll("td");
    for (let i = 0; i < last_cells.length; i++) {
        last_cells[i].innerHTML = null;
        penultimate_cells[i].innerHTML = null;
    }
    return [new_penultimate_row, new_last_row];
}

function getSelectedInners(cut) {
    let array = [];
    for (let k = 0; k < window.selected_cells.length; k++) {
        let row = [];
        for (let j = 0; j < window.selected_cells[k].length; j++) {
            row.push(window.selected_cells[k][j].innerHTML);
            if (cut) {
                if (window.selected_cells[k][j].hasAttribute("contenteditable") || window.selected_cells[k][j].classList.contains("context_input")) {
                    window.selected_cells[k][j].innerHTML = "";
                }
            }
        }
        array.push(row);
    }
    return array;
}

function onClipboardSuccess() {
    window.active_cell_selection.classList.add("transition");
    window.active_cell_selection.classList.add("success");
    setTimeout(function() {
        window.active_cell_selection.classList.remove("success");
    }, 200);
}

function onClipboardError() {
    window.active_cell_selection.classList.add("transition");
    window.active_cell_selection.classList.add("error");
    setTimeout(function() {
        window.active_cell_selection.classList.remove("error");
    }, 200);
}

function getTwoDimArrayIndex(arr, el) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] == el) {
                return [i, j];
            }
        }
    }
    return -1;
}