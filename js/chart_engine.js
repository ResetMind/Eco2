function add2DChart(plotly_div, data, form, span_chart_info) {
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
        if (isChartExist(data, name)) {
            span_chart_info.innerHTML = "График уже построен";
            return;
        }
        addTo2DData(data, x_arr, y_arr, name);
        Plotly.newPlot(plotly_div, data, set2DLayout(plotly_div), { scrollZoom: true, responsive: true });
        span_chart_info.innerHTML = "";
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

function isChartExist(data, name) {
    console.log(data);
    for (let k = 0; k < data.length; k++) {
        console.log(data[k]["name"]);
        if (data[k]["name"] == name) {
            return true;
        }
    }
    return false;
}

function addTo2DData(data, x, y, name) {
    let trace;
    trace = { x: x, y: y, type: "scatter", mode: "lines+markers", name: name, connectgaps: true };
    data.push(trace);
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