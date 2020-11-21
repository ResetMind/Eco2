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

function addChart(chart_div, data, trends, interpolation, plotly_num, type) {
    let form = chart_div.querySelector(".param_form");
    let span_chart_info = chart_div.querySelector(".span_chart_info");

    let x_col = parseFloat(form.x_select_param.value);
    let x_index = form.x_select_param.selectedIndex;
    let x_text = form.x_select_param[x_index].text;

    let cx_index = form.x_select_culture.selectedIndex;
    let cx_text = cx_index > 1 ? form.x_select_culture[cx_index].text : "";

    let fx_index = form.x_select_field.selectedIndex;
    let fx_text = fx_index > 1 ? form.x_select_field[fx_index].text : "";

    let y_col = parseFloat(form.y_select_param.value);
    let y_index = form.y_select_param.selectedIndex;
    let y_text = form.y_select_param[y_index].text;

    let cy_index = form.y_select_culture.selectedIndex;
    let cy_text = cy_index > 1 ? form.y_select_culture[cy_index].text : "";

    let fy_index = form.y_select_field.selectedIndex;
    let fy_text = fy_index > 1 ? form.y_select_field[fy_index].text : "";

    let z_col, z_text, cz_text, fz_text;
    if (type == 1) {
        z_col = parseFloat(form.z_select_param.value);
        let z_index = form.z_select_param.selectedIndex;
        z_text = form.z_select_param[z_index].text;

        let cz_index = form.z_select_culture.selectedIndex;
        cz_text = cz_index > 1 ? form.z_select_culture[cz_index].text : "";

        let fz_index = form.z_select_field.selectedIndex;
        fz_text = fz_index > 1 ? form.z_select_field[fz_index].text : "";
    }

    if (isNaN(x_col) || isNaN(y_col) || (type == 1 && isNaN(z_col))) {
        span_chart_info.innerHTML = "Не выбраны параметры";
        return;
    }
    let x_arr = [],
        y_arr = [],
        z_arr = [],
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
        //console.log("year: " + tds[0].innerHTML + " row: " + i + " y: " + y + " c: " + cy_text + " f: " + fy_text);

        if (type == 1) {
            let z = parseFloat(tds[z_col].innerHTML);
            if (isNaN(z) || c.indexOf(cz_text) == -1 || f.indexOf(fz_text) == -1) {
                z_arr.push(null);
            } else {
                z_arr.push(z);
            }
            //console.log("year: " + tds[0].innerHTML + " row: " + i + " z: " + z + " c: " + cz_text + " f: " + fz_text);
        }
    }
    if (x_arr.length < 2 || isAllNull(y_arr) || (type == 1 && isAllNull(z_arr))) {
        span_chart_info.innerHTML = "Недостаточно данных для построения";
    } else {
        let name = x_text;
        if (type == 1) name += ", " + y_text + " от " + z_text;
        else name += " от " + y_text;
        console.log(name);
        if (dataIndex(data, name) != -1) {
            span_chart_info.innerHTML = "График уже построен";
            return;
        }
        let color_index = 0;
        for (let k = 0; k < data.length; k++) {
            if (data[k]["which"] == "normal") {
                color_index++;
            }
        }
        if (color_index >= colors.length) {
            color_index -= colors.length;
        }
        if (type == 0) {
            addTo2DData(data, x_arr, y_arr, year_arr, name, x_text, y_text, colors[color_index], "normal");
            newPlot(chart_div.querySelector(".plotly_div"), data, type);
            addChartRestangle(chart_div, data, name, "0").onclick = onChartRestangleClick.bind(null, chart_div, trends, interpolation, data, name, "0", plotly_num);
        } else if (type == 1) {
            addTo3DData(data, x_arr, y_arr, z_arr, year_arr, name, x_text, y_text, z_text, colors[color_index], "normal");
            newPlot(chart_div.querySelector(".plotly_div"), data, type);
            addChartRestangle(chart_div, data, name, "1").onclick = onChartRestangleClick.bind(null, chart_div, trends, interpolation, data, name, "1", plotly_num);
        }
        span_chart_info.innerHTML = "";
    }
}

function newPlot(plotly_div, data, type) {
    Plotly.newPlot(plotly_div, getValidatedData(data, type), setChartLayout(plotly_div), { scrollZoom: true, responsive: true });
    //console.log(type);
}

function getValidatedData(data, type) {
    let data_v = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < data_v.length; i++) {
        for (let k = 0; k < data_v[i]["x"].length; k++) {
            if ((data_v[i]["x"][k] + "").indexOf("<label>") != -1) {
                if (type == "0") data_v[i]["x"][k] = null;
                else if (type == "1") {
                    data_v[i]["x"].splice(k, 1);
                    data_v[i]["y"].splice(k, 1);
                    data_v[i]["z"].splice(k, 1);
                    k--;
                }
            }
        }
    }
    //console.log(data_v);
    return data_v;
}

