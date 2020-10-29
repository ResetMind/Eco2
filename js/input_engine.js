function checkValue(e) {
    let col = getColRow(arrayIndex(tds, e.target), ths.length)[0];
    console.log(e.target.innerHTML + " changed " + col);
    let pre = document.createElement("pre");
    pre.innerHTML = e.target.innerText;
    e.target.innerHTML = pre.innerText;
    if(selected_content_i == 0) {
        if(col == 1) {
            closeAllContext();
            let tds = table_body[2].querySelectorAll("td");
            tds = getTdsInners(tds);
            let cultures = e.target.innerHTML.split(", ");
            for(let k = 0; k < cultures.length; k++) {
                if(arrayIndex(tds, cultures[k]) == -1) {
                    //console.log("culture error");
                    showErrorBorder();
                    showErrorTD(e.target);
                    return;
                }
            }
        } else if(col == 2) {
            closeAllContext();
            let tds = table_body[2].querySelectorAll("td");
            tds = getTdsInners(tds);
            if(arrayIndex(tds, e.target.innerHTML) == -1) {
                //console.log("field error");
                showErrorBorder();
                showErrorTD(e.target);
                return;
            }
        } else if(col == 3 || col == 8) {
            if(isNaN(parseFloat(+e.target.innerHTML))) {
                showErrorBorder();
                showErrorTD(e.target);
                return;
            }
        } else {
            if(isNaN(parseInt(+e.target.innerHTML)) || e.target.innerHTML.split(".").length > 1) {
                showErrorBorder();
                showErrorTD(e.target);
                return;
            }
        }
        removeErrorBorder();
        removeErrorTD(e.target);
    }
}

function showErrorBorder() {
    if(!td_selection[selected_content_i].classList.contains("error")) {
        td_selection[selected_content_i].classList.add("error");
    }
}

function removeErrorBorder() {
    if(td_selection[selected_content_i].classList.contains("error")) {
        td_selection[selected_content_i].classList.remove("error");
    }
}

function showErrorTD(td) {
    if(!td.classList.contains("error")) {
        td.classList.add("error");
    }
}

function removeErrorTD(td) {
    if(td.classList.contains("error")) {
        td.classList.remove("error");
        return true;
    }
    return false;
}

function removeErrorTDS(selected_tds) {
    if(selected_tds == null) {
        return;
    }
    for(let k = 0; k < selected_tds.length; k++) {
        for(let j = 0; j < selected_tds[k].length; j++) {
            if(removeErrorTD(selected_tds[k][j])) {
                selected_tds[k][j].innerHTML = "";
            }
        }
    }
    removeErrorBorder();
}

function getTdsInners(tds) {
    let array = [];
    for(let k = 0; k < tds.length; k++) {
        array.push(tds[k].innerHTML);
    }
    return array;
}