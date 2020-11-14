let old_restangle = null;
let colors = [
    "rgba(31, 119, 180, 1)",
    "rgba(255, 127, 14, 1)",
    "rgba(44, 160, 44, 1)",
    "rgba(214, 39, 40, 1)",
    "rgba(148, 103, 189, 1)",
    "rgba(140, 86, 75, 1)",
    "rgba(227, 119, 194, 1)",
    "rgba(127, 127, 127, 1)",
    "rgba(188, 189, 34, 1)",
    "rgba(23, 190, 207, 1)"
];

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
        let color_index = data.length + 1;
        if(color_index >= colors.length) {
            color_index -= colors.length;
        }
        addTo2DData(data, x_arr, y_arr, year_arr, name, x_text, y_text, colors[color_index], "solid");
        new2DPlot(plotly_div, data);
        span_chart_info.innerHTML = "";
        addChartRestangle(plotly_div, chart_settings, chart_restangles, data, name, "2d").onclick = onChartRestangleClick.bind(null, plotly_div, data, name, chart_settings, "2d");
    }
}

function new2DPlot(plotly_div, data) {
    Plotly.newPlot(plotly_div, getValidatedData(data), set2DLayout(plotly_div), { scrollZoom: true, responsive: true });
}

function getValidatedData(data) {
    let data_v = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < data_v.length; i++) {
        for (let k = 0; k < data_v[i]["x"].length; k++) {
            if ((data_v[i]["x"][k] + "").indexOf("<label>") != -1) {
                data_v[i]["x"][k] = null;
            }
        }
    }
    return data_v;
}

function onChartRestangleClick(plotly_div, data, name, chart_settings, type) {
    let chart_data = chart_settings.querySelector(".chart_data");
    let chart_stuff = chart_settings.querySelector(".chart_stuff");
    let restangle = window.event.target;
    if (restangle === old_restangle) {
        chart_settings.classList.toggle("active");
        old_restangle.classList.toggle("active");
        old_restangle = chart_settings.classList.contains("active") ? window.event.target : null;
    } else if (old_restangle == null) {
        chart_data.innerHTML = "";
        chart_data.append(createTable(data, name));
        chart_settings.classList.toggle("active");
        old_restangle = window.event.target;
        old_restangle.classList.add("active");
        addOnCheckboxChangeListeners(plotly_div, chart_data.querySelectorAll("input[type='checkbox']"), data, name, type);
    } else {
        chart_data.innerHTML = "";
        chart_data.append(createTable(data, name));
        old_restangle.classList.remove("active");
        old_restangle = window.event.target;
        old_restangle.classList.add("active");
        addOnCheckboxChangeListeners(plotly_div, chart_data.querySelectorAll("input[type='checkbox']"), data, name, type);
    }
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
        addTd(tr, newCheckboxCell("_" + k));
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

function setChecked(checkboxes, data, name) {
    /*let data_index = dataIndex(data, name);
    for (let k = 0; k < data[data_index]["x"].length; k++) {
        if(data[data_index]["x"][k].indexOf(""))
    }*/
}

function addOnCheckboxChangeListeners(plotly_div, checkboxes, data, name, type) {
    let data_index = dataIndex(data, name);
    let checked_count = 1;
    for (let k = 0; k < data[data_index]["x"].length; k++) {
        if ((data[data_index]["x"][k] + "").indexOf("<label>") == -1) {
            checkboxes[k + 1].checked = true;
            checked_count++;
        }
    }
    if (checked_count == checkboxes.length) checkboxes[0].checked = true;
    for (let k = 0; k < checkboxes.length; k++) {
        checkboxes[k].onchange = onCheckboxChange.bind(null, k, data);
    }
    function onCheckboxChange(index, data) {
        if (index == 0) {
            let all_checked = checkboxes[index].checked == true;
            for (let k = 1; k < checkboxes.length; k++) {
                checkboxes[k].checked = all_checked;
                if (all_checked) {
                    data[data_index]["x"][k - 1] = removePre(data[data_index]["x"][k - 1] + "");
                } else {
                    data[data_index]["x"][k - 1] = addPre(data[data_index]["x"][k - 1] + "");
                }
            }
        } else {
            if (checkboxes[index].checked) {
                data[data_index]["x"][index - 1] = removePre(data[data_index]["x"][index - 1] + "");
            } else {
                data[data_index]["x"][index - 1] = addPre(data[data_index]["x"][index - 1] + "");
            }
        }
        let checked_count = 1;
        for (let k = 1; k < checkboxes.length; k++) {
            checked_count = checkboxes[k].checked == true ? checked_count + 1 : checked_count;
        }
        if (checked_count == checkboxes.length) {
            checkboxes[0].checked = true;
        } else {
            checkboxes[0].checked = false;
        }
        if (type == "2d") new2DPlot(plotly_div, data);
        function addPre(x) {
            if (x.indexOf("<label>") == -1 && x.indexOf("</label>") == -1) {
                return "<label>" + x + "</label>";
            }
            return x;
        }
        function removePre(x) {
            x = x.replace("<label>", "");
            x = x.replace("</label>", "");
            return x;
        }
    }
}

function addChartRestangle(plotly_div, chart_settings, chart_restangles, data, name, type) {
    let chart_restangle = document.createElement("div");
    chart_restangle.className = "chart_restangle";
    chart_restangle.innerHTML = name;
    let delete_button = document.createElement("a");
    delete_button.innerHTML = "&#215;"
    chart_restangle.append(delete_button);
    chart_restangles.append(chart_restangle);
    delete_button.onclick = deleteChartRestangle.bind(null, plotly_div, chart_settings, chart_restangle, data, name, type);
    return chart_restangle;
}

function deleteChartRestangle(plotly_div, chart_settings, chart_restangle, data, name, type) {
    window.event.stopPropagation();
    if(chart_restangle.classList.contains("active")) {
        chart_settings.classList.remove("active");
        old_restangle = null;
    }
    chart_restangle.remove();
    while (dataIndex(data, name) != -1) {
        data.splice(dataIndex(data, name), 1);
    }
    if(type == "2d") new2DPlot(plotly_div, data);
    console.log(data);
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

function addTo2DData(data, x_arr, y_arr, year_arr, name, x_name, y_name, color, dash) {
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
        name: name,
        year_name: "Год",
        x_name: x_name,
        y_name: y_name,
        connectgaps: true,
        line: {
            dash: dash,
            color: color
        }
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