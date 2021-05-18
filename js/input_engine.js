document.body.addEventListener("mousedown", function() {
    removeErrorCells();
});

function setInputEngine(table) {
    let table_body = table.querySelector("table.table_body");
    table_body.oninput = checkValue.bind(null, table);
}
function checkValue(table) {
    let e = window.event;
    let cell = e.target;
    if (cell.nodeName != "TD") {
        return;
    }
    //console.log(cell.innerHTML + " changed ");
    let table_header = table.querySelectorAll("table.table_header th:not(.not_res)");
    let col = getTwoDimArrayIndex(window.active_cells, cell)[1];
    let type = table_header[col].className;
    if (type == "field") {
        let fields_body_cells = document.querySelectorAll("table.fields td");
        let cells_inners = getCellsInners(fields_body_cells);
        if (getArrayIndex(cells_inners, cell.innerHTML) == -1) {
            onInputError(cell);
        }
    } else if (type == "culture") {
        let cultures_body_cells = document.querySelectorAll("table.cultures td");
        let cells_inners = getCellsInners(cultures_body_cells);
        let cultures = cell.innerHTML.split(", ");
        for (let k = 0; k < cultures.length; k++) {
            if (getArrayIndex(cells_inners, cultures[k]) == -1) {
                onInputError(cell);
            }
        }
    } else if(type == "int") {
        if (isNaN(parseInt(+cell.innerHTML)) || cell.innerHTML.split(".").length > 1) {
            onInputError(cell);
        } else {
            removeError(cell);
        }
    } else if(type == "double") {
        if (isNaN(parseFloat(+cell.innerHTML))) {
            onInputError(cell);
        } else {
            removeError(cell);
        }
    }
    console.log("dispatchEvent of window.active_table from checkValue")
    console.log(window.active_table)
    //window.active_table.dispatchEvent(new CustomEvent("change_listener"));
    $(window.active_table).trigger("change_listener");
}

function onInputError(cell) {
    cell.classList.add("transition");
    cell.classList.add("error");
}

function removeError(cell) {
    if(cell.classList.contains("error")) {
        cell.classList.remove("error");
        return true;
    }
}

function getCellsInners(cells) {
    let array = [];
    for (let k = 0; k < cells.length; k++) {
        array.push(cells[k].innerHTML);
    }
    return array;
}

function removeErrorCells() {
    if (!window.active_cells) {
        return;
    }
    for (let k = 0; k < window.active_cells.length; k++) {
        for (let j = 0; j < window.active_cells[k].length; j++) {
            if (removeError(window.active_cells[k][j])) {
                window.active_cells[k][j].innerHTML = "";
            }
        }
    }
    
    //window.active_table.dispatchEvent(new CustomEvent("change_listener"));
}