let chart_rectangle_template = document.querySelector("div.chart_rectangle_template");
let imitation_table_body_template = document.querySelector("table.imitation_table_body_template");
let imitation_row_control_template = document.querySelector("div.imitation_row_control_template");
let imitation_header_template = document.querySelector("table.imitation_header_template");
let im_data_observer;
let observing = [];

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

function addChart(chart_div, data, data_im, type, plotly_num) {
    let form = chart_div.querySelector(".param_form");

    let x_col = parseFloat(form.x_select_param.value);
    let x_index = form.x_select_param.selectedIndex;
    let x_text = form.x_select_param[x_index].text;
    let x_short_name = form.x_select_param[x_index].className;
    let cx_index = form.x_select_culture.selectedIndex;
    let cx_text = cx_index > 0 ? form.x_select_culture[cx_index].text : "";
    let fx_index = form.x_select_field.selectedIndex;
    let fx_text = fx_index > 0 ? form.x_select_field[fx_index].text : "";

    let y_col = parseFloat(form.y_select_param.value);
    let y_index = form.y_select_param.selectedIndex;
    let y_text = form.y_select_param[y_index].text;
    let y_short_name = form.y_select_param[y_index].className;
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
    let color_index = getFreeColor(data);
    if (x_arr.length < 2 || isAllNull(y_arr) || (type == 1 && isAllNull(z_arr))) {
        showPopup(popup, "Недостаточно данных для построения");
    } else if (color_index == -1) {
        showPopup(popup, "Слишком много графиков");
    } else {
        let name = y_text;
        if (type == 1) name += ", " + z_text + " от " + x_text;
        else name += " от " + x_text;
        console.log(name);
        if (getDataIndex(data, name) != -1) {
            showPopup(popup, "График уже построен");
            return;
        }

        if (type == 0) {
            addTo2DData(data, x_arr, y_arr, year_arr, name, x_short_name + y_short_name, x_text, y_text, colors[color_index], "normal");
            newPlot(chart_div.querySelector(".plotly_div"), data, type);
            addChartRectangle(chart_div, data, data_im, name, 0, plotly_num);
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

function addTo2DData(data, x_arr, y_arr, year_arr, name, short_name, x_name, y_name, color, which, trend = null, forecast = null, imitation = null, interpolation = null) {
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
        short_name: short_name,
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

function addChartRectangle(chart_div, data, data_im, name, type, plotly_num) {
    let chart_rectangle = document.createElement("div");
    chart_rectangle.className = "chart_rectangle";
    chart_rectangle.innerHTML = chart_rectangle_template.innerHTML;
    chart_div.querySelector(".chart_rectangles").append(chart_rectangle);
    chart_rectangle.querySelector(".chart_rectangle_name").innerHTML = name;
    chart_rectangle.querySelector("span.delete_chart").onclick = deleteChartRectangle;
    chart_rectangle.onclick = onChartRectangleClick;
    //
    chart_rectangle.dispatchEvent(new Event("click"));

    function deleteChartRectangle() {
        window.event.stopPropagation();
        if (chart_rectangle.classList.contains("active")) {
            chart_div.querySelector(".chart_settings").classList.remove("active");
        }
        chart_rectangle.remove();
        let data_index = getDataIndex(data, name);
        if (data_index != -1) {
            data.splice(getDataIndex(data, name), 1);
        }
        deleteAnalisis(name + " (тренд)");
        deleteAnalisis(name + " (прогноз)");
        newPlot(chart_div.querySelector(".plotly_div"), data, type);

        for (let i = 0; i < data.length; i++) {
            if (data[i]["which"] == "normal") {
                addOn2DForecastParamsChangeListeners(chart_div, data, data_im, data[i]["name"], plotly_num);
                addOn2DTrendsParamsChangeListeners(chart_div, data, data[i]["name"]);
            }
        }

        function deleteAnalisis(name) {
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
        if (rectangle.className != "chart_rectangle") {
            rectangle = window.event.target.parentNode;
        }
        if (rectangle.classList.contains("active")) {
            rectangle.classList.remove("active");
            chart_settings.classList.remove("active");
            chart_data.innerHTML = "";
            updateDataIm(window.active_table, rectangle.querySelector(".chart_rectangle_name").innerHTML);
        } else {
            for (let k = 0; k < rectangles.length; k++) {
                if (rectangles[k].classList.contains("active")) {
                    rectangles[k].classList.remove("active");
                    updateDataIm(window.active_table, rectangles[k].querySelector(".chart_rectangle_name").innerHTML);
                }
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
                addOn2DForecastParamsChangeListeners(chart_div, data, data_im, name, plotly_num);
                addOn2DTrendsParamsChangeListeners(chart_div, data, name);
                //addOn2DImitationListeners(chart_div, data, name);
                //addOn2DInterpolationListeners(chart_div, data, name);
            }
        }

        function updateDataIm(table, name) {
            if (!table) return;
            if (!table.classList.contains("imitation_table")) return;
            addOn2DImitationParamsChangeListeners({ table: table, data_im: data_im, name: name, update_data_im: true });
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

                if (type == 0) {
                    chart_div.querySelector(".trend_2d_form").select_2d_trend_type.dispatchEvent(new Event("change"));
                    addOn2DForecastParamsChangeListeners(chart_div, data, data_im, name, plotly_num);
                    chart_div.querySelector(".forecast_2d_form").forecast_2d_button.dispatchEvent(new Event("click"));
                } else if (type == 1) newPlot(chart_div.querySelector(".plotly_div"), data, "1");

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
            tr.append(newTh({ inner: newCheckboxCell("_" + plotly_num + "_all") }));
            tr.append(newTh({ inner: data[data_index]["year_name"] }));
            if (!is_year_chart) {
                tr.append(newTh({ inner: data[data_index]["x_name"] }));
            }
            tr.append(newTh({ inner: data[data_index]["y_name"] }));
            if (type == 1) tr.append(newTh({ inner: data[data_index]["z_name"] }));
            table.append(tr);
            //add td
            for (let k = 0; k < data[data_index]["x"].length; k++) {
                tr = newTr();
                tr.append(newTd({ inner: newCheckboxCell(plotly_num + "_" + k) }));
                if (!is_year_chart) {
                    tr.append(newTd({ inner: data[data_index]["years"][k] }));
                }
                tr.append(newTd({ inner: data[data_index]["x"][k] }));
                tr.append(newTd({ inner: data[data_index]["y"][k] }));
                if (type == 1) tr.append(newTd({ inner: data[data_index]["z"][k] }));
                table.append(tr);
            }
            return table;

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
        }
    }
}

function addOn2DTrendsParamsChangeListeners(chart_div, data, name) {
    let trends_2d = chart_div.querySelector(".trends_2d");
    let r_span = trends_2d.querySelector(".r");
    let a_span = trends_2d.querySelector(".a");
    let results_div = document.querySelector(".trends_2d_results");
    let trend_2d_form = trends_2d.querySelector(".trend_2d_form");
    let plotly_div = chart_div.querySelector(".plotly_div");

    trend_2d_form.select_2d_trend_type.onchange = function() {
        setDisabled();
        addTrend(trend_2d_form.select_2d_trend_type.value, data, name);
    }
    trend_2d_form.number_2d_trend_level.onchange = function() {
        //console.log("number_2d_trend_level");
        validateNumberInput(trend_2d_form.number_2d_trend_level);
        addTrend(trend_2d_form.select_2d_trend_type.value, data, name);
    }
    trend_2d_form.number_2d_trend_back.onchange = function() {
        //console.log("number_2d_trend_back");
        validateNumberInput(trend_2d_form.number_2d_trend_back);
        addTrend(trend_2d_form.select_2d_trend_type.value, data, name);
    }
    trend_2d_form.number_2d_trend_forward.onchange = function() {
        //console.log("number_2d_trend_forward");
        validateNumberInput(trend_2d_form.number_2d_trend_forward);
        addTrend(trend_2d_form.select_2d_trend_type.value, data, name);
    }
    trend_2d_form.number_2d_trend_step.onchange = function() {
        //console.log("number_2d_trend_step");
        validateNumberInput(trend_2d_form.number_2d_trend_step);
        addTrend(trend_2d_form.select_2d_trend_type.value, data, name);
    }
    let trend_params = getAnalisisParams(data, name, "trend");
    //console.log(trend_params);
    if (!trend_params) {
        trend_2d_form.select_2d_trend_type.value = "none";
        trend_2d_form.number_2d_trend_level.value = "2";
        trend_2d_form.number_2d_trend_back.value = "0";
        trend_2d_form.number_2d_trend_forward.value = "0";
        trend_2d_form.number_2d_trend_step.value = "1";
        removeAnalisysResults(results_div);
    } else {
        trend_2d_form.select_2d_trend_type.value = trend_params.trend_type;
        trend_2d_form.number_2d_trend_level.value = trend_params.level;
        trend_2d_form.number_2d_trend_back.value = trend_params.back;
        trend_2d_form.number_2d_trend_forward.value = trend_params.forward;
        trend_2d_form.number_2d_trend_step.value = trend_params.step;
        showErrors(trend_params.r, trend_params.a);
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
        let data_v = validateDataForCalculations(data, name, 0);
        if (type == "0") {
            let xy = linear(data_v[data_index]["x"], data_v[data_index]["y"], parseFloat(back), parseFloat(forward), parseFloat(step));
            showTrend(xy);
        } else if (type == "1") {
            let xy = hyperbole(data_v[data_index]["x"], data_v[data_index]["y"], parseFloat(back), parseFloat(forward), parseFloat(step));
            showTrend(xy);
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
        } else if (type == "3") {
            let xy = exponent(data_v[data_index]["x"], data_v[data_index]["y"], parseFloat(back), parseFloat(forward), parseFloat(step));
            showTrend(xy);
        } else if (type == "4") {
            let xy = stepennaya(data_v[data_index]["x"], data_v[data_index]["y"], parseFloat(back), parseFloat(forward), parseFloat(step));
            showTrend(xy);
        } else if (type == "none") {
            removeAnalysis(data, name + " (тренд)", results_div, plotly_div);
        }

        function showTrend(xy) {
            removeIfExist(data, name + " (тренд)");
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
            data[data_index]["trend"] = trend;
            addToAnalysisData(data, xy.x_tr, xy.y_tr, name + " (тренд)", color, "trendt", "dash");
            newPlot(plotly_div, data, 0);
            showErrors(xy.r, xy.a);
        }
    }

    function showErrors(r, a) {
        r_span.innerHTML = "R<sup>2</sup> = " + r;
        a_span.innerHTML = "A = " + a;
        results_div.classList.add("active");
    }
}

function addOn2DForecastParamsChangeListeners(chart_div, data, data_im, name, plotly_num) {
    let forecast_2d = chart_div.querySelector(".forecast_2d");
    let mse_span = forecast_2d.querySelector(".mse");
    let llf_span = forecast_2d.querySelector(".llf");
    let results_div = forecast_2d.querySelector(".forecast_2d_results");
    let forecast_2d_form = forecast_2d.querySelector(".forecast_2d_form");
    let plotly_div = chart_div.querySelector(".plotly_div");
    let imitation_div = chart_div.querySelector(".imitation_div");
    let table = imitation_div.querySelector(".table");

    let data_index = getDataIndex(data, name);
    let forecast_color = data[data_index]["line"]["color"];
    let data_v = validateDataForCalculations(data, name, 0);
    let y = data_v[data_index]["y"];

    forecast_2d_form.arima_k.max = y.length;

    forecast_2d_form.arima_p.onchange = function() {
        validateNumberInput(forecast_2d_form.arima_p);
    }
    forecast_2d_form.arima_d.onchange = function() {
        validateNumberInput(forecast_2d_form.arima_d);
    }
    forecast_2d_form.arima_q.onchange = function() {
        validateNumberInput(forecast_2d_form.arima_q);
    }
    forecast_2d_form.arima_k.onchange = function() {
        validateNumberInput(forecast_2d_form.arima_k);
    }
    forecast_2d_form.arima_n.onchange = function() {
        validateNumberInput(forecast_2d_form.arima_n);
    }
    forecast_2d_form.select_2d_forecast_type.onchange = function() {
        setDisabled();
        if (forecast_2d_form.select_2d_forecast_type.value == "none") {
            removeAnalysis(data, name + " (прогноз)", results_div, plotly_div);
            data_im[name] = [];
            data[data_index]["imitation"] = null;
            imitation_div.classList.remove("active");
        }
    }
    forecast_2d_form.imitation_checkbox.onchange = function() {
        if (forecast_2d_form.imitation_checkbox.checked) {
            data[data_index]["imitation"] = true;
            forecast_2d_form.arima_k.value = "";
            if (forecast_2d_form.auto_arima_checkbox.checked) {
                forecast_2d_form.auto_arima_checkbox.checked = false;
            }
        } else {
            data_im[name] = [];
            data[data_index]["imitation"] = null;
            forecast_2d_form.arima_k.value = y.length;
            imitation_div.classList.remove("active");
        }
        forecast_2d_form.arima_k.disabled = forecast_2d_form.imitation_checkbox.checked;
        forecast_2d_form.auto_arima_checkbox.disabled = forecast_2d_form.imitation_checkbox.checked;
    }
    forecast_2d_form.forecast_2d_button.onclick = function() {
        data_v = validateDataForCalculations(data, name, 0);
        let x = data_v[data_index]["x"];
        y = data_v[data_index]["y"];
        let p = parseFloat(forecast_2d_form.arima_p.value);
        let d = parseFloat(forecast_2d_form.arima_d.value);
        let q = parseFloat(forecast_2d_form.arima_q.value);
        let k = parseFloat(forecast_2d_form.arima_k.value);
        if (isNaN(k)) k = y.length;
        let n = parseFloat(forecast_2d_form.arima_n.value);
        let order = [p, d, q];
        let auto = forecast_2d_form.auto_arima_checkbox.checked ? 1 : 0;
        let path = email + "/" + getYSum(y) + "_" + data_v[data_index]["short_name"] + "_[" + order + "].pickle";
        data_im[name] = [];
        let json = {
            "y": y,
            "x": x,
            "order": order,
            "k": k,
            "prlen": n,
            "auto": auto,
            "path": path
        }
        arima([json]);
    }

    //setTimeout(() => forecast_2d_form.forecast_2d_button.dispatchEvent(new Event("click")), 300);

    //
    //forecast_2d_form.select_2d_forecast_type.value = "0";
    //forecast_2d_form.forecast_2d_button.dispatchEvent(new Event("click"));

    let forecast_params = getAnalisisParams(data, name, "forecast");
    if (!forecast_params) {
        forecast_2d_form.select_2d_forecast_type.value = "none";
        forecast_2d_form.arima_p.value = "1";
        forecast_2d_form.arima_d.value = "1";
        forecast_2d_form.arima_q.value = "1";
        forecast_2d_form.arima_k.value = y.length;
        forecast_2d_form.arima_n.value = "1";
        removeAnalisysResults(results_div);
    } else {
        forecast_2d_form.select_2d_forecast_type.value = "0";
        forecast_2d_form.arima_p.value = forecast_params.p;
        forecast_2d_form.arima_d.value = forecast_params.d;
        forecast_2d_form.arima_q.value = forecast_params.q;
        forecast_2d_form.arima_k.value = forecast_params.k;
        forecast_2d_form.arima_n.value = forecast_params.n;
        showErrors(forecast_params.mse, forecast_params.llf);
    }
    let imitation_params = getAnalisisParams(data, name, "imitation");
    if (imitation_params) {
        forecast_2d_form.imitation_checkbox.checked = true;
        forecast_2d_form.arima_k.value = "";
        imitation_div.classList.add("active");
        addOn2DImitationParamsChangeListeners({ table: table, data_im: data_im, name: name, plotly_num: plotly_num });
    } else {
        forecast_2d_form.imitation_checkbox.checked = false;
        imitation_div.classList.remove("active");
    }
    setDisabled();

    function setDisabled() {
        let select_2d_forecast_type_value = forecast_2d_form.select_2d_forecast_type.value;
        let flag = select_2d_forecast_type_value == "none";
        forecast_2d_form.arima_p.disabled = flag;
        forecast_2d_form.arima_d.disabled = flag;
        forecast_2d_form.arima_q.disabled = flag;
        forecast_2d_form.arima_k.disabled = flag;
        forecast_2d_form.arima_n.disabled = flag;
        forecast_2d_form.auto_arima_checkbox.disabled = flag;
        forecast_2d_form.imitation_checkbox.disabled = flag;
        forecast_2d_form.forecast_2d_button.disabled = flag;
    }

    //fillImitationTable();

    function arima(jsons) {
        let results = [];
        for (let i = 0; i < jsons.length; i++) {
            let result = fetch("/eco2/cgi/arima.cgi", {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=utf-8" },
                body: JSON.stringify(jsons[i])
            }).then(
                response => {
                    if (response.status != 200) {
                        return {
                            status: response.status
                        };
                    } else {
                        return response.json();
                    }
                }
            );
            results.push(result);
        }
        fadeIn(document.querySelector(".loader"), 0.5);
        Promise.all(results).then(values => {
            fadeOut(document.querySelector(".loader"), 0.5);
            let errors = "";
            for (let i = 0; i < values.length; i++) {
                console.log(values[i]);
                if (values[i].status && values[i].status != 200) {
                    errors += i + ": Ошибка сервера " + values[i].status + "<br>";
                } else if (!values[i]) {
                    errors += i + ": Ошибка сервера" + "<br>";
                } else if (values[i]["error"] != -1 && values[i]["yhat"] == -1) {
                    errors += i + ": " + values[i]["error"] + "<br>";
                }
                if (values[i]["yhat"] != -1) {
                    forecast_2d_form.arima_p.value = values[i]["order"][0];
                    forecast_2d_form.arima_d.value = values[i]["order"][1];
                    forecast_2d_form.arima_q.value = values[i]["order"][2];
                    let x_old = jsons[i]["x"];
                    let y_old = jsons[i]["y"];

                    let x_new = values[i]["x"];
                    let yhat = values[i]["yhat"];
                    let k = values[i]["k"];
                    let n = values[i]["prlen"];
                    let auto = values[i]["auto"];
                    let [p, d, q] = values[i]["order"];
                    let mse = values[i]["mse"];
                    let llf = values[i]["llf"];
                    for (let j = k; j < x_old.length + n; j++) {
                        if (j < x_old.length) {
                            x_new.push(x_old[j]);
                        } else {
                            x_new.push(x_new.last() + 1);
                        }
                    }
                    let color_index = getFreeColor(data_im[name]);
                    showForecast(x_new, yhat, p, d, q, k, n, auto, mse, llf);
                    addToImitationData(x_old, y, data_im, name, colors[color_index], "normal", "solid");
                    addToImitationData(x_new, yhat, data_im, name, colors[color_index], "imitation", "dash");
                    if (forecast_2d_form.imitation_checkbox.checked) {
                        imitation_div.classList.add("active");
                        addOn2DImitationParamsChangeListeners({ table: table, data_im: data_im, name: name, plotly_num: plotly_num });
                    }
                }
            }
            if (errors != "") showPopup(popup, errors, true);
        }, reason => {
            console.log(reason);
            fadeOut(document.querySelector(".loader"), 0.5);
        });
    }

    function showForecast(x, yhat, p, d, q, k, n, auto, mse, llf) {
        removeIfExist(data, name + " (прогноз)");
        let forecast = {
            p: p,
            d: d,
            q: q,
            k: k,
            n: n,
            auto: auto,
            mse: mse,
            llf: llf
        }
        console.log(forecast);
        data[data_index]["forecast"] = forecast;
        addToAnalysisData(data, x, yhat, name + " (прогноз)", forecast_color, "forecast", "dash");
        newPlot(plotly_div, data, 0);
        showErrors(mse, llf);
    }

    function onArimaError(input) {
        input.classList.add("transition");
        input.classList.add("error");
        setTimeout(function() {
            input.classList.remove("error");
        }, 200);
    }

    function getYSum(y_arr) {
        let sum = "";
        for (let i = 0; i < y_arr.length; i++) {
            sum += y_arr[i]
        }
        let md5 = CryptoJS.MD5(sum).toString();
        return md5;
    }

    function showErrors(mse, llf) {
        mse_span.innerHTML = "MSE = " + mse.toFixed(4);
        llf_span.innerHTML = "LLF = " + llf.toFixed(4);
        results_div.classList.add("active");
    }
}

function addOn2DImitationParamsChangeListeners(options) {
    let table, data_im, name, plotly_num, update_sets, update_data_im;
    if (options.table != undefined) table = options.table;
    else return;
    if (options.data_im != undefined) data_im = options.data_im;
    if (options.name != undefined) name = options.name;
    if (options.plotly_num != undefined) plotly_num = options.plotly_num;
    if (options.update_sets != undefined) update_sets = options.update_sets;
    if (options.update_data_im != undefined) update_data_im = options.update_data_im;

    let table_header = table.querySelector("table.table_header");
    let table_body = table.querySelector("table.table_body");
    let body_rows = table_body.querySelectorAll("tr");
    let imitation_row_controls_body = table_body.querySelectorAll(".imitation_row_control");

    //imitation_div.classList.remove("active");
    if (data_im && name && plotly_num) {
        fillImitationTable();
    }
    if (update_sets) {
        updateNewImitationSets();
    }
    if (data_im && name && update_data_im) {
        parseDataTable();
    }

    setTableEngine(table);
    setInputEngine(table);
    setOnDeleteImitationListeners();

    function parseDataTable() {
        //let name = table_header.querySelector("th.name").innerHTML;
        let ths = table_header.querySelectorAll("th:not(.not_res)");
        data_im[name] = [];
        for (let i = 0; i < body_rows.length; i++) {
            let x_arr = [],
                y_arr = [];
            let tds = body_rows[i].querySelectorAll("td");
            for (let j = 0; j < ths.length; j++) {
                let year = parseFloat(+ths[j].innerHTML);
                if (!isNaN(year)) {
                    x_arr.push(year);
                    y_arr.push(tds[j].innerHTML);
                }
            }
            let color_index = getFreeColor(data_im[name]);
            if (i % 2 == 0) {
                addToImitationData(x_arr, y_arr, data_im, name, colors[color_index], "normal", "solid");
            } else {
                addToImitationData(x_arr, y_arr, data_im, name, colors[color_index], "imitation", "dash");
            }
        }
        //console.log(data_im[name]);
    }

    function fillImitationTable() {
        if (!data_im[name]) {
            return;
        }
        console.log(data_im[name]);
        table_body.innerHTML = "";
        table_header.innerHTML = imitation_header_template.innerHTML;
        let header_row = table_header.querySelector("tr");
        let imitation_row_control_header = header_row.querySelector(".imitation_row_control");
        imitation_row_control_header.innerHTML = imitation_row_control_template.innerHTML;
        let header_hame = header_row.querySelector("th.name");
        header_hame.innerHTML = name;
        changeId(imitation_row_control_header, "close_imitation_chart_" + plotly_num + "_all");
        for (let i = 0; i < data_im[name].length; i++) {
            if (i % 2 == 0) {
                let first = newTr();
                first.innerHTML = imitation_table_body_template.querySelector(".first").innerHTML;
                table_body.append(first);
                let imitation_row_control_body = first.querySelector(".imitation_row_control");
                imitation_row_control_body.innerHTML = imitation_row_control_template.innerHTML;
                changeId(imitation_row_control_body, "close_imitation_chart_" + plotly_num + "_" + i);
            } else {
                let second = newTr();
                second.innerHTML = imitation_table_body_template.querySelector(".second").innerHTML;
                table_body.append(second);
            }
            body_rows = table_body.querySelectorAll("tr");
            imitation_row_controls_body = table_body.querySelectorAll(".imitation_row_control");
            let last_row = body_rows[body_rows.length - 1];
            let name_th = last_row.querySelector(".name");
            name_th.innerHTML = data_im[name][i]["name"];
            for (let j = 0; j < data_im[name][i]["x"].length; j++) {
                let x_count = header_row.querySelectorAll("th").length - 2;
                let y_count = last_row.querySelectorAll("td").length;
                if (x_count < j + 1) {
                    header_row.append(newTh({ inner: data_im[name][i]["x"][j], contenteditable: true, cl: "double" }));
                }
                if (y_count < j + 1) {
                    if (i % 2 == 0) last_row.append(newTd({ inner: data_im[name][i]["y"][j], contenteditable: true }));
                    else last_row.append(newTd({ inner: data_im[name][i]["y"][j] }));
                }
                for (let k = 0; k < body_rows.length - 1; k++) {
                    if (body_rows[k].querySelectorAll("td").length < j + 1) {
                        if (k % 2 == 0) body_rows[k].append(newTd({ contenteditable: true }));
                        else body_rows[k].append(newTd({}));
                    }
                }
            }
        }

        setRightContextMenu(table);

        function showImitationChart(x, y, yhat, x_name) {
            let color_index = getFreeColor(data_im[name]);

        }
    }

    function setOnDeleteImitationListeners() {
        body_rows = table_body.querySelectorAll("tr");
        imitation_row_controls_body = table_body.querySelectorAll(".imitation_row_control");
        let span_button_header = table_header.querySelector("span.delete_imitation_chart");
        span_button_header.onclick = onHeaderDelete;
        for (let i = 0; i < imitation_row_controls_body.length; i++) {
            let span_button_body = imitation_row_controls_body[i].querySelector("span.delete_imitation_chart");
            span_button_body.onclick = onBodyDelete.bind(null, i);
        }

        function onBodyDelete(num) {
            let first = num * 2;
            if (body_rows.length == 2) {
                clearRow(body_rows[first]);
                clearRow(body_rows[first + 1]);
            } else {
                body_rows[first].remove();
                body_rows[first + 1].remove();
            }
            setTableEngine(table);
            updateNewImitationSets();
            setOnDeleteImitationListeners();
        }

        function onHeaderDelete() {
            for (let i = body_rows.length - 1; i >= 0; i--) {
                if (i == 0 || i == 1) {
                    clearRow(body_rows[i]);
                } else {
                    body_rows[i].remove();
                }
            }
            setTableEngine(table);
            setOnDeleteImitationListeners();
        }

        function clearRow(row) {
            let tds = row.querySelectorAll("td");
            for (let i = 0; i < tds.length; i++) {
                tds[i].innerHTML = null;
            }
        }
    }

    function updateNewImitationSets() {
        body_rows = table_body.querySelectorAll("tr");
        imitation_row_controls_body = table_body.querySelectorAll(".imitation_row_control");
        let num = 0;
        for (let i = 0; i < imitation_row_controls_body.length; i++) {
            let splited = imitation_row_controls_body[i].querySelector("input[type=\"checkbox\"].close_imitation_chart").id.split("_");
            let plotly_num = splited[splited.length - 2];
            changeId(imitation_row_controls_body[i], "close_imitation_chart_" + plotly_num + "_" + num);
            num += 2;
        }

        num = 0;
        for (let i = 0; i < body_rows.length; i++) {
            let th = body_rows[i].querySelector("th.name");
            let inner = th.innerHTML;
            let before_bracket = inner.split("(")[0];
            let after_bracket = inner.split(")")[1];
            th.innerHTML = before_bracket + "(" + num + ")" + after_bracket;
            if (i % 2 != 0) {
                num++;
            }
        }
    }
}

function changeId(imitation_row_control, name) {
    let imitation_row_control_checkbox = imitation_row_control.querySelector("input[type=\"checkbox\"].close_imitation_chart");
    imitation_row_control_checkbox.id = name;
    let close_imitation_chart_label = imitation_row_control.querySelector("label.close_imitation_chart");
    close_imitation_chart_label.htmlFor = name;
}

function addToImitationData(x, y, data_im, name, color, which, dash) {
    let x_name = name.split(" от ")[0];
    let length = data_im[name].length;
    x_name += "<sup>(" + Math.floor(length / 2) + ")</sup>";
    x_name = length % 2 == 0 ? x_name : x_name + "<sup>*</sup>";
    addToAnalysisData(data_im[name], x, y, x_name, color, which, dash);
}

function addToAnalysisData(data, x_arr, y_arr, name, color, which, dash) {
    let trace = {
        x: x_arr,
        y: y_arr,
        type: "scatter",
        name: name,
        connectgaps: true,
        line: {
            dash: dash,
            color: color
        },
        which: which
    };
    data.push(trace);
}

function getAnalisisParams(data, name, type) {
    let data_index = getDataIndex(data, name);
    if (data_index == -1) return false;
    if (data[data_index][type] == null) return false;
    return data[data_index][type];
}

function removeAnalysis(data, name, results_div, plotly_div) {
    let base_name = name.split(" (")[0];
    let index = getDataIndex(data, base_name);
    type = null;
    if (name.includes("тренд")) {
        type = "trend";
    } else if (name.includes("прогноз")) {
        type = "forecast";
    }
    data[index][type] = null;
    removeIfExist(data, name);
    newPlot(plotly_div, data, 0);
    removeAnalisysResults(results_div);
}

function removeAnalisysResults(results_div) {
    results_div.classList.remove("active");
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
                if (type == 0) data_v[i]["x"][k] = null;
                else if (type == 1) {
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

function removeIfExist(data, name) {
    let data_index = getDataIndex(data, name);
    while (data_index != -1) {
        data.splice(data_index, 1);
        data_index = getDataIndex(data, name);
    }
}

function getFreeColor(data) {
    let unusedColors = [];
    for (let i = 0; i < colors.length; i++) {
        unusedColors.push(colors[i]);
    }
    if (!data) {
        return getArrayIndex(colors, unusedColors[0]);
    }
    for (let i = 0; i < data.length; i++) {
        if (data[i]["which"] == "normal") {
            let color = data[i]["line"]["color"];
            unusedColors.splice(getArrayIndex(unusedColors, color), 1);
        }
    }
    if (unusedColors.length == 0) {
        return -1;
    }
    return getArrayIndex(colors, unusedColors[0]);
}

function getDataIndex(data, name, includes) {
    for (let k = 0; k < data.length; k++) {
        if (includes) {
            if (data[k]["name"].includes(name)) {
                return k;
            }
        } else {
            if (data[k]["name"] == name) {
                return k;
            }
        }
    }
    return -1;
}