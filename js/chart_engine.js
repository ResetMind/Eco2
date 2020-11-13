function add2DChart(plotly_div, data, form, span_chart_info, chart_restangles, chart_settings) {
    let x_col = parseFloat(form.x_select_param.value);
    let x_index = form.x_select_param.selectedIndex;
    let x_text = form.x_select_param[x_index].text;

    let cx_index = form.x_select_culture.selectedIndex;
    let cx_row = form.x_select_culture.value;
    let cx_text = cx_index > 1 ? form.x_select_culture[cx_index].text : "";

    let fx_row = form.x_select_field.value;
    let fx_index = form.x_select_field.selectedIndex;
    let fx_text = fx_index > 1 ? form.x_select_field[fx_index].text : "";

    let y_col = parseFloat(form.y_select_param.value);
    let y_index = form.y_select_param.selectedIndex;
    let y_text = form.y_select_param[y_index].text;

    let cy_index = form.y_select_culture.selectedIndex;
    let cy_row = form.y_select_culture.value;
    let cy_text = cy_index > 1 ? form.y_select_culture[cy_index].text : "";

    let fy_row = form.y_select_field.value;
    let fy_index = form.y_select_field.selectedIndex;
    let fy_text = fy_index > 1 ? form.y_select_field[fy_index].text : "";

    if (isNaN(x_col) || isNaN(y_col)) {
        span_chart_info.innerHTML = "Не выбраны параметры";
        return;
    }
    let x_arr = [],
        y_arr = [],
        year_arr = [];
    let trs = table_body_main.querySelectorAll("tr");
    for (let i = 0; i < trs.length; i++) {
        let tds = trs[i].querySelectorAll("td");
        let x = parseFloat(tds[x_col].innerHTML);
        let c = tds[1].innerHTML;
        let f = tds[2].innerHTML;
        if (isNaN(x) || c.indexOf(cx_text) == -1 || f.indexOf(fx_text) == -1) {
            continue;
        }
        x_arr.push(x);
        year_arr.push(tds[0].innerHTML);
        //console.log("year: " + tds[0].innerHTML + " row: " + i + " x: " + x + " c: " + cx_text + " f: " + fx_text);

        let y = parseFloat(tds[y_col].innerHTML);
        if (isNaN(y) || c.indexOf(cy_text) == -1 || f.indexOf(fy_text) == -1) {
            y_arr.push(null);
        } else {
            y_arr.push(y);
        }
        //console.log("year: " + tds[0].innerHTML + " row: " + i + " y: " + x + " c: " + cy_text + " f: " + fy_text);
    }
    console.log(x_arr);
    console.log(y_arr);
    console.log(cx_text + " " + fx_text);
    console.log(cy_text + " " + fy_text);
    if (x_arr.length < 2 || isAllNull(y_arr)) {
        span_chart_info.innerHTML = "Недостаточно данных для построения";
    } else {
        let name = x_text + " ";
        if (cx_text != "") {
            name += "(" + cx_text;
            if (fx_text != "") {
                name += ", " + fx_text + ") ";
            } else {
                name += ") ";
            }
        } else if (fx_text != "") {
            name += "(" + fx_text + ") ";
        }
        name += "от " + y_text;
        if (cy_text != "") {
            name += " (" + cy_text;
            if (fy_text != "") {
                name += ", " + fy_text + ") ";
            } else {
                name += ") ";
            }
        } else if (fy_text != "") {
            name += " (" + fy_text + ") ";
        }
        console.log(name);
        if (dataIndex(data, name) != -1) {
            span_chart_info.innerHTML = "График уже построен";
            return;
        }
        addTo2DData(data, x_arr, y_arr, year_arr, name, x_text, y_text);
        Plotly.newPlot(plotly_div, data, set2DLayout(plotly_div), { scrollZoom: true, responsive: true });
        span_chart_info.innerHTML = "";
        addChartRestangle(chart_restangles, name).onclick = onChartRestangleClick.bind(null, data, name, chart_settings);
    }
}

