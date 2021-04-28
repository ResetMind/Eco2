let chart_rectangle_template = document.querySelector("div.chart_rectangle_template");
let old_rectangle = null;
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

function addChart(chart_div, data, type, plotly_num) {
    let form = chart_div.querySelector(".param_form");

    let x_col = parseFloat(form.x_select_param.value);
    let x_index = form.x_select_param.selectedIndex;
    let x_text = form.x_select_param[x_index].text;
    let cx_index = form.x_select_culture.selectedIndex;
    let cx_text = cx_index > 0 ? form.x_select_culture[cx_index].text : "";
    let fx_index = form.x_select_field.selectedIndex;
    let fx_text = fx_index > 0 ? form.x_select_field[fx_index].text : "";

    let y_col = parseFloat(form.y_select_param.value);
    let y_index = form.y_select_param.selectedIndex;
    let y_text = form.y_select_param[y_index].text;
    let cy_index = form.y_select_culture.selectedIndex;
    let cy_text = cy_index > 0 ? form.y_select_culture[cy_index].text : "";
    let fy_index = form.y_select_field.selectedIndex;
    let fy_text = fy_index > 0 ? form.y_select_field[fy_index].text : "";

    let z_col, z_text, cz_text, fz_text;
    if (type == 1) {
        z_col = parseFloat(form.z_select_param.value);
        let z_index = form.z_select_param.selectedIndex;
        z_text = form.z_select_param[z_index].text;
        let cz_index = form.z_select_culture.selectedIndex;
        cz_text = cz_index > 0 ? form.z_select_culture[cz_index].text : "";
        let fz_index = form.z_select_field.selectedIndex;
        fz_text = fz_index > 0 ? form.z_select_field[fz_index].text : "";
    }
    if (isNaN(x_col) || isNaN(y_col) || (type == 1 && isNaN(z_col))) {
        showPopup(popup, "Не выбраны параметры");
        return;
    }
    let x_arr = [],
        y_arr = [],
        z_arr = [],
        year_arr = [];
    let rows = main_table_body.querySelectorAll("tr");
    for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].querySelectorAll("td");
        let x = parseFloat(cells[x_col].innerHTML);
        let f = cells[1].innerHTML;
        let c = cells[2].innerHTML;
        if (isNaN(x) || c.indexOf(cx_text) == -1 || f.indexOf(fx_text) == -1) {
            continue;
        }
        x_arr.push(x);
        year_arr.push(cells[0].innerHTML);

        let y = parseFloat(cells[y_col].innerHTML);
        if (isNaN(y) || c.indexOf(cy_text) == -1 || f.indexOf(fy_text) == -1) {
            y_arr.push(null);
        } else {
            y_arr.push(y);
        }

        if (type == 1) {
            let z = parseFloat(tds[z_col].innerHTML);
            if (isNaN(z) || c.indexOf(cz_text) == -1 || f.indexOf(fz_text) == -1) {
                z_arr.push(null);
            } else {
                z_arr.push(z);
            }
        }
    }
    if (x_arr.length < 2 || isAllNull(y_arr) || (type == 1 && isAllNull(z_arr))) {
        showPopup(popup, "Недостаточно данных для построения");
    } else {
        let name = y_text;
        if (type == 1) name += ", " + z_text + " от " + x_text;
        else name += " от " + x_text;
        console.log(name);
        if (getDataIndex(data, name) != -1) {
            showPopup(popup, "График уже построен");
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
            addChartRectangle(chart_div, data, name, 0, plotly_num);
        } else if (type == 1) {
            //addTo3DData(data, x_arr, y_arr, z_arr, year_arr, name, x_text, y_text, z_text, colors[color_index], "normal");
            //newPlot(chart_div.querySelector(".plotly_div"), data, type);
            //addChartRectangle(chart_div, data, name, "1").onclick = onChartrectangleClick.bind(null, chart_div, trends, interpolation, data, name, "1", plotly_num);
        }
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
}

function addTo2DData(data, x_arr, y_arr, year_arr, name, x_name, y_name, color, which, trend = null, forecast = null, imitation = null, interpolation = null) {
    let y_arr_sorted = [],
        year_arr_sorted = [];
    //сортировка по возрастанию х
    let x_arr_sorted = x_arr.slice();
    x_arr_sorted.sort(function(a, b) { return a - b });
    for (let k = 0; k < x_arr.length; k++) {
        let old_index = getArrayIndex(x_arr, x_arr_sorted[k]);
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
        forecast: forecast,
        imitation: imitation,
        interpolation: interpolation
    };
    data.push(trace);
    //console.log(data);
}

function newPlot(plotly_div, data, type) {
    Plotly.newPlot(plotly_div, getValidatedData(data, type), setChartLayout(plotly_div), { scrollZoom: true, responsive: true });
}

