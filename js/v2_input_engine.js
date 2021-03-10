function setInputEngine(table) {
    let table_body = table.querySelector("table.table_body");
    table_body.oninput = checkValue.bind(null, table);
    
    /*table_body.addEventListener("beforeinput", function(e) {
        console.log("before " + e.target.innerHTML);
    });*/
}

function checkValue(table) {
    let e = window.event;
    let cell = e.target;
    if (cell.nodeName != "TD") {
        return;
    }
    //console.log(cell.innerHTML + " changed ");
    let table_header = table.querySelectorAll("table.table_header th");
    let col = getTwoDimArrayIndex(window.active_cells, cell)[1];
    let type = table_header[col].className;
    if (type == "field") {
        let fields_body_cells = document.querySelectorAll("table.fields td");
        let cells_inners = getCellsInners(fields_body_cells);
        console.log(cells_inners);
        if (getArrayIndex(cells_inners, cell.innerHTML) == -1) {
            onInputError(cell, true);
            cell.innerHTML = "";
        }
    } else if (type == "culture") {
        let cultures_body_cells = document.querySelectorAll("table.cultures td");
        let cells_inners = getCellsInners(cultures_body_cells);
        let cultures = cell.innerHTML.split(", ");
        for (let k = 0; k < cultures.length; k++) {
            if (getArrayIndex(cells_inners, cultures[k]) == -1) {
                onInputError(cell, true);
                cell.innerHTML = "";
            }
        }
    } else if(type == "int") {
        if (isNaN(parseInt(+cell.innerHTML)) || cell.innerHTML.split(".").length > 1) {
            onInputError(cell);
        } else {
            removeError(cell);
        }
    } else if(type == "double") {
        if (isNaN(parseFloat(+e.target.innerHTML))) {
            onInputError(cell);
        } else {
            removeError(cell);
        }
    }
}

function onInputError(cell, remove) {
    cell.classList.add("transition");
    cell.classList.add("error");
    if(remove) {
        setTimeout(function() {
            cell.classList.remove("error");
        }, 200);
    }
}

function removeError(cell) {
    cell.classList.remove("error");
}

function getCellsInners(cells) {
    let array = [];
    for (let k = 0; k < cells.length; k++) {
        array.push(cells[k].innerHTML);
    }
    return array;
}