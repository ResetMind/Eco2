let bd_e_preloader = document.querySelector(".bd_e_preloader");
let save_button = document.querySelector(".save_button");
let span_footer = document.querySelector(".span_footer");

document.addEventListener("DOMContentLoaded", () => {
    save_button.onclick = saveTables;
    doRequest();
});

function doRequest() {
    let xhr = request("php/home.php", null);
    xhr.onload = function() {
        if (xhr.status != 200) {
            console.log(xhr.status);
        } else {
            console.log(xhr.response);
            if (xhr.response == null) return;
            if (!checkBdServer(xhr, bd_e_preloader)) {
                return;
            }
            if (!checkAccessServer(xhr)) {
                window.location.href = "login.html?access=false";
                return;
            } else {
                fadeOut(document.querySelector(".preloader"));
            }
            fillTable(0, xhr.response.factors_rows);
            fillTable(1, xhr.response.fields_rows);
            fillTable(2, xhr.response.cultures_rows);
            //checkTablesServer(xhr, span_footer);
        }
    }
}

function fillTable(index, data) {
    for (let k = 0; k < data.length; k++) {
        let trs = table_body[index].querySelectorAll("tr");
        if (trs.length < k + 1) {
            let new_tr = createNewRow(index);
            let ref = trs[trs.length - 1];
            ref.parentNode.insertBefore(new_tr, ref.nextSibling);
        }
        trs = table_body[index].querySelectorAll("tr");
        let tds = trs[trs.length - 1].querySelectorAll("td");
        let j = 0;
        for (let key in data[k]) {
            tds[j].innerHTML = data[k][key];
            j++;
        }
    }
    setTableEngine(index);
}

function saveTables() {
    saveTable(table_body[0], "factors", 0);
    saveTable(table_body[1], "fields", 1);
    saveTable(table_body[2], "cultures", 1);
}

function getTime() {
    let date = new Date();
    let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return h + ":" + m;
}

function saveTable(body, name, start_col) {
    let json = getJSONTable();
    let xhr = JSONRequest("php/save_table.php", json);
    xhr.onload = function() {
        if (xhr.status != 200) {
            console.log(xhr.status);
        } else {
            console.log(xhr.response);
            if (xhr.response == null) return;
            if (!checkBdServerHome(xhr)) {
                showText(span_footer, xhr.response.bd_e[0], true);    
            } else {
                showText(span_footer, "Сохранено " + getTime(), false);
            }
        }
    }

    function getJSONTable() {
        let array = { name: name };
        let rows = body.querySelectorAll("tr");
        for (let k = 0; k < rows.length; k++) {
            let tds = rows[k].querySelectorAll("td");
            let row_length = tds.length;
            let row = {};
            for (let j = start_col; j < row_length; j++) {
                row["col" + j] = tds[j].innerHTML;
            }
            array["row" + k] = row;
        }
        return JSON.stringify(array);
    }
}