function addChartRectangle(chart_div, data, name, type, plotly_num) {
    let chart_rectangle = document.createElement("div");
    chart_rectangle.className = "chart_rectangle";
    chart_rectangle.innerHTML = chart_rectangle_template.innerHTML;
    chart_div.querySelector(".chart_rectangles").append(chart_rectangle);
    chart_rectangle.querySelector(".chart_rectangle_name").innerHTML = name;
    chart_rectangle.querySelector("span.delete_chart").onclick = deleteChartRectangle;
    chart_rectangle.onclick = onChartRectangleClick;
    
    function deleteChartRectangle() {
        window.event.stopPropagation();
        if (chart_rectangle.classList.contains("active")) {
            chart_div.querySelector(".chart_settings").classList.remove("active");
        }
        chart_rectangle.remove();
        let data_index = getDataIndex(data, name);
        if (type == 0) {
            let color = data[data_index]["line"]["color"];
            let color_index = getArrayIndex(colors, color);
            colors.push(...colors.splice(color_index, 1));
            //console.log(colors);
        }
        if (data_index != -1) {
            data.splice(getDataIndex(data, name), 1);
        }
        removeAnalisys(name + " тренд");
        removeAnalisys(name + " прогноз");
        newPlot(chart_div.querySelector(".plotly_div"), data, type);

        function removeAnalisys(name) {
            while (getDataIndex(data, name) != -1) {
                data.splice(getDataIndex(data, name), 1);
                //console.log(data);
            }
        }
    }

    function onChartRectangleClick() {
        let chart_settings = chart_div.querySelector(".chart_settings");
        let chart_rectangles = chart_div.querySelector(".chart_rectangles");
        let chart_data = chart_settings.querySelector(".chart_data");
        let rectangles = chart_rectangles.querySelectorAll(".chart_rectangle");
        //console.log(rectangles);
        let rectangle = window.event.target;
        if(rectangle.className != "chart_rectangle") {
            rectangle = window.event.target.parentNode;
        }
        if (rectangle.classList.contains("active")) {
            rectangle.classList.remove("active");
            chart_settings.classList.remove("active");
            chart_data.innerHTML = "";
            //chart_stuff.innerHTML = "";
        } else {
            for (let k = 0; k < rectangles.length; k++) {
                rectangles[k].classList.remove("active");
                if (k == 0) {
                    chart_settings.classList.remove("active");
                    chart_data.innerHTML = "";
                    //chart_stuff.innerHTML = "";
                }
            }
            rectangle.classList.add("active");
            chart_data.append(createDataTable());
            //if (trends != null) chart_stuff.append(trends);
            //chart_stuff.append(interpolation);
            chart_settings.classList.add("active");
            addOnCheckboxChangeListeners();
            if (type == 0) {
                //addOn2DOptimisationParamsListeners(chart_div, data, name);
                addOn2DTrendsParamsChangeListeners(chart_div, data, name);
                //addOn2DImitationListeners(chart_div, data, name);
                //addOn2DInterpolationListeners(chart_div, data, name);
            }
        }

        function addOnCheckboxChangeListeners() {
            let checkboxes = chart_data.querySelectorAll("input[type='checkbox']")
            let data_index = getDataIndex(data, name);
            let checked_count = 1;
            for (let k = 0; k < data[data_index]["x"].length; k++) {
                if ((data[data_index]["x"][k] + "").indexOf("<label>") == -1) {
                    checkboxes[k + 1].checked = true;
                    checked_count++;
                }
            }
            if (checked_count == checkboxes.length) checkboxes[0].checked = true;
            for (let k = 0; k < checkboxes.length; k++) {
                checkboxes[k].onchange = onCheckboxChange.bind(null, k);
            }
        
            function onCheckboxChange(index) {
                let data_index = getDataIndex(data, name);
                if (index == 0) {
                    let all_checked = checkboxes[index].checked == true;
                    for (let k = 1; k < checkboxes.length; k++) {
                        checkboxes[k].checked = all_checked;
                        if (all_checked) {
                            data[data_index]["x"][k - 1] = removeLabel(data[data_index]["x"][k - 1] + "");
                        } else {
                            data[data_index]["x"][k - 1] = addLabel(data[data_index]["x"][k - 1] + "");
                        }
                    }
                } else {
                    if (checkboxes[index].checked) {
                        data[data_index]["x"][index - 1] = removeLabel(data[data_index]["x"][index - 1] + "");
                    } else {
                        data[data_index]["x"][index - 1] = addLabel(data[data_index]["x"][index - 1] + "");
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
        
                if (type == 0) chart_div.querySelector(".trend_2d_form").select_2d_trend_type.dispatchEvent(new Event("change"));
                else if (type == 1) newPlot(chart_div.querySelector(".plotly_div"), data, "1");
        
                function addLabel(x) {
                    if (x.indexOf("<label>") == -1 && x.indexOf("</label>") == -1) {
                        return "<label>" + x + "</label>";
                    }
                    return x;
                }
        
                function removeLabel(x) {
                    x = x.replace("<label>", "");
                    x = x.replace("</label>", "");
                    return x;
                }
            }
        }

        function createDataTable() {
            let data_index = getDataIndex(data, name);
            if (data_index == -1) {
                return;
            }
            let table = document.createElement("table");
            table.classList.add("checkbox_table");
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
                input.classList.add("chart_checkbox");
                let label = document.createElement("label");
                label.htmlFor = "chart_checkbox" + num;
                td.append(input, label);
                return td.innerHTML;
            }
        
            function newTr() { return document.createElement("tr"); }
        
            function newTd() { return document.createElement("td"); }
        
            function newTh() { return document.createElement("th"); }
        }
    }
}

function addOn2DTrendsParamsChangeListeners(chart_div, data, name) {
    let trends_2d = chart_div.querySelector(".trends_2d");
    let r_span = trends_2d.querySelector(".r");
    let a_span = trends_2d.querySelector(".a");
    let trend_function_span = trends_2d.querySelector(".trend_function");
    let results_div = document.querySelector(".trends_2d_results");
    let trend_2d_form = trends_2d.querySelector(".trend_2d_form");
    let plotly_div = chart_div.querySelector(".plotly_div");

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
    let trend_params = getTrendParams(data, name);
    //console.log(trend_params);
    if (!trend_params) {
        trend_2d_form.select_2d_trend_type.value = "none";
        trend_2d_form.number_2d_trend_level.value = "2";
        trend_2d_form.number_2d_trend_back.value = "0";
        trend_2d_form.number_2d_trend_forward.value = "0";
        trend_2d_form.number_2d_trend_step.value = "1";
        removeResults();
    } else {
        trend_2d_form.select_2d_trend_type.value = trend_params.trend_type;
        trend_2d_form.number_2d_trend_level.value = trend_params.level;
        trend_2d_form.number_2d_trend_back.value = trend_params.back;
        trend_2d_form.number_2d_trend_forward.value = trend_params.forward;
        trend_2d_form.number_2d_trend_step.value = trend_params.step;
        showFunction(trend_params.trend_type, trend_params.coef, trend_params.level);
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
        let data_index = getDataIndex(data, name);
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
            replaceIfExist(data, name, "trendt");
            let trend = {
                trend_type: type,
                level: level,
                back: back,
                forward: forward,
                step: step,
                r: xy.r,
                a: xy.a,
                coef: xy.coef
            }
            //addTo2DData(false, data, xy.x_tr, xy.y_tr, null, name + " тренд", "", "", color, "dash", "trendt", trend);
            data[data_index]["trend"] = trend;
            addToTrendData(data, xy.x_tr, xy.y_tr, name + " тренд", color, "trendt");
            newPlot(plotly_div, data, 0);
            showErrors(xy.r, xy.a);
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

        function removeTrend() {
            replaceIfExist(data, name);
            newPlot(plotly_div, data, 0);
            removeResults();
        }
    }

    function getTrendParams(data, name) {
        let data_index = getDataIndex(data, name, "normal");
        if (data_index == -1) return false;
        if (data[data_index]["trend"] == null) return false;
        return data[data_index]["trend"];
        //console.log(data[data_index]["trend"]["trend_type"]);
    }

    function showFunction(type, coef, level = null) {
        //console.log(coef);
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
        results_div.classList.add("active");
    }

    function removeResults() {
        results_div.classList.remove("active");
    }
}

function addOn2DForecastChangeListeners() {

    function showStuffParts() {
        imitation_2d.classList.add("active");
        setDisabledInputs(imitation_2d, false);
    }

    function removeStuffParts() {
        imitation_2d.classList.remove("active");
        setDisabledInputs(imitation_2d, true);
    }

    function setDisabledInputs(stuff_2d_part, disabled) {
        let inputs = stuff_2d_part.querySelectorAll("input");
        let selects = stuff_2d_part.querySelectorAll("select");
        for(let i = 0; i < inputs.length; i++) {
            inputs[i].disabled = disabled;
        }
        for(let i = 0; i < selects.length; i++) {
            selects[i].disabled = disabled;
        }
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
    let data_index = getDataIndex(data, name);
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
    try {
        Plotly.relayout(plotly_div, update);
    } catch (e) {}
}

function replaceIfExist(data, name, which = null) {
    let data_index = getDataIndex(data, name + " тренд", which);
    while (data_index != -1) {
        data.splice(data_index, 1);
        data_index = getDataIndex(data, name + " тренд", which);
    }
}

function getDataIndex(data, name, which = null) {
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