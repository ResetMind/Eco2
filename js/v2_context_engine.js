let r_copy = document.querySelector("li.r_copy");
let r_paste = document.querySelector("li.r_paste");
let r_cut = document.querySelector("li.r_сut");
let r_clear = document.querySelector("li.r_clear");
let r_row_up = document.querySelector("li.r_row_up");
let r_row_down = document.querySelector("li.r_row_down");
let r_delete_row = document.querySelector("li.r_delete_row");
let right_context_menu = document.querySelector("ul.right_context_menu");
let left_context_menu = document.querySelector("ul.left_context_menu");
let context_menu = document.querySelectorAll("ul.context_menu");
let copy_cut_array;
let ctrl = false;

window.onresize = function() {
    closeAllContext();
}

document.body.onmousedown = function() {
    closeAllContext();
}

r_copy.onmousedown = function() {
    console.log("r_copy.onmousedown");
    copy_cut_array = getSelectedInners(false);
    onClipboardSuccess();
}

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
            window.selected_cells[k][j].innerHTML = copy_cut_array[k][j];
            //selected_tds[k][j].dispatchEvent(new Event("input", { bubbles: true })); // чтобы срабатывало инпут при изменении содержимого
        }
    }
}

r_cut.onmousedown = function() {
    console.log("r_cut.onclick multi");
    copy_cut_array = getSelectedInners(true);
    onClipboardSuccess();
}

r_clear.onmousedown = function() {
    for (let k = 0; k < window.selected_cells.length; k++) {
        for (let j = 0; j < window.selected_cells[k].length; j++) {
            window.selected_cells[k][j].innerHTML = "";
        }
    }
}

r_row_up.onmousedown = function() {
    let new_row = createNewRow();
    let row = getTwoDimArrayIndex(window.active_cells, window.selected_cells[0][0])[0];
    let ref = window.active_table_body.querySelectorAll("tr")[row];
    ref.parentNode.insertBefore(new_row, ref);
    setTableEngine(window.active_table);
}

r_row_down.onmousedown = function() {
    let new_row = createNewRow();
    let row = getTwoDimArrayIndex(window.active_cells, window.selected_cells[window.selected_cells.length - 1][0])[0];
    let ref = window.active_table_body.querySelectorAll("tr")[row];
    ref.parentNode.insertBefore(new_row, ref.nextSibling);
    setTableEngine(window.active_table);
}

function createNewRow() {
    let first_row = window.active_table_body.querySelector("tr");
    let new_row = document.createElement("tr");
    new_row.innerHTML = first_row.innerHTML;
    let cells = new_row.querySelectorAll("td");
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = null;
    }
    console.log(new_row);
    return new_row;
}

r_delete_row.onmousedown = function() {
    //remove()
    let rows = window.active_table_body.querySelectorAll("tr");
    for (let i = 0; i < window.selected_cells.length; i++) {
        for (let j = 0; j < window.selected_cells[i].length; j++) {
            let row = getTwoDimArrayIndex(window.active_cells, window.selected_cells[i][j])[0];
            let rows_num = window.active_table_body.querySelectorAll("tr").length;
            if (rows_num == 1) {
                let cells = rows[row].querySelectorAll("td");
                for (let i = 0; i < cells.length; i++) {
                    cells[i].innerHTML = null;
                }
                break;
            }
            rows[row].remove();
        }
    }
    setTableEngine(window.active_table);
}

function setRightContextMenu(table) { //div.table
    let table_body = table.querySelector("table.table_body");
    table_body.oncontextmenu = function(e) {
        if (e.target.nodeName == "TD") {
            e.preventDefault();
            closeAllContext();
            if (window.selected_cells.length > 1) {
                r_delete_row.innerHTML = "Удалить строки";
            } else {
                r_delete_row.innerHTML = "Удалить строку";
            }
            if (!copy_cut_array) {
                r_paste.style.display = "none";
            } else {
                r_paste.style.display = "block";
            }
            showContextMenu(e.clientX, e.clientY, right_context_menu);
        }
    }
    table_body.onkeyup = function(e) {
        if (e.code == "KeyC" && ctrl) {
            console.log("ctrl c");
            r_copy.dispatchEvent(new Event("mousedown"));
        }
        if (e.code == "KeyX" && ctrl) {
            console.log("ctrl x");
            r_cut.dispatchEvent(new Event("mousedown"));
        }
        if (e.code == "KeyV" && ctrl) {
            if (copy_cut_array) {
                console.log("ctrl v");
                r_paste.dispatchEvent(new Event("mousedown"));
            }
        }
        if (e.code == "Delete") {
            console.log("delete");
            r_clear.dispatchEvent(new Event("mousedown"));
        }
        ctrl = e.code == "ControlLeft";
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

function getSelectedInners(cut) {
    let array = [];
    for (let k = 0; k < window.selected_cells.length; k++) {
        let row = [];
        for (let j = 0; j < window.selected_cells[k].length; j++) {
            row.push(window.selected_cells[k][j].innerHTML);
            if (cut) {
                window.selected_cells[k][j].innerHTML = "";
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