function onChartRestangleClick(data, name, chart_settings) {
    let restangle = window.event.target;
    let chart_data = chart_settings.querySelector(".chart_data");
    let chart_stuff = chart_settings.querySelector(".chart_stuff");
    /*chart_data.innerHTML = "1";
    chart_stuff.innerHTML = "2";*/
    chart_data.innerHTML = "";
    chart_data.append(createTable(data, name));
}

function createTable(data, name) {
    let data_index = dataIndex(data, name);
    if (data_index == -1) {
        return;
    }
    let table = document.createElement("table");
    let tr = newTr();
    let is_year_chart = data[data_index]["year_name"] == data[data_index]["x_name"];
    //add th
    addTh(tr, newCheckboxCell("_all"));
    addTh(tr, data[data_index]["year_name"]);
    if (!is_year_chart) {
        addTh(tr, data[data_index]["x_name"]);
    }
    addTh(tr, data[data_index]["y_name"]);
    table.append(tr);
    //add td
    for (let k = 0; k < data[data_index]["x"].length; k++) {
        tr = newTr();
        addTd(tr, newCheckboxCell(k));
        if (!is_year_chart) {
            addTd(tr, data[data_index]["years"][k]);
        }
        addTd(tr, data[data_index]["x"][k]);
        addTd(tr, data[data_index]["y"][k]);
        table.append(tr);
    }
    return table;
    function addTd(tr, inner) {
        let td = newTd();
        td.innerHTML = inner;
        tr.append(td);
    }
    function addTh(tr, inner) {
        let th = newTh();
        th.innerHTML = inner;
        tr.append(th);
    }
    function newCheckboxCell(num) {
        let td = document.createElement("td");
        let input = document.createElement("input");
        input.type = "checkbox";
        input.id = "chart_checkbox" + num;
        input.className = "chart_checkbox" + num;
        let label = document.createElement("label");
        label.htmlFor = "chart_checkbox" + num;
        td.append(input, label);
        return td.innerHTML;
    }
    function newTr() { return document.createElement("tr"); }
    function newTd() { return document.createElement("td"); }
    function newTh() { return document.createElement("th"); }
}

function addChartRestangle(chart_restangles, name) {
    let chart_restangle = document.createElement("div");
    chart_restangle.className = "chart_restangle";
    chart_restangle.innerHTML = name;
    chart_restangles.append(chart_restangle);
    return chart_restangle;
}

function isAllNull(arr) {
    let count = 0;
    for (let k = 0; k < arr.length; k++) {
        if (arr[k] != null) {
            count++;
        }
    }
    return count < 2;
}

function dataIndex(data, name) {
    for (let k = 0; k < data.length; k++) {
        if (data[k]["name"] == name) {
            return k;
        }
    }
    return -1;
}

function addTo2DData(data, x_arr, y_arr, year_arr, name, x_name, y_name) {
    //сортировка по возрастанию х
    let x_arr_sorted = x_arr.slice();
    let y_arr_sorted = [], year_arr_sorted = [];
    x_arr_sorted.sort(function (a, b) { return a - b });
    for (let k = 0; k < x_arr.length; k++) {
        let old_index = arrayIndex(x_arr, x_arr_sorted[k]);
        y_arr_sorted.push(y_arr[old_index]);
        year_arr_sorted.push(year_arr[old_index]);
        x_arr[old_index] = null;
    }
    let trace;
    trace = {
        years: year_arr_sorted,
        x: x_arr_sorted,
        y: y_arr_sorted,
        type: "scatter",
        mode: "lines+markers",
        name: name,
        year_name: "Год",
        x_name: x_name,
        y_name: y_name,
        connectgaps: true
    };
    data.push(trace);
    console.log(data);
}

function set2DLayout(plotly_div) {
    return {
        autosize: false,
        height: plotly_div.clientHeight,
        width: plotly_div.clientWidth,
        showlegend: true,
    };
}

function updateLayout(plotly_div) {
    let update = {
        height: plotly_div.clientHeight,
        width: plotly_div.clientWidth
    };
    Plotly.relayout(plotly_div, update);
}

function arrayIndex(arr, el) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == el) {
            return i;
        }
    }
    return -1;
}