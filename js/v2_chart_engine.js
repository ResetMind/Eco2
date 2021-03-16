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

function addTo2DData(data, x_arr, y_arr, year_arr, name, x_name, y_name, color, which, trend = null, optimisation = null, imitation = null, interpolation = null) {
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
        optimisation: optimisation,
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
        while (getDataIndex(data, name + " тренд") != -1) {
            data.splice(getDataIndex(data, name + " тренд"), 1);
            newPlot(chart_div.querySelector(".plotly_div"), data, type);
            //console.log(data);
        }
    }

    function onChartRectangleClick() {
        let plotly_div = chart_div.querySelector(".plotly_div");
        let chart_settings = chart_div.querySelector(".chart_settings");
        let chart_rectangles = chart_div.querySelector(".chart_rectangles");
        let chart_data = chart_settings.querySelector(".chart_data");
        let chart_stuff = chart_settings.querySelector(".chart_stuff");
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
            chart_stuff.innerHTML = "";
            removeOptLine(data, name);
        } else {
            for (let k = 0; k < rectangles.length; k++) {
                let name_ = chart_rectangle.querySelector(".chart_rectangle_name").innerHTML;
                removeOptLine(data, name_);
                rectangles[k].classList.remove("active");
                if (k == 0) {
                    chart_settings.classList.remove("active");
                    chart_data.innerHTML = "";
                    chart_stuff.innerHTML = "";
                }
            }
            rectangle.classList.add("active");
            chart_data.append(createDataTable());
            //if (trends != null) chart_stuff.append(trends);
            //chart_stuff.append(interpolation);
            chart_settings.classList.add("active");
            //addOnCheckboxChangeListeners(chart_div, chart_data.querySelectorAll("input[type='checkbox']"), data, name, type);
            if (type == 0) {
                /*addOn2DOptimisationParamsListeners(chart_div, data, name);
                addOn2DTrendsParamsChangeListeners(chart_div, data, name);
                addOn2DImitationListeners(chart_div, data, name);
                addOn2DInterpolationListeners(chart_div, data, name);*/
            }
        }

        function createDataTable() {
            let data_index = getDataIndex(data, name);
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

        function removeOptLine(data, name) {
            let data_index = getDataIndex(data, name);
            if (data[data_index]["optimisation"] == null) {
                replaceIfExist(data, name, "left_opt_line");
                replaceIfExist(data, name, "right_opt_line");
                replaceIfExist(data, name, "point");
                newPlot(plotly_div, data, type);
            }
        }
    }
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