function addChartRestangle(chart_div, data, name, type) {
    let chart_restangle = document.createElement("div");
    chart_restangle.className = "chart_restangle";
    chart_restangle.innerHTML = name;
    let delete_button = document.createElement("a");
    delete_button.innerHTML = "&#215;"
    chart_restangle.append(delete_button);
    chart_div.querySelector(".chart_restangles").append(chart_restangle);
    delete_button.onclick = deleteChartRestangle.bind(null, chart_div, chart_restangle, data, name, type);
    return chart_restangle;
}

function deleteChartRestangle(chart_div, chart_restangle, data, name, type) {
    window.event.stopPropagation();
    if (chart_restangle.classList.contains("active")) {
        chart_div.querySelector(".chart_settings").classList.remove("active");
    }
    chart_restangle.remove();
    let data_index = dataIndex(data, name);
    let color = data[data_index]["line"]["color"];
    let color_index = arrayIndex(colors, color);
    colors.push(...colors.splice(color_index, 1));
    console.log(colors);
    if (data_index != -1) {
        data.splice(dataIndex(data, name), 1);
    }
    while (dataIndex(data, name + " тренд") != -1) {
        data.splice(dataIndex(data, name + " тренд"), 1);
    }
    newPlot(chart_div.querySelector(".plotly_div"), data, type);
    //console.log(data);
}

function onChartRestangleClick(chart_div, trends, interpolation, data, name, type, plotly_num) {
    let plotly_div = chart_div.querySelector(".plotly_div");
    let chart_settings = chart_div.querySelector(".chart_settings");
    let chart_restangles = chart_div.querySelector(".chart_restangles");
    let chart_data = chart_settings.querySelector(".chart_data");
    let chart_stuff = chart_settings.querySelector(".chart_stuff");
    let restangles = chart_restangles.querySelectorAll(".chart_restangle");
    //console.log(restangles);
    let restangle = window.event.target;
    if (restangle.classList.contains("active")) {
        restangle.classList.remove("active");
        chart_settings.classList.remove("active");
        chart_data.innerHTML = "";
        chart_stuff.innerHTML = "";
        removeOptLine(data, name);
    } else {
        for (let k = 0; k < restangles.length; k++) {
            let name_ = restangles[k].innerText.replace("×", "");
            removeOptLine(data, name_);
            restangles[k].classList.remove("active");
            if (k == 0) {
                chart_settings.classList.remove("active");
                chart_data.innerHTML = "";
                chart_stuff.innerHTML = "";
            }
        }
        restangle.classList.add("active");
        chart_data.append(createDataTable(data, name, plotly_num, type));
        if (trends != null) chart_stuff.append(trends);
        chart_stuff.append(interpolation);
        chart_settings.classList.add("active");
        addOnCheckboxChangeListeners(chart_div, chart_data.querySelectorAll("input[type='checkbox']"), data, name, type);
        if (type == "0") {
            addOn2DOptimisationParamsListeners(chart_div, data, name);
            addOn2DTrendsParamsChangeListeners(chart_div, data, name);
            addOn2DImitationListeners(chart_div, data, name);
            addOn2DInterpolationListeners(chart_div, data, name);
        }
    }

    function removeOptLine(data, name) {
        let data_index = dataIndex(data, name);
        if (data[data_index]["optimisation"] == null) {
            replaceIfExist(data, name, "left_opt_line");
            replaceIfExist(data, name, "right_opt_line");
            replaceIfExist(data, name, "point");
            newPlot(plotly_div, data, type);
        }
    }
}

