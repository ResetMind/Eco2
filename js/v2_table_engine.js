function setTableEngine(table) { // div.table
    let table_body_wrapper = table.querySelector("div.table_body_wrapper");
    let table_body = table_body_wrapper.querySelector("table.table_body");
    let table_header = table.querySelector("table.table_header");
    let cells = getCellsArray();
    let ths = table_header.querySelectorAll("th");
    let cell_selection = table.querySelector(".cell_selection");
    let start_pos, end_pos;
    table_body_wrapper.onscroll = function() {
        table_header.style.left = -table_body_wrapper.scrollLeft + "px";
    }

    new ResizeSensor(table_body_wrapper, function() {
        drawCellsRect();
        onColumnResise();
    });

    table_body.onkeydown = function(e) { //!!!!
        if (e.code == "Tab" && document.activeElement.nextElementSibling) {
            if (document.activeElement.nextElementSibling.nodeName == "TD") {
                start_pos = getTwoDimArrayIndex(cells, document.activeElement.nextElementSibling);
                end_pos = start_pos;
                drawCellsRect();
            }
        }
    }

    onCellSelect();
    onColumnResise();

    function onColumnResise() {
        let c = getBordersCoordinates();
        table_header.onmousemove = function(e) {
            let index = getBorder(c, e.clientX + table_body_wrapper.scrollLeft);
            if (index != -1) {
                table_header.style.cursor = "col-resize";
                table_header.onmousedown = function(e) {
                    let font_size = (getComputedStyle(document.documentElement).fontSize).replace("px", "");
                    table_header.onmousemove = null;
                    let start_x = e.clientX;
                    let col_width = ths[index - 1].getBoundingClientRect().width - parseInt(getComputedStyle(ths[index - 1]).paddingLeft) * 2;
                    document.documentElement.onmousemove = function(e) {
                        document.getSelection().removeAllRanges();
                        document.body.style.cursor = "col-resize";
                        let new_col_width = (col_width + e.clientX - start_x) / font_size;
                        if (new_col_width > 1) {
                            ths[index - 1].style.width = new_col_width + "rem";
                            cells[0][index - 1].style.width = new_col_width + "rem";
                            drawCellsRect();
                        }
                    }
                    document.documentElement.onmouseup = function() {
                        document.body.style.cursor = "default";
                        document.documentElement.onmousemove = null;
                        table_header.onmousedown = null;
                        onColumnResise();
                    }
                }
            } else {
                table_header.style.cursor = "default";
                table_header.onmousedown = null;
            }
        }
    }

    function getBorder(c, x) {
        for (let k = 1; k < c.length; k++) {
            if (Math.abs(x - c[k]) <= 2) {
                return k;
            }
        }
        return -1;
    }

    function getBordersCoordinates() {
        let c = [];
        for (let k = 0; k < ths.length; k++) {
            c.push(ths[k].getBoundingClientRect().left + table_body_wrapper.scrollLeft); //5, 100, 195 вне зависимости от горизонтального скрол
        }
        c.push(ths[ths.length - 1].getBoundingClientRect().left + ths[ths.length - 1].getBoundingClientRect().width + table_body_wrapper.scrollLeft);
        return c;
    }

    function onCellSelect() {
        table_body.onmousedown = function(e) {
            if (e.which == 2 || e.target.nodeName != "TD") {
                return false;
            }
            start_pos = getTwoDimArrayIndex(cells, e.target);
            end_pos = start_pos;
            drawCellsRect();
            let slow_width = table_body_wrapper.offsetWidth - table_body_wrapper.clientWidth;
            let slow_height = table_body_wrapper.offsetHeight - table_body_wrapper.clientHeight;
            slow_width = slow_width > 0 ? slow_width : 20;
            slow_height = slow_height > 0 ? slow_height : 20;
            let right_fast = table_body_wrapper.getBoundingClientRect().left + table_body_wrapper.getBoundingClientRect().width;
            let right_slow = right_fast - slow_width;
            let bottom_fast = table_body_wrapper.getBoundingClientRect().top + table_body_wrapper.getBoundingClientRect().height;
            let bottom_slow = bottom_fast - slow_height;
            let left_fast = table_body_wrapper.getBoundingClientRect().left;
            let left_slow = left_fast + slow_width;
            let top_fast = table_body_wrapper.getBoundingClientRect().top;
            let top_slow = top_fast + slow_height;
            let directions = {
                rs: false, //right slow
                rf: false, //right fast
                bs: false, //bottom slow
                bf: false, //bottom fast
                ls: false, //left slow
                lf: false, //left fast
                ts: false, //top slow
                tf: false, //top fast
                end: false
            };
            let scroll_interval = null;
            let table_width = table_body.getBoundingClientRect().width > table_body_wrapper.clientWidth ? table_body_wrapper.clientWidth : table_body.getBoundingClientRect().width;
            let table_right = table_body_wrapper.getBoundingClientRect().left + table_width;
            let table_left = table_body_wrapper.getBoundingClientRect().left;

            let table_height = table_body.getBoundingClientRect().height > table_body_wrapper.clientHeight ? table_body_wrapper.clientHeight : table_body.getBoundingClientRect().height;
            let table_bottom = table_body_wrapper.getBoundingClientRect().top + table_height;
            let table_top = table_body_wrapper.getBoundingClientRect().top;
            /*console.log(table_right + " - table_right; " + table_left + " - table_left");
            console.log(table_top + " - table_top; " + table_bottom + " - table_bottom");*/
            document.onmousemove = function(e) {
                if (e.which == 3) {
                    return;
                }
                document.getSelection().removeAllRanges();
                if (e.target.nodeName == "TD" && getTwoDimArrayIndex(cells, e.target) != -1 && end_pos) {
                    if (e.target !== cells[end_pos[0]][end_pos[1]]) {
                        end_pos = getTwoDimArrayIndex(cells, e.target);
                        drawCellsRect();
                        if (cells[start_pos[0]][start_pos[1]] === document.activeElement) { //чтоб при множественном выделении каретка не мигала ff g
                            cells[start_pos[0]][start_pos[1]].blur();
                        }
                    }
                }
                let directions_clone = {};
                for (let key in directions) {
                    directions_clone[key] = directions[key];
                }
                directions = { rs: false, rf: false, bs: false, bf: false, ls: false, lf: false, ts: false, tf: false, end: false };
                if (e.clientX >= right_slow && e.clientX < right_fast) {
                    directions.rs = true;
                }
                if (e.clientX >= right_fast) {
                    directions.rf = true;
                }
                if (e.clientY >= bottom_slow && e.clientY < bottom_fast) {
                    directions.bs = true;
                }
                if (e.clientY >= bottom_fast) {
                    directions.bf = true;
                }
                if (e.clientX <= left_slow && e.clientX > left_fast) {
                    directions.ls = true;
                }
                if (e.clientX <= left_fast) {
                    directions.lf = true;
                }
                if (e.clientY <= top_slow && e.clientY > top_fast) {
                    directions.ts = true;
                }
                if (e.clientY <= top_fast) {
                    directions.tf = true;
                }
                if (areDirections(directions) || areDirections(directions_clone)) {
                    if (!compareDirections(directions, directions_clone)) { // если направления изменились, чтобы не каждый раз интервал менять, когда двигаешь мышкой
                        clearInterval(scroll_interval);
                        console.log("change");
                        // right-up slow
                        if (directions.rs == true && directions.ts == true) {
                            scroll_interval = scrollOnDrag(-cells[start_pos[0]][start_pos[1]].getBoundingClientRect().height, cells[start_pos[0]][start_pos[1]].getBoundingClientRect().width, "smooth", 250, 1, -1);
                        }
                        // right-up fast
                        else if ((directions.rs == true && directions.tf == true) || (directions.rf == true && (directions.ts == true || directions.tf == true))) {
                            scroll_interval = scrollOnDrag(-cells[start_pos[0]][start_pos[1]].getBoundingClientRect().height * 2, cells[start_pos[0]][start_pos[1]].getBoundingClientRect().width, "auto", 100, 1, -2);
                        }
                        //right-down slow
                        else if (directions.rs == true && directions.bs == true) {
                            scroll_interval = scrollOnDrag(cells[start_pos[0]][start_pos[1]].getBoundingClientRect().height, cells[start_pos[0]][start_pos[1]].getBoundingClientRect().width, "smooth", 250, 1, 1);
                        }
                        //right-down fast
                        else if ((directions.rs == true && directions.bf == true) || (directions.rf == true && (directions.bs == true || directions.bf == true))) {
                            scroll_interval = scrollOnDrag(cells[start_pos[0]][start_pos[1]].getBoundingClientRect().height * 2, cells[start_pos[0]][start_pos[1]].getBoundingClientRect().width, "auto", 100, 1, 2);
                        }
                        //left-down slow
                        else if (directions.ls == true && directions.bs == true) {
                            scroll_interval = scrollOnDrag(cells[start_pos[0]][start_pos[1]].getBoundingClientRect().height, -cells[start_pos[0]][start_pos[1]].getBoundingClientRect().width, "smooth", 250, -1, 1);
                        }
                        //left-down fast
                        else if ((directions.ls == true && directions.bf == true) || (directions.lf == true && (directions.bs == true || directions.bf == true))) {
                            scroll_interval = scrollOnDrag(cells[start_pos[0]][start_pos[1]].getBoundingClientRect().height * 2, -cells[start_pos[0]][start_pos[1]].getBoundingClientRect().width, "auto", 100, -1, 2);
                        }
                        //left-up slow 
                        else if (directions.ls == true && directions.ts == true) {
                            scroll_interval = scrollOnDrag(-cells[start_pos[0]][start_pos[1]].getBoundingClientRect().height, -cells[start_pos[0]][start_pos[1]].getBoundingClientRect().width, "smooth", 250, -1, -1);
                        }
                        //left-up fast
                        else if ((directions.ls == true && directions.tf == true) || (directions.lf == true && (directions.ts == true || directions.tf == true))) {
                            scroll_interval = scrollOnDrag(-cells[start_pos[0]][start_pos[1]].getBoundingClientRect().height * 2, -cells[start_pos[0]][start_pos[1]].getBoundingClientRect().width, "auto", 100, -1, -2);
                        }
                        //right slow
                        else if (directions.rs == true) {
                            scroll_interval = scrollOnDrag(0, cells[start_pos[0]][start_pos[1]].getBoundingClientRect().width, "smooth", 250, 1, 0);
                        }
                        //right fast
                        else if (directions.rf == true) {
                            scroll_interval = scrollOnDrag(0, cells[start_pos[0]][start_pos[1]].getBoundingClientRect().width, "auto", 100, 1, 0);
                        }
                        //down slow
                        else if (directions.bs == true) {
                            scroll_interval = scrollOnDrag(cells[start_pos[0]][start_pos[1]].getBoundingClientRect().height, 0, "smooth", 250, 0, 1);
                        }
                        //down fast
                        else if (directions.bf == true) {
                            scroll_interval = scrollOnDrag(cells[start_pos[0]][start_pos[1]].getBoundingClientRect().height * 2, 0, "auto", 100, 0, 2);
                        }
                        //left slow
                        else if (directions.ls == true) {
                            scroll_interval = scrollOnDrag(0, -cells[start_pos[0]][start_pos[1]].getBoundingClientRect().width, "smooth", 250, -1, 0);
                        }
                        //left fast
                        else if (directions.lf == true) {
                            scroll_interval = scrollOnDrag(0, -cells[start_pos[0]][start_pos[1]].getBoundingClientRect().width, "auto", 100, -1, 0);
                        }
                        //up slow
                        else if (directions.ts == true) {
                            scroll_interval = scrollOnDrag(-cells[start_pos[0]][start_pos[1]].getBoundingClientRect().height, 0, "smooth", 250, 0, -1);
                        }
                        //up fast
                        else if (directions.tf == true) {
                            scroll_interval = scrollOnDrag(-cells[start_pos[0]][start_pos[1]].getBoundingClientRect().height * 2, 0, "auto", 100, 0, -2);
                        }
                    }
                }
                let cell = null;

                if ((e.clientX >= right_slow && e.clientY > top_slow && e.clientY < bottom_slow) || e.clientX > table_right) {
                    cell = document.elementFromPoint(table_right - 5, e.clientY);
                } else if ((e.clientY <= top_slow && e.clientX < right_slow && e.clientX > left_slow) || e.clientY < table_top) {
                    cell = document.elementFromPoint(e.clientX, table_top + 5);
                } else if ((e.clientX <= left_slow && e.clientY > top_slow && e.clientY < bottom_slow) || e.clientX < table_left) {
                    cell = document.elementFromPoint(table_left + 5, e.clientY);
                } else if ((e.clientY >= bottom_slow && e.clientX < right_slow && e.clientX > left_slow) || e.clientY > table_bottom) {
                    cell = document.elementFromPoint(e.clientX, table_bottom - 5);
                }
                if (cell) {
                    if (cell.nodeName == "TD") {
                        end_pos = getTwoDimArrayIndex(cells, cell);
                        if (end_pos != -1) {
                            drawCellsRect();
                        }
                    }
                }
            }

            document.onmouseup = function() {
                clearInterval(scroll_interval);
                cells[start_pos[0]][start_pos[1]].onselectstart = null;
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }

        function scrollOnDrag(top, left, behavior, delay, step_col, step_row) {
            function scroll() {
                let scrolled_height1 = Math.ceil(table_body_wrapper.scrollHeight - table_body_wrapper.scrollTop);
                let scrolled_height2 = Math.round(table_body_wrapper.scrollHeight - table_body_wrapper.scrollTop)
                if (((scrolled_height1 == table_body_wrapper.clientHeight || scrolled_height2 == table_body_wrapper.clientHeight) && top) > 0 || (table_body_wrapper.scrollTop == 0 && top < 0)) {
                    top = 0;
                }
                if ((table_body_wrapper.offsetWidth + table_body_wrapper.scrollLeft >= table_body_wrapper.scrollWidth && left > 0) || (table_body_wrapper.scrollLeft == 0 && left < 0)) {
                    left = 0;
                }
                if (top != 0 || left != 0) {
                    end_pos[0] += step_row;
                    end_pos[1] += step_col;
                    end_pos[0] = end_pos[0] < 0 ? 0 : end_pos[0];
                    end_pos[1] = end_pos[1] < 0 ? 0 : end_pos[1];
                    end_pos[0] = end_pos[0] >= cells.length ? cells.length - 1 : end_pos[0];
                    end_pos[1] = end_pos[1] >= cells[0].length ? cells[0].length - 1 : end_pos[1];
                    left = step_col * cells[end_pos[0]][end_pos[1]].getBoundingClientRect().width; //если ширинв колонок разная
                    drawCellsRect();
                    table_body_wrapper.scrollBy({
                        top: top,
                        left: left,
                        behavior: behavior
                    });
                }
            };
            return setInterval(scroll, delay);
        }

        function compareDirections(dir, dir_clone) {
            for (let key in dir) {
                if (dir[key] != dir_clone[key]) {
                    return false;
                }
            }
            return true;
        }

        function areDirections(dir) {
            for (let key in dir) {
                if (dir[key] == true) {
                    return true;
                }
            }
            return false;
        }
    }

    function drawCellsRect() {
        if (start_pos && end_pos) {
            let min_row = Math.min(start_pos[0], end_pos[0]);
            let min_col = Math.min(start_pos[1], end_pos[1]);
            let max_row = Math.max(start_pos[0], end_pos[0]);
            let max_col = Math.max(start_pos[1], end_pos[1]);
            let start = cells[min_row][min_col];
            let end = cells[max_row][max_col];
            cell_selection.style.top = start.getBoundingClientRect().top + table_body_wrapper.scrollTop - table_body_wrapper.getBoundingClientRect().top + "px";
            cell_selection.style.left = start.getBoundingClientRect().left + table_body_wrapper.scrollLeft - table_body_wrapper.getBoundingClientRect().left + "px";
            cell_selection.style.width = end.getBoundingClientRect().left - start.getBoundingClientRect().left + end.getBoundingClientRect().width + "px";
            cell_selection.style.height = end.getBoundingClientRect().top - start.getBoundingClientRect().top + end.getBoundingClientRect().height + "px";
            cell_selection.classList.add("active");
        }
    }

    function getCellsArray() {
        let cells = [];
        let rows = table_body.querySelectorAll("tr");
        for (let i = 0; i < rows.length; i++) {
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