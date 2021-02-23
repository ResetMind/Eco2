function setTableEngine(table) { // div.table
    let table_body_wrapper = table.querySelector("div.table_body_wrapper");
    let table_body = table_body_wrapper.querySelector("table.table_body");
    let table_header = table.querySelector("table.table_header");
    let cells = getCellsArray();
    let cell_selection = table.querySelector(".cell_selection");
    let start_pos, end_pos;
    table_body_wrapper.onscroll = function() {
        table_header.style.left = -table_body_wrapper.scrollLeft + "px";
        console.log(start_pos);
        console.log(end_pos);
    }

    window.onresize = function() {
        console.log(start_pos);
        console.log(end_pos);
        if(start_pos != undefined  && end_pos != undefined ) {
            drawCellsRect(start_pos, end_pos);
            console.log("resize");
        }
    }

    onCellSelect();

    function onCellSelect() {
        table_body.onmousedown = function(e) {
            if (e.which == 2 || e.target.nodeName != "TD") {
                return false;
            }
            start_pos = getTwoDimArrayIndex(cells, e.target);
            end_pos = start_pos;
            drawCellsRect(start_pos, end_pos);
            document.onmousemove = function(e) {
                if (e.which == 3) {
                    return;
                }

            }

        }
    }

    function drawCellsRect() {
        let start = cells[start_pos[0]][start_pos[1]];
        let end = cells[end_pos[0]][end_pos[1]];
        cell_selection.style.top = start.getBoundingClientRect().top + table_body_wrapper.scrollTop - table_body_wrapper.getBoundingClientRect().top + "px";
        cell_selection.style.left = start.getBoundingClientRect().left + table_body_wrapper.scrollLeft - table_body_wrapper.getBoundingClientRect().left + "px";
        cell_selection.style.width = start.getBoundingClientRect().width + "px";
        cell_selection.style.height = start.getBoundingClientRect().height + "px";
        cell_selection.classList.add("active");
    }

    function getCellsArray() {
        let cells = [];
        let rows = table_body.querySelectorAll("tr");
        for(let i = 0; i < rows.length; i++) {
            cells.push(rows[i].querySelectorAll("td"));
        }
        return cells;
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
}