function createDataTable(data, name, plotly_num, type) {
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
    if (type == "1") addTh(tr, data[data_index]["z_name"]);
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
        if (type == "1") addTd(tr, data[data_index]["z"][k]);
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

function addOn2DTrendsParamsChangeListeners(chart_div, data, name) {
    let trends_2d = chart_div.querySelector(".trends_2d");
    let r_span = trends_2d.querySelector(".r");
    let a_span = trends_2d.querySelector(".a");
    let trend_function_span = trends_2d.querySelector(".trend_function");
    let a_error_checkbox = trends_2d.querySelector(".a_error_checkbox");
    let a_error_checkbox_label = trends_2d.querySelector(".a_error_checkbox_label");
    let trend_2d_form = trends_2d.querySelector(".trend_2d_form");
    let plotly_div = chart_div.querySelector(".plotly_div");
    let trends_2d_optimisation = chart_div.querySelector(".trends_2d_optimisation");
    let trends_2d_imitation = chart_div.querySelector(".trends_2d_imitation");
    let trends_2d_interpolation = chart_div.querySelector(".trends_2d_interpolation");
    trend_2d_form.select_2d_trend_type.onchange = function () {
        setDisabled();
        addTrend(trend_2d_form.select_2d_trend_type.value, data, name);
    }
    trend_2d_form.number_2d_trend_level.onchange = function () {
        //console.log("number_2d_trend_level");
        validateNumberInput(trend_2d_form.number_2d_trend_level);
        addTrend(trend_2d_form.select_2d_trend_type.value, data, name);
    }
    trend_2d_form.number_2d_trend_back.onchange = function () {
        //console.log("number_2d_trend_back");
        validateNumberInput(trend_2d_form.number_2d_trend_back);
        addTrend(trend_2d_form.select_2d_trend_type.value, data, name);
    }
    trend_2d_form.number_2d_trend_forward.onchange = function () {
        //console.log("number_2d_trend_forward");
        validateNumberInput(trend_2d_form.number_2d_trend_forward);
        addTrend(trend_2d_form.select_2d_trend_type.value, data, name);
    }
    trend_2d_form.number_2d_trend_step.onchange = function () {
        //console.log("number_2d_trend_step");
        validateNumberInput(trend_2d_form.number_2d_trend_step);
        addTrend(trend_2d_form.select_2d_trend_type.value, data, name);
    }
    a_error_checkbox.onchange = function () {
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
        removeResultsSpans();
        removeTrendsParts();
    } else {
        trend_2d_form.select_2d_trend_type.value = trend_params.trend_type;
        trend_2d_form.number_2d_trend_level.value = trend_params.level;
        trend_2d_form.number_2d_trend_back.value = trend_params.back;
        trend_2d_form.number_2d_trend_forward.value = trend_params.forward;
        trend_2d_form.number_2d_trend_step.value = trend_params.step;
        a_error_checkbox.checked = trend_params.error_bar;
        showErrors(trend_params.r, trend_params.a);
        showFunction(trend_params.trend_type, trend_params.coef, trend_params.level);
        showTrendsParts();
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
        let level = trend_2d_form.number_2d_trend_level.value;
        let data_v = validateDataForCalculations(data, name, "0");
        if (type == "0") {
            let xy = linear(data_v[data_index]["x"], data_v[data_index]["y"], parseFloat(back), parseFloat(forward), parseFloat(step));
            showTrend(xy);
            showFunction(type, xy.coef);
        } else if (type == "1") {
            let xy = hyperbole(data_v[data_index]["x"], data_v[data_index]["y"], parseFloat(back), parseFloat(forward), parseFloat(step));
            showTrend(xy);
            showFunction(type, xy.coef);
        } else if (type == "2") {
            let xy = null;
            let level = trend_2d_form.number_2d_trend_level.value;
            if (level == "2") {
                xy = parabole2(data_v[data_index]["x"], data_v[data_index]["y"], parseFloat(back), parseFloat(forward), parseFloat(step));
            } else if (level == "3") {
                xy = parabole3(data_v[data_index]["x"], data_v[data_index]["y"], parseFloat(back), parseFloat(forward), parseFloat(step));
            } else if (level == "4") {
                xy = parabole4(data_v[data_index]["x"], data_v[data_index]["y"], parseFloat(back), parseFloat(forward), parseFloat(step));
            } else if (level == "5") {
                xy = parabole5(data_v[data_index]["x"], data_v[data_index]["y"], parseFloat(back), parseFloat(forward), parseFloat(step));
            } else if (level == "6") {
                xy = parabole6(data_v[data_index]["x"], data_v[data_index]["y"], parseFloat(back), parseFloat(forward), parseFloat(step));
            }
            showTrend(xy);
            showFunction(type, xy.coef, level);
        } else if (type == "3") {
            let xy = exponent(data_v[data_index]["x"], data_v[data_index]["y"], parseFloat(back), parseFloat(forward), parseFloat(step));
            showTrend(xy);
            showFunction(type, xy.coef);
        } else if (type == "4") {
            let xy = stepennaya(data_v[data_index]["x"], data_v[data_index]["y"], parseFloat(back), parseFloat(forward), parseFloat(step));
            showTrend(xy);
            showFunction(type, xy.coef);
        } else if (type == "none") {
            removeTrend();
        }

        function showTrend(xy) {
            //replaceIfExist(data, name);
            replaceIfExist(data, name, "error_bar");
            replaceIfExist(data, name, "trendt");
            let a_error_checkbox_status = a_error_checkbox.checked;
            let trend = {
                trend_type: type,
                level: level,
                back: back,
                forward: forward,
                step: step,
                r: xy.r,
                a: xy.a,
                coef: xy.coef,
                error_bar: a_error_checkbox_status
            }
            //addTo2DData(false, data, xy.x_tr, xy.y_tr, null, name + " тренд", "", "", color, "dash", "trendt", trend);
            data[data_index]["trend"] = trend;
            addToTrendData(data, xy.x_tr, xy.y_tr, name + " тренд", color, "trendt");
            if (a_error_checkbox_status) {
                let error_bars = getErrorBars(xy);
                //console.log(error_bars);
                let error_bar_color = color.replace("1)", "0.3)");
                addToErrorBarData(data, error_bars.x_e_up, error_bars.y_e_up, name + " тренд", "", "", error_bar_color, "error_bar");
                addToErrorBarData(data, error_bars.x_e_down, error_bars.y_e_down, name + " тренд", "tonexty", error_bar_color, error_bar_color, "error_bar");
            }
            newPlot(plotly_div, data, "0");
            showErrors(xy.r, xy.a);
            showTrendsParts();
        }

        function removeTrend() {
            replaceIfExist(data, name);
            newPlot(plotly_div, data, "0");
            removeResultsSpans();
            removeTrendsParts();
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

    function getTrendParams(data, name) {
        let data_index = dataIndex(data, name, "normal");
        if (data_index == -1) return false;
        if (data[data_index]["trend"] == null) return false;
        return data[data_index]["trend"];
        //console.log(data[data_index]["trend"]["trend_type"]);
    }

    function showFunction(type, coef, level = null) {
        console.log(coef);
        if (type == "0") {
            trend_function_span.innerHTML = "y = " + coef[0].toFixed(4) + getSign(coef[1].toFixed(4)) + "x";
        } else if (type == "1") {
            trend_function_span.innerHTML = "y = " + coef[0].toFixed(4) + getSign(coef[1].toFixed(4)) + " * 1 / x";
        } else if (type == "2") {
            trend_function_span.innerHTML = getParaboleFunction();
        } else if (type == "3") {
            trend_function_span.innerHTML = "y = " + coef[0].toFixed(4) + "e<sup>" + coef[1].toFixed(4) + "x</sup>";
        } else if (type == "4") {
            trend_function_span.innerHTML = "y = " + coef[0].toFixed(4) + "x<sup>" + coef[1].toFixed(4) + "</sup>";
        }
        trend_function_span.classList.add("active");

        function getSign(num) {
            if (num >= 0) {
                return " + " + num;
            } else {
                return " - " + (num * -1);
            }
        }

        function getParaboleFunction() {
            level = parseFloat(level);
            let res = "y = " + coef[0].toFixed(4) + getSign(coef[1].toFixed(4)) + "x";
            for (let k = 2; k <= level; k++) {
                res += getSign(coef[k].toFixed(4)) + "x<sup>" + k + "</sup>";
            }
            return res;
        }
    }

    function showErrors(r, a) {
        r_span.innerHTML = "R<sup>2</sup> = " + r;
        a_span.innerHTML = "A = " + a;
        r_span.classList.add("active");
        a_span.classList.add("active");
        a_error_checkbox_label.classList.add("active");
    }

    function removeResultsSpans() {
        r_span.classList.remove("active");
        a_span.classList.remove("active");
        a_error_checkbox_label.classList.remove("active");
        trend_function_span.classList.remove("active");
    }

    function showTrendsParts() {
        trends_2d_optimisation.classList.add("active");
        trends_2d_imitation.classList.add("active");
    }

    function removeTrendsParts() {
        trends_2d_optimisation.classList.remove("active");
        trends_2d_imitation.classList.remove("active");
    }
}

function addOnCheckboxChangeListeners(chart_div, checkboxes, data, name, type) {
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
        checkboxes[k].onchange = onCheckboxChange.bind(null, k, data, name);
    }

    function onCheckboxChange(index, data, name) {
        let data_index = dataIndex(data, name);
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

        if (type == "0") chart_div.querySelector(".trend_2d_form").select_2d_trend_type.dispatchEvent(new Event("change"));
        else if (type == "1") newPlot(chart_div.querySelector(".plotly_div"), data, "1");

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

function addOn2DOptimisationParamsListeners(chart_div, data, name) {
    let select_2d_trend_type = chart_div.querySelector(".select_2d_trend_type");
    let plotly_div = chart_div.querySelector(".plotly_div");
    let trends_2d_optimisation_form = chart_div.querySelector(".trends_2d_optimisation_form");
    let select_trends_2d_optimisation_method = trends_2d_optimisation_form.select_trends_2d_optimisation_method;
    let select_trends_2d_optimisation_type = trends_2d_optimisation_form.select_trends_2d_optimisation_type;
    let number_trends_2d_optimisation_left = trends_2d_optimisation_form.number_trends_2d_optimisation_left;
    let number_trends_2d_optimisation_right = trends_2d_optimisation_form.number_trends_2d_optimisation_right;
    let button_trends_2d_optimisation = trends_2d_optimisation_form.button_trends_2d_optimisation;
    let x_opt_span = chart_div.querySelector(".x_opt");
    let y_opt_span = chart_div.querySelector(".y_opt");
    let data_index = dataIndex(data, name);
    let length = data[data_index]["x"].length;
    let min_x = removeLabel(data[data_index]["x"][0] + "");
    let max_x = removeLabel(data[data_index]["x"][length - 1] + "");
    let min_y = getMinOfArray(data[data_index]["y"]);
    let max_y = getMaxOfArray(data[data_index]["y"]);
    /*console.log("min_x " + min_x + " max_x " + max_x);
    console.log("min_y " + min_y + " max_y " + max_y);*/
    number_trends_2d_optimisation_left.min = min_x;
    number_trends_2d_optimisation_left.max = max_x;
    number_trends_2d_optimisation_right.min = min_x;
    number_trends_2d_optimisation_right.max = max_x;
    let optimisation_params = getOptimisationParams(data, name);
    if (!optimisation_params) {
        select_trends_2d_optimisation_method.value = "none";
        number_trends_2d_optimisation_left.value = min_x;
        number_trends_2d_optimisation_right.value = max_x;
        removeOptSpans();
    } else {
        console.log(optimisation_params);
        select_trends_2d_optimisation_method.value = optimisation_params.method;
        select_trends_2d_optimisation_type.value = optimisation_params.type;
        number_trends_2d_optimisation_left.value = optimisation_params.left;
        number_trends_2d_optimisation_right.value = optimisation_params.right;
        showOptSpans(optimisation_params.result_x, optimisation_params.result_y);
    }
    setDisabled();
    let color = data[data_index]["line"]["color"].replace("1)", "0.5)");
    select_trends_2d_optimisation_method.onchange = function () {
        let data_index = dataIndex(data, name);
        let value = select_trends_2d_optimisation_method.value;
        if (value == "none") {
            removeOptSpans();
            replaceIfExist(data, name, "left_opt_line");
            replaceIfExist(data, name, "right_opt_line");
            replaceIfExist(data, name, "point");
            newPlot(plotly_div, data, "0");
            data[data_index]["optimisation"] = null;
        }
        setDisabled();
    }
    number_trends_2d_optimisation_left.onchange = function () {
        validateNumberInput(number_trends_2d_optimisation_left);
        if (parseFloat(number_trends_2d_optimisation_left.value) > parseFloat(number_trends_2d_optimisation_right.value)) {
            number_trends_2d_optimisation_left.value = number_trends_2d_optimisation_right.value;
        }
        showLine(number_trends_2d_optimisation_left, "left_opt_line");
    }
    number_trends_2d_optimisation_right.onchange = function () {
        validateNumberInput(number_trends_2d_optimisation_right);
        if (parseFloat(number_trends_2d_optimisation_right.value) < parseFloat(number_trends_2d_optimisation_left.value)) {
            number_trends_2d_optimisation_right.value = number_trends_2d_optimisation_left.value;
        }
        showLine(number_trends_2d_optimisation_right, "right_opt_line");
    }
    button_trends_2d_optimisation.onclick = function () {
        let data_index = dataIndex(data, name);
        showLine(number_trends_2d_optimisation_left, "left_opt_line");
        showLine(number_trends_2d_optimisation_right, "right_opt_line");
        let method = select_trends_2d_optimisation_method.value;
        let type = select_trends_2d_optimisation_type.value;
        let left = parseFloat(number_trends_2d_optimisation_left.value);
        let right = parseFloat(number_trends_2d_optimisation_right.value);
        let coef = data[data_index]["trend"]["coef"];
        let trend_type = data[data_index]["trend"]["trend_type"];
        let level = data[data_index]["trend"]["level"];
        console.log("coef " + coef);
        console.log("trend_type " + trend_type);
        console.log("level " + level);
        let x = null, y = null;
        if (method == "0") {
            [x, y] = halfDivision(type, left, right, getFunction(trend_type, level), coef);
        } else if (method == "1") {
            [x, y] = goldenRatio(type, left, right, getFunction(trend_type, level), coef);
        } else if (method == "2") {
            [x, y] = fibonacci(type, left, right, getFunction(trend_type, level), coef);
        }
        showOptSpans(x, y);
        showPoint(x, y);

        let optimisation = {
            method: select_trends_2d_optimisation_method.value,
            type: select_trends_2d_optimisation_type.value,
            left: number_trends_2d_optimisation_left.value,
            right: number_trends_2d_optimisation_right.value,
            result_x: x,
            result_y: y
        }
        data[data_index]["optimisation"] = optimisation;
        console.log(data);
    }

    function showLine(input, which) {
        replaceIfExist(data, name, which);
        let value = input.value;
        let x = [value, value];
        let y = [min_y, max_y];
        addToOptimisationBordersData(data, x, y, name + " тренд", color, which);
        newPlot(plotly_div, data, "0");
    }

    function showPoint(x, y) {
        replaceIfExist(data, name, "point");
        addToOptimisationPointData(data, [x], [y], name + " тренд", color, "point");
        newPlot(plotly_div, data, "0");
    }

    function getOptimisationParams(data, name) {
        let data_index = dataIndex(data, name, "normal");
        if (data_index == -1) return false;
        if (data[data_index]["optimisation"] == null) return false;
        return data[data_index]["optimisation"];
    }

    function showOptSpans(x, y) {
        x_opt_span.innerHTML = "x = " + x;
        y_opt_span.innerHTML = "y = " + y;
        x_opt_span.classList.add("active");
        y_opt_span.classList.add("active");
    }

    function removeOptSpans() {
        x_opt_span.classList.remove("active");
        y_opt_span.classList.remove("active");
    }

    function removeLabel(x) {
        x = x.replace("<label>", "");
        x = x.replace("</label>", "");
        return x;
    }

    function setDisabled() {
        let value = select_trends_2d_optimisation_method.value;
        select_trends_2d_optimisation_type.disabled = value == "none";
        number_trends_2d_optimisation_left.disabled = value == "none";
        number_trends_2d_optimisation_right.disabled = value == "none";
        button_trends_2d_optimisation.disabled = value == "none";
    }

    function getMaxOfArray(arr) {
        return Math.max.apply(null, arr);
    }

    function getMinOfArray(arr) {
        return Math.min.apply(null, arr);
    }
}

function getFunction(trend_type, level) {
    if (trend_type == "0") {
        return get_y_linear;
    } else if (trend_type == "1") {
        return get_y_hyperbole;
    } else if (trend_type == "2") {
        if (level == "2") {
            return get_y_parabole2;
        } else if (level == "3") {
            return get_y_parabole3;
        } else if (level == "4") {
            return get_y_parabole4;
        } else if (level == "5") {
            return get_y_parabole5;
        } else if (level == "6") {
            return get_y_parabole6;
        }
    } else if (trend_type == "3") {
        return get_y_exponent;
    } else if (trend_type == "4") {
        return get_y_stepennaya;
    }
}

function addOn2DImitationListeners(chart_div, data, name) {
    let imitation_div = chart_div.querySelector(".imitation_div");
    let imitation_table = imitation_div.querySelector(".imitation_table");
    let right_context_menu = chart_div.querySelector(".right_context_menu");
    let r_col = right_context_menu.querySelector(".r_col");
    let r_delete_col = right_context_menu.querySelector(".r_delete_col");
    let col = 0, tds, row_length;
    let imitation_params = getImitationParams(data, name);
    if (!imitation_params) {
        imitation_table.innerHTML = "";
        let tr = newTr();
        tr.innerHTML = "<td class=\"x_name\" tabindex=\"0\">&nbsp;</td>";
        imitation_table.append(tr);
        tr = newTr();
        tr.innerHTML = "<td class=\"y_name\" tabindex=\"0\">&nbsp;</td>";
        imitation_table.append(tr);
        let x_name = imitation_table.querySelector(".x_name");
        let y_name = imitation_table.querySelector(".y_name");
        let data_index = dataIndex(data, name);
        x_name.innerHTML = data[data_index]["x_name"];
        y_name.innerHTML = data[data_index]["y_name"];
    } else {
        console.log(imitation_params.inner);
        imitation_table.innerHTML = imitation_params.inner;
    }
    let rows = imitation_table.querySelectorAll("tr");
    imitation_table.oncontextmenu = function (e) {
        if (e.target.nodeName == "TD") {
            document.documentElement.dispatchEvent(new Event("click"));
            e.preventDefault();
            let x = e.clientX;
            let y = e.clientY;
            if (col == 0) {
                r_delete_col.style.display = "none";
            } else {
                r_delete_col.style.display = "block";
            }
            right_context_menu.classList.add("active");
            if (y + right_context_menu.getBoundingClientRect().height > chart_div.clientHeight) {
                y = y - right_context_menu.getBoundingClientRect().height - 4;
            }
            if (x + right_context_menu.getBoundingClientRect().width > chart_div.clientWidth) {
                x = x - right_context_menu.getBoundingClientRect().width - 4;
            }
            right_context_menu.style.top = (y + 2) + "px";
            right_context_menu.style.left = (x + 2) + "px";
        }
    }
    document.documentElement.onclick = function (e) {
        let right_context_menus = document.querySelectorAll(".right_context_menu");
        for (let k = 0; k < right_context_menus.length; k++) {
            right_context_menus[k].classList.remove("active");
        }
    }
    r_col.onclick = function (e) {
        addTd(rows[0], rows[0].querySelectorAll("td")[col], true);
        addTd(rows[1], rows[1].querySelectorAll("td")[col]);
        saveInner();
    }
    r_delete_col.onclick = function (e) {
        rows[0].querySelectorAll("td")[col].remove();
        rows[1].querySelectorAll("td")[col].remove();
        saveInner();
    }

    imitation_table.oninput = onInput;

    imitation_table.onmousedown = function (e) {
        if (e.target.nodeName == "TD") {
            let selected_td = e.target;
            selected_td.classList.add("active");
            selected_td.onblur = function (e) {
                e.target.classList.remove("active");
            }
            tds = imitation_table.querySelectorAll("td");
            row_length = rows[0].querySelectorAll("td").length;
            let selected_index = arrayIndex(tds, e.target);
            col = getCol(selected_index, row_length);
        }
    }

    function getImitationParams(data, name) {
        let data_index = dataIndex(data, name, "normal");
        if (data_index == -1) return false;
        if (data[data_index]["imitation"] == null) return false;
        return data[data_index]["imitation"];
    }

    function onInput(e) {
        let data_index = dataIndex(data, name, "normal");
        if (isNaN(parseFloat(+e.target.innerHTML))) {
            e.target.classList.add("error");
            rows[1].querySelectorAll("td")[col].innerHTML = "";
            e.target.onblur = function () {
                e.target.innerHTML = "";
                e.target.classList.remove("error");
                e.target.classList.remove("active");
                saveInner();
            }
            e.target.onmousedown = function () {
                e.target.innerHTML = "";
                e.target.classList.remove("error");
                e.target.classList.add("active");
            }
        } else {
            e.target.classList.remove("error");
            e.target.onblur = function () {
                e.target.classList.remove("active");
                saveInner();
            }
            let coef = data[data_index]["trend"]["coef"];
            let trend_type = data[data_index]["trend"]["trend_type"];
            let level = data[data_index]["trend"]["level"];
            let result = calculate(trend_type, level, coef, e.target.innerHTML);
            rows[1].querySelectorAll("td")[col].innerHTML = isNaN(result) ? "" : result.toFixed(4);
        }
    }

    function saveInner() {
        let tds = imitation_table.querySelectorAll("td");
        for (let k = 0; k < tds.length; k++) {
            tds[k].classList.remove("error");
            tds[k].classList.remove("active");
        }
        let data_index = dataIndex(data, name, "normal");
        let imitation = {
            inner: imitation_table.innerHTML
        }
        data[data_index]["imitation"] = imitation;
    }

    function calculate(trend_type, level, coef, value) {
        return getFunction(trend_type, level)(coef, parseFloat(value));
    }

    function getCol(i, row_length) {
        return i % row_length;
    }

    function addTd(row, cell, editable = false) {
        let td = newTd();
        if (editable) {
            td.setAttribute("contenteditable", "true");
        } else {
            td.setAttribute("tabindex", "0");
        }
        row.insertBefore(td, cell.nextSibling);
    }

    function newTr() { return document.createElement("tr"); }

    function newTd() { return document.createElement("td"); }
}

function addOn2DInterpolationListeners(chart_div, data, name) {
    let plotly_div = chart_div.querySelector(".plotly_div");
    let interpolation_2d_form = chart_div.querySelector(".interpolation_2d_form");
    let select_interpolation_2d_method = interpolation_2d_form.select_interpolation_2d_method;
    let number_2d_interpolation_step = interpolation_2d_form.number_2d_interpolation_step;
    let button_2d_interpolation = interpolation_2d_form.button_2d_interpolation;
    let data_index = dataIndex(data, name);
    setDisabled();
    let color = data[data_index]["line"]["color"].replace("1)", "0.5)");
    select_interpolation_2d_method.onchange = function () {
        let data_index = dataIndex(data, name);
        let value = select_interpolation_2d_method.value;
        if (value == "none") {
            data[data_index]["interpolation"] = null;
        }
        setDisabled();
    }
    button_2d_interpolation.onclick = function () {
        let method = select_interpolation_2d_method.value;
        let data_index = dataIndex(data, name);
        let data_v = validateDataForCalculations(data, name, "0");
        if (method == "1") {
            let x_arr = data_v[data_index]["x"];
            let y_arr = data_v[data_index]["y"];
            /*y_arr = [33.1154, 34.8138, 36.5982, 38.4747, 40.4473, 42.5211,
                44.7012, 46.9931, 49.4024, 51.9354, 54.5982, 57.3975, 60.3403];
            x_arr = [3.5, 3.55, 3.6, 3.65, 3.7, 3.75, 3.8, 3.85, 3.9, 3.95, 4.0, 4.05, 4.1];*/
            console.log(x_arr);
            console.log(y_arr);
            let [b, c, d] = process_th_spl(x_arr, y_arr);
            /*console.log(data_v[data_index]["x"]);
            console.log( data_v[data_index]["y"]);*/
            let step = parseFloat(number_2d_interpolation_step.value);
            if (isNaN(step) || x_arr.length < 2) return;
            let res_x = [], res_y = [];
            console.log("step " + step);
            for (let x = x_arr[0]; x <= x_arr[x_arr.length - 1]; x += step) {
                res_x.push(x);
                res_y.push(get_th_spl(x_arr, y_arr, b, c, d, x));
            }
            /*for (let k = 0; k < x_arr.length; k++) {
                res_x.push(x_arr[k]);
                res_y.push(get_th_spl(x_arr, y_arr, b, c, d, x_arr[k]));
            }*/
            console.log(res_x);
            console.log(res_y);
            replaceIfExist(data, name, "interpolation");
            addTo2DInterpolationData(data, res_x, res_y, name + " тренд", color, "interpolation")
            newPlot(plotly_div, data, "0");
        }
    }
    function setDisabled() {
        let value = select_interpolation_2d_method.value;
        number_2d_interpolation_step.disabled = value == "none";
        button_2d_interpolation.disabled = value == "none";
    }
}

function validateNumberInput(number_input) {
    let value = number_input.value;
    if (value > parseFloat(number_input.max)) {
        number_input.value = number_input.max;
    } else if (value < parseFloat(number_input.min) || isNaN(parseFloat(value))) {
        number_input.value = number_input.min;
    }
}

function validateDataForCalculations(data, name, type) {
    let data_index = dataIndex(data, name);
    let data_v = getValidatedData(data, type);
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

function replaceIfExist(data, name, which = null) {
    let data_index = dataIndex(data, name + " тренд", which);
    while (data_index != -1) {
        data.splice(data_index, 1);
        data_index = dataIndex(data, name + " тренд", which);
    }
}

function addTo2DInterpolationData(data, x_arr, y_arr, name, color, which) {
    let trace = {
        x: x_arr,
        y: y_arr,
        type: "scatter",
        name: name,
        connectgaps: true,
        line: {
            dash: "solid",
            color: color
        },
        which: which
    };
    data.push(trace);
}


function addToOptimisationPointData(data, x, y, name, color, which) {
    let trace = {
        x: x,
        y: y,
        mode: "markers",
        name: name,
        marker: {
            color: color,
            size: 12
        },
        showlegend: false,
        which: which
    };
    data.push(trace);
}

function addToOptimisationBordersData(data, x_arr, y_arr, name, color, which) {
    let trace = {
        x: x_arr,
        y: y_arr,
        line: {
            dash: "dot",
            color: color
        },
        mode: "lines",
        name: name,
        type: "scatter",
        showlegend: false,
        which: which
    };
    data.push(trace);
}

function addToErrorBarData(data, x_arr, y_arr, name, fill, fillcolor, marker_color, which) {
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
        showlegend: false,
        which: which
    };
    data.push(trace);
}

function addToTrendData(data, x_arr, y_arr, name, color, which) {
    let trace = {
        x: x_arr,
        y: y_arr,
        type: "scatter",
        name: name,
        connectgaps: true,
        line: {
            dash: "dash",
            color: color
        },
        which: which
    };
    data.push(trace);
}

function addTo3DData(data, x_arr, y_arr, z_arr, year_arr, name, x_name, y_name, z_name, color, which) {
    let y_arr_sorted = [],
        z_arr_sorted = [],
        year_arr_sorted = [];
    //сортировка по возрастанию х
    let x_arr_sorted = x_arr.slice();
    x_arr_sorted.sort(function (a, b) { return a - b });
    for (let k = 0; k < x_arr.length; k++) {
        let old_index = arrayIndex(x_arr, x_arr_sorted[k]);
        y_arr_sorted.push(y_arr[old_index]);
        z_arr_sorted.push(z_arr[old_index]);
        year_arr_sorted.push(year_arr[old_index]);
        x_arr[old_index] = null;
    }

    let trace = {
        years: year_arr_sorted,
        x: x_arr_sorted,
        y: y_arr_sorted,
        z: z_arr_sorted,
        type: "mesh3d",
        opacity: 0.8,
        color: color,
        name: name,
        year_name: "Год",
        x_name: x_name,
        y_name: y_name,
        z_name: z_name,
        connectgaps: true,
        showlegend: true,
        which: which
    };
    data.push(trace);
}

function addTo2DData(data, x_arr, y_arr, year_arr, name, x_name, y_name, color, which, trend = null, optimisation = null, imitation = null, interpolation = null) {
    let y_arr_sorted = [],
        year_arr_sorted = [];
    //сортировка по возрастанию х
    let x_arr_sorted = x_arr.slice();
    x_arr_sorted.sort(function (a, b) { return a - b });
    for (let k = 0; k < x_arr.length; k++) {
        let old_index = arrayIndex(x_arr, x_arr_sorted[k]);
        y_arr_sorted.push(y_arr[old_index]);
        year_arr_sorted.push(year_arr[old_index]);
        x_arr[old_index] = null;
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
            dash: "solid",
            color: color
        },
        which: which,
        trend: trend,
        optimisation: optimisation,
        imitation: imitation,
        interpolation: interpolation
    };
    data.push(trace);
    //console.log(data);
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

function dataIndex(data, name, which = null) {
    for (let k = 0; k < data.length; k++) {
        if (data[k]["name"] == name) {
            if (which != null) {
                if (data[k]["which"] == which) {
                    return k;
                } else {
                    continue;
                }
            }
            return k;
        }
    }
    return -1;
}

function setChartLayout(plotly_div) {
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