let wrapper = document.querySelectorAll(".wrapper");
let radios = document.querySelectorAll(".tabs input[type=\"radio\"]");
let table = document.querySelectorAll("div.table");
let bd_e_preloader = document.querySelector(".preloader span.bd_e");
let dropdown_button = document.querySelector("a.dropdown_button");
let dropdown_content = document.querySelector("ul.dropdown_content");
let save_button = dropdown_content.querySelector("a.save_button");
let popup = document.querySelector("div.popup");

doRequest();

dropdown_button.onmousedown = function() {
    dropdown_content.classList.toggle("active");
}

dropdown_content.onclick = function() {
    dropdown_content.classList.remove("active");
}

function onRadioChange() {
    for (let i = 0; i < radios.length; i++) {
        radios[i].addEventListener("change", function() {
            wrapper.forEach(elem => { elem.style.display = "none"; });
            wrapper[i].style.display = "flex";
        });
    }
}

function doRequest() { // +
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
                onRadioChange();
            }
            fillTable(table[0], xhr.response.factors_rows);
            fillTable(table[1], xhr.response.fields_rows);
            fillTable(table[2], xhr.response.cultures_rows);
            setTableEngine(table[0]);
            setTableEngine(table[1]);
            setTableEngine(table[2]);
            setRightContextMenu(table[0]);
            setRightContextMenu(table[1]);
            setRightContextMenu(table[2]);
            setLeftContextMenu(table[0]);
            setInputEngine(table[0]);
            setInputEngine(table[1]);
            setInputEngine(table[2]);
        }
    }

    function fillTable(table, data) { // +
        let table_body = table.querySelector("table.table_body");
        for (let k = 0; k < data.length; k++) {
            let rows = table_body.querySelectorAll("tr");
            if (rows.length < k + 1) {
                let new_row = createNewRow(table_body);
                let ref = rows[rows.length - 1];
                ref.parentNode.insertBefore(new_row, ref.nextSibling);
            }
            rows = table_body.querySelectorAll("tr");
            let cells = rows[rows.length - 1].querySelectorAll("td");
            let j = 0;
            for (let key in data[k]) {
                cells[j].innerHTML = data[k][key];
                j++;
            }
        }

        function createNewRow(table_body) { // +
            let first_row = table_body.querySelector("tr");
            let new_row = document.createElement("tr");
            new_row.innerHTML = first_row.innerHTML;
            return new_row;
        }
    }
}

save_button.onclick = function() {
    saveTable(table[0], "factors");
    saveTable(table[1], "fields");
    saveTable(table[2], "cultures");
}

function saveTable(table, name) {
    let table_body = table.querySelector("table.table_body");
    let json = getJSONTable();
    let xhr = JSONRequest("php/save_table.php", json);
    xhr.onload = function() {
        if (xhr.status != 200) {
            console.log(xhr.status);
            return;
        } else {
            console.log(xhr.response);
            if (xhr.response == null) {
                return;
            }
            if (!checkBdServer(xhr, null)) {
                showPopup(popup, "Ошибка сохранения таблиц", true);
            } else {
                showPopup(popup, "Сохранено в " + getTime(), false);
            }
        }
    }

    function getJSONTable() {
        let array = { name: name };
        let rows = table_body.querySelectorAll("tr");
        for (let k = 0; k < rows.length; k++) {
            let cells = rows[k].querySelectorAll("td");
            let row_length = cells.length;
            let row = {};
            for (let j = 0; j < row_length; j++) {
                row["col" + j] = cells[j].innerHTML;
            }
            array["row" + k] = row;
        }
        return JSON.stringify(array);
    }

    function getTime() {
        let date = new Date();
        let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        return h + ":" + m;
    }
}