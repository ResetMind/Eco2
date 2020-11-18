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

function add2DChart(chart_div, plotly_div, data, form, span_chart_info, chart_restangles, chart_settings, trends_2d, cnt_num, plotly_num) {
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
        if (color_index >= colors.length) {
            color_index -= colors.length;
        }
        addTo2DData(true, data, x_arr, y_arr, year_arr, name, x_text, y_text, colors[color_index], "solid", null, null, null, null, null, null, null, null, null);
        new2DPlot(plotly_div, data);
        span_chart_info.innerHTML = "";
        addChartRestangle(plotly_div, chart_settings, chart_restangles, data, name, "2d").onclick = onChartRestangleClick.bind(null, chart_restangles, chart_div, data, name, chart_settings, trends_2d, "2d", plotly_num);
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

function onChartRestangleClick(chart_restangles, chart_div, plotly_div, data, name, chart_settings, trends_2d, type, plotly_num) {
    let chart_data = chart_settings.querySelector(".chart_data");
    let chart_stuff = chart_settings.querySelector(".chart_stuff");
    let restangles = chart_restangles.querySelectorAll(".chart_restangle");
    //console.log(restangles);
    let restangle = window.event.target;
    if(restangle.classList.contains("active")) {
        restangle.classList.remove("active");
        chart_settings.classList.remove("active");
        chart_data.innerHTML = "";
        chart_stuff.innerHTML = "";
    } else {
        for(let k = 0; k < restangles.length; k++) {
            restangles[k].classList.remove("active");
            if(k == 0) {
                chart_settings.classList.remove("active");
                chart_data.innerHTML = "";
                chart_stuff.innerHTML = "";
            }
        }
        restangle.classList.add("active");
        chart_data.append(createTable(data, name, plotly_num));
        chart_stuff.append(trends_2d);
        chart_settings.classList.add("active");
        addOnCheckboxChangeListeners(chart_div, chart_data.querySelectorAll("input[type='checkbox']"), data, name, type);
        addOn2DTrendsParamsChangeListeners(plotly_div, data, name, trends_2d, trends_2d.querySelector(".trend_2d_form"));
    }
    console.log(chart_settings);
}

function addOn2DTrendsParamsChangeListeners(plotly_div, data, name, trends_2d, trend_2d_form) {
    let r_span = trends_2d.querySelector(".r");
    let a_span = trends_2d.querySelector(".a");
    let trend_function_span = trends_2d.querySelector(".trend_function");
    let a_error_checkbox = trends_2d.querySelector(".a_error_checkbox");
    let a_error_checkbox_label = trends_2d.querySelector(".a_error_checkbox_label");
    trend_2d_form.select_2d_trend_type.onchange = function() {
        setDisabled();
        addTrend(trend_2d_form.select_2d_trend_type.value, data, name);
    }
    trend_2d_form.number_2d_trend_level.onchange = function() {
        console.log("number_2d_trend_level");
        validateNumberInput(trend_2d_form.number_2d_trend_level);
        addTrend(trend_2d_form.select_2d_trend_type.value, data, name);
    }
    trend_2d_form.number_2d_trend_back.onchange = function() {
        console.log("number_2d_trend_back");
        validateNumberInput(trend_2d_form.number_2d_trend_back);
        addTrend(trend_2d_form.select_2d_trend_type.value, data, name);
    }
    trend_2d_form.number_2d_trend_forward.onchange = function() {
        console.log("number_2d_trend_forward");
        validateNumberInput(trend_2d_form.number_2d_trend_forward);
        addTrend(trend_2d_form.select_2d_trend_type.value, data, name);
    }
    trend_2d_form.number_2d_trend_step.onchange = function() {
        console.log("number_2d_trend_step");
        validateNumberInput(trend_2d_form.number_2d_trend_step);
        addTrend(trend_2d_form.select_2d_trend_type.value, data, name);
    }
    a_error_checkbox.onchange = function() {
        addTrend(trend_2d_form.select_2d_trend_type.value, data, name);
    }
    let trend_params = getTrendParams(data, name);
    //console.log(trend_params);
    if (!trend_params) {
        trend_2d_form.select_2d_trend_type.value = "none";
        trend_2d_form.number_2d_trend_level.value = "2";
        trend_2d_form.number_2d_trend_back.value = "0";
        trend_2d_form.number_2d_trend_forward.value = "0";
        trend_2d_form.number_2d_trend_step.value = "1";
        removeSpans();
    } else {
        trend_2d_form.select_2d_trend_type.value = trend_params.trend_type;
        trend_2d_form.number_2d_trend_level.value = trend_params.level;
        trend_2d_form.number_2d_trend_back.value = trend_params.back;
        trend_2d_form.number_2d_trend_forward.value = trend_params.forward;
        trend_2d_form.number_2d_trend_step.value = trend_params.step;
        a_error_checkbox.checked = trend_params.error_bar;
        showErrors(trend_params.r, trend_params.a);
        showFunction(trend_params.trend_type, trend_params.coef);
    }
    setDisabled();

    function setDisabled() {
        let select_2d_trend_type_value = trend_2d_form.select_2d_trend_type.value;
        trend_2d_form.number_2d_trend_level.disabled = select_2d_trend_type_value != "2"
        trend_2d_form.number_2d_trend_back.disabled = select_2d_trend_type_value == "none"
        trend_2d_form.number_2d_trend_forward.disabled = select_2d_trend_type_value == "none"
        trend_2d_form.number_2d_trend_step.disabled = select_2d_trend_type_value == "none"
    }

    function addTrend(type, data, name) {
        let data_index = dataIndex(data, name);
        let color = data[data_index]["line"]["color"];
        let back = trend_2d_form.number_2d_trend_back.value;
        let forward = trend_2d_form.number_2d_trend_forward.value;
        let step = trend_2d_form.number_2d_trend_step.value;
        let level = "2";
        let data_v = validateDataForTrends(data);
        if (type == "0") {
            let xy = linear(data_v[data_index]["x"], data_v[data_index]["y"], parseFloat(back), parseFloat(forward), parseFloat(step));
            showTrend(xy);
            showFunction(type, xy.coef);
        } else if (type == "1") {
            let xy = hyperbole(data_v[data_index]["x"], data_v[data_index]["y"], parseFloat(back), parseFloat(forward), parseFloat(step));
            showTrend(xy);
            showFunction(type, xy.coef);
        } else if (type == "none") {
            removeTrend();
        }

        function showTrend(xy) {
            replaceIfExist(data, name);
            let a_error_checkbox_status = a_error_checkbox.checked;
            addTo2DData(false, data, xy.x_tr, xy.y_tr, null, name + " тренд", "", "", color, "dash", type, level, back, forward, step, xy.r, xy.a, xy.coef, a_error_checkbox_status);
            if(a_error_checkbox_status) {
                let error_bars = getErrorBars(xy);
                //console.log(error_bars);
                let error_bar_color = color.replace("1)", "0.3)");
                addToErrorBarData(data, error_bars.x_e_up, error_bars.y_e_up, name + " тренд", "", "", error_bar_color);
                addToErrorBarData(data, error_bars.x_e_down, error_bars.y_e_down, name + " тренд", "tonexty", error_bar_color, error_bar_color);
            }
            new2DPlot(plotly_div, data);
            showErrors(xy.r, xy.a);
        }

        function removeTrend() {
            replaceIfExist(data, name);
            new2DPlot(plotly_div, data);
            removeSpans();
        }

        function validateDataForTrends(data) {
            let data_v = getValidatedData(data);
            for (let k = 0; k < data_v[data_index]["x"].length; k++) {
                if (data_v[data_index]["x"][k] == null) {
                    data_v[data_index]["x"].splice(k, 1);
                    data_v[data_index]["y"].splice(k, 1);
                    k--;
                } else {
                    data_v[data_index]["x"][k] = parseFloat(data_v[data_index]["x"][k]);
                }
            }
            return data_v;
        }

        function getErrorBars(xy) {
            /*console.log(xy.x_tr);
            console.log(xy.y_tr);*/
            let x_e_up = [],
                y_e_up = [],
                x_e_down = [],
                y_e_down = [];
            for (let k = 0; k < xy.x_tr.length; k++) {
                x_e_up.push(xy.x_tr[k]);
                x_e_down.push(xy.x_tr[k]);
                y_e_up.push(xy.y_tr[k] + xy.y_tr[k] * xy.a / 100);
                y_e_down.push(xy.y_tr[k] - xy.y_tr[k] * xy.a / 100);
            }
            return {
                x_e_up: x_e_up,
                y_e_up: y_e_up,
                x_e_down: x_e_down,
                y_e_down: y_e_down
            }
        }
    }

    function replaceIfExist(data, name) {
        let data_index = dataIndex(data, name + " тренд");
        while (data_index != -1) {
            data.splice(data_index, 1);
            data_index = dataIndex(data, name + " тренд");
        }
    }

    function showFunction(type, coef) {
        if (type == "0") {
            trend_function_span.innerHTML = "y = " + coef[0].toFixed(4) + " + " + coef[1].toFixed(4) + "x";
        } else if (type == "1") {
            trend_function_span.innerHTML = "y = " + coef[0].toFixed(4) + " + " + coef[1].toFixed(4) + " * 1 / x";
        }
    }

    function showErrors(r, a) {
        r_span.innerHTML = "R<sup>2</sup>=" + r;
        a_span.innerHTML = "A=" + a;
        a_error_checkbox_label.style.display = ['inline-flex'];
    }

    function removeSpans() {
        r_span.innerHTML = "";
        a_span.innerHTML = "";
        trend_function_span.innerHTML = "";
        a_error_checkbox_label.style.display = "none";
    }
}

function getTrendParams(data, name) {
    let data_index = dataIndex(data, name + " тренд");
    if (data_index == -1) return false;
    let trend_type = data[data_index]["trend"]["trend_type"];
    let level = data[data_index]["trend"]["level"];
    let back = data[data_index]["trend"]["back"];
    let forward = data[data_index]["trend"]["forward"];
    let step = data[data_index]["trend"]["step"];
    let r = data[data_index]["trend"]["r"];
    let a = data[data_index]["trend"]["a"];
    let coef = data[data_index]["trend"]["coef"];
    let error_bar = data[data_index]["trend"]["error_bar"];
    return {
        trend_type: trend_type,
        level: level,
        back: back,
        forward: forward,
        step: step,
        r: r,
        a: a,
        coef: coef,
        error_bar: error_bar
    }
    //console.log(data[data_index]["trend"]["trend_type"]);
}

function validateNumberInput(number_input) {
    let value = number_input.value;
    if (value > parseFloat(number_input.max)) {
        number_input.value = number_input.max;
    } else if (value < parseFloat(number_input.min)) {
        number_input.value = number_input.min;
    }
}

function createTable(data, name, plotly_num) {
    let data_index = dataIndex(data, name);
    if (data_index == -1) {
        return;
    }
    let table = document.createElement("table");
    let tr = newTr();
    let is_year_chart = data[data_index]["year_name"] == data[data_index]["x_name"];
    //add th
    addTh(tr, newCheckboxCell("_" + plotly_num + "_all"));
    addTh(tr, data[data_index]["year_name"]);
    if (!is_year_chart) {
        addTh(tr, data[data_index]["x_name"]);
    }
    addTh(tr, data[data_index]["y_name"]);
    table.append(tr);
    //add td
    for (let k = 0; k < data[data_index]["x"].length; k++) {
        tr = newTr();
        addTd(tr, newCheckboxCell(plotly_num + "_" + k));
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

function addOnCheckboxChangeListeners(chart_div, checkboxes, data, name, type) {
    console.log(checkboxes);
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
        //if (type == "2d") new2DPlot(plotly_div, data);
        if (type == "2d") document.querySelector(".trend_2d_form").select_2d_trend_type.dispatchEvent(new Event("change"));

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

function deleteChartRestangle(plotly_div, chart_settings, chart_restangle, data, name, type) {
    window.event.stopPropagation();
    if (chart_restangle.classList.contains("active")) {
        chart_settings.classList.remove("active");
        old_restangle = null;
    }
    chart_restangle.remove();
    if (dataIndex(data, name) != -1) {
        data.splice(dataIndex(data, name), 1);
    }
    while (dataIndex(data, name + " тренд") != -1) {
        data.splice(dataIndex(data, name + " тренд"), 1);
    }
    if (type == "2d") new2DPlot(plotly_div, data);
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

function addToErrorBarData(data, x_arr, y_arr, name, fill, fillcolor, marker_color) {
    let trace = {
        x: x_arr,
        y: y_arr,
        fill: fill,
        fillcolor: fillcolor,
        marker: { color: marker_color },
        line: { width: 0 },
        mode: "lines",
        name: name,
        type: "scatter",
        showlegend: false

    };
    data.push(trace);
}

function addTo2DData(sort, data, x_arr, y_arr, year_arr, name, x_name, y_name, color, dash, trend_type, level, back, forward, step, r, a, coef, error_bar) {
    let x_arr_sorted, y_arr_sorted = [],
        year_arr_sorted = [];
    if (sort) {
        //сортировка по возрастанию х
        x_arr_sorted = x_arr.slice();
        x_arr_sorted.sort(function(a, b) { return a - b });
        for (let k = 0; k < x_arr.length; k++) {
            let old_index = arrayIndex(x_arr, x_arr_sorted[k]);
            y_arr_sorted.push(y_arr[old_index]);
            if (year_arr != null) {
                year_arr_sorted.push(year_arr[old_index]);
            }
            x_arr[old_index] = null;
        }
    } else {
        x_arr_sorted = x_arr.slice();
        y_arr_sorted = y_arr.slice();
    }

    let trace = {
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
        },
        trend: {
            trend_type: trend_type,
            level: level,
            back: back,
            forward: forward,
            step: step,
            r: r,
            a: a,
            coef: coef,
            error_bar: error_bar
        }
    };
    data.push(trace);
    //console.log(data);
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