let wrapper = document.querySelectorAll(".wrapper");
let radios = document.querySelectorAll(".tabs input[type=\"radio\"]");
let table = document.querySelectorAll("div.table");
let bd_e_preloader = document.querySelector(".preloader span.bd_e");
let dropdown_button = document.querySelector("a.dropdown_button");
let dropdown_content = document.querySelector("ul.dropdown_content");
let save_button = dropdown_content.querySelector("a.save_button");
let popup = document.querySelector("div.popup");
let map_div = document.querySelector("div.map_div");
let map = map_div.querySelector("#map");
let map_button = document.querySelector("span.map_button");
let select_param = map_div.querySelector("select.select_param");
let select_culture = map_div.querySelector("select.select_culture");
let year_slider = map_div.querySelector("input.year_slider");
let year_span = map_div.querySelector("span.year_span");
let ymap = null;

doRequest();

wrapper[0].style.display = "none";
wrapper[1].style.display = "flex";

dropdown_button.onmousedown = function() {
    dropdown_content.classList.toggle("active");
}

dropdown_content.onclick = function() {
    dropdown_content.classList.remove("active");
}

map_button.onclick = function() {
    console.log(map)
    if (map_div.style.display == "none" || map_div.style.display == "") {
        showMap();
    } else {
        fadeOut(map_div);
        map.innerHTML = "";
    }
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
        console.log(array)
        return JSON.stringify(array);
    }

    function getTime() {
        let date = new Date();
        let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        return h + ":" + m;
    }
}

function showMap() {
    let xhr = JSONRequest("php/forecast.php", JSON.stringify({ "step": "0", "field_name": "", "forecast": "" }));
    xhr.onload = function() {
        if (xhr.status != 200) {
            console.log(xhr.status);
        } else {
            console.log(xhr.response);
            if (xhr.response == null) return;
            if (xhr.response.forecast_result.length == 0) return;
            let forecast_result = xhr.response.forecast_result;
            for (let i = 0; i < forecast_result.length; i++) {
                let forecast = JSON.parse(forecast_result[i]["forecast"]);
                forecast_result[i]["forecast"] = forecast;
            }
            console.log("forecast_result");
            console.log(forecast_result);
            let [cultures, years] = getAllCulturesAndYears(forecast_result);
            if (cultures.length == 0 || years.length == 0) return;
            addOptions(select_culture, cultures);


            year_slider.max = years.max();
            year_slider.min = years.min();
            year_slider.value = year_slider.max;
            year_slider.dispatchEvent(new Event("input"));
            let c_index = select_culture.selectedIndex;
            let c = select_culture[c_index].text;
            let p_index = select_param.selectedIndex;
            let p = select_param[p_index].text;
            let y = year_slider.value;

            map.innerHTML = "";
            updateMap(forecast_result);
            select_param.onchange = function() {
                updateMap(forecast_result);
            }
            select_culture.onchange = function() {
                updateMap(forecast_result);
            }
            year_slider.oninput = function() {
                year_span.innerHTML = this.value;
                updateMap(forecast_result);
            }
            fadeIn(map_div, 1, "flex");
        }
    }

    function updateMap(forecast_result) {
        let c_index = select_culture.selectedIndex;
        let c = select_culture[c_index].text;
        let p_index = select_param.selectedIndex;
        let p = select_param[p_index].text;
        let y = year_slider.value;
        let [cadastral, coordinates, owner] = getFieldTable();
        let results = {};
        for (let j = 0; j < cadastral.length; j++) {
            results[cadastral[j]] = {};
            results[cadastral[j]]["coordinates"] = coordinates[j];
            results[cadastral[j]]["owner"] = owner[j];
            results[cadastral[j]]["color"] = "#dbdbdb";
            for (let i = 0; i < forecast_result.length; i++) {
                if (cadastral[j] != forecast_result[i]["field"]) continue;
                for (let culture in forecast_result[i]["forecast"]) {
                    if (culture != c) continue;
                    for (let param in forecast_result[i]["forecast"][culture]) {
                        if (param != p) continue;
                        for (let year in forecast_result[i]["forecast"][culture][param]) {
                            if (year != y) continue;
                            let border = 0;
                            results[cadastral[j]]["forecast"] = forecast_result[i]["forecast"][culture][param][year];
                            if (select_param[p_index].text == "X17") {
                                border = 5.23;
                            } else if (select_param[p_index].text == "X26") {
                                border = 1.11;
                            } else if (select_param[p_index].text == "X32") {
                                border = 1.86;
                            }
                            if (results[cadastral[j]]["forecast"] > border) {
                                results[cadastral[j]]["color"] = "#ff0000";
                            } else {
                                results[cadastral[j]]["color"] = "#00ff00";
                            }
                        }
                    }
                }
            }
        }
        //console.log(results);

        ymaps.ready(init);

        function init() {
            try {
                ymap.destroy();
            } catch (e) {}
            ymap = new ymaps.Map("map", {
                center: [52.426735, 41.503023],
                zoom: 7
            });
            ymap.container.fitToViewport();

            for (let key in results) {
                let coordinates = results[key]["coordinates"].split(", ");
                let coef = results[key]["forecast"] ? results[key]["forecast"] : "?";
                let placemark = new ymaps.Placemark(coordinates, {
                    balloonContent: key + ": " + coef
                }, {
                    preset: "islands#circleIcon",
                    iconColor: results[key]["color"]
                })
                ymap.geoObjects.add(placemark);
            }
        }
    }

    function addOptions(select, data) {
        select.innerHTML = "";
        for (let k = 0; k < data.length; k++) {
            let option = document.createElement("option");
            option.value = k;
            option.innerHTML = data[k];
            select.append(option);
        }
    }

    function getAllCulturesAndYears(forecast_result) {
        let cultures = [];
        let years = [];
        for (let i = 0; i < forecast_result.length; i++) {
            for (let culture in forecast_result[i]["forecast"]) {
                if (getArrayIndex(cultures, culture) == -1) cultures.push(culture);
                for (let param in forecast_result[i]["forecast"][culture]) {
                    for (let year in forecast_result[i]["forecast"][culture][param]) {
                        if (getArrayIndex(years, year) == -1) years.push(year);
                    }
                }
            }
        }
        console.log("allcultures");
        console.log(cultures)
        console.log("allyears");
        console.log(years)
        return [cultures, years];
    }

    function getFieldTable() {
        let table_body = table[1].querySelector("table.table_body");
        let rows = table_body.querySelectorAll("tr");
        let cadastral = [],
            coordinates = [],
            owner = [];
        for (let i = 0; i < rows.length; i++) {
            let tds = rows[i].querySelectorAll("td");
            cadastral.push(tds[0].innerHTML);
            coordinates.push(tds[1].innerHTML);
            owner.push(tds[2].innerHTML);
        }
        return [cadastral, coordinates, owner];
    }
}