let wrapper = document.querySelectorAll("div.wrapper");
let radios = document.querySelectorAll(".tabs input[type=\"radio\"]");
let table = document.querySelectorAll("div.table");
let main_table_header = document.querySelector("table.main_table_header")
let main_table_body = document.querySelector("table.main_table_body");
let bd_e_preloader = document.querySelector(".preloader span.bd_e");
let popup = document.querySelector("div.popup");
let charts_container = document.querySelectorAll("div.charts_container");
let chart_2d_div = document.querySelector("div.chart_2d_div");
let chart_2d_div_template = chart_2d_div.innerHTML;
let select_culture_template = document.querySelector(".select_culture_template");
let select_field_template = document.querySelector(".select_field_template");
let select_param_template = document.querySelector(".select_param_template");
let add_2d_button = document.querySelector(".add_2d_button");
let add_3d_button = document.querySelector(".add_3d_button");
let cultures_list = [];
let fields_list = [];

doRequest();
wrapper[0].style.display = "none";
wrapper[1].style.display = "flex";

function onRadioChange() {
    for (let i = 0; i < radios.length; i++) {
        radios[i].addEventListener("change", function() {
            wrapper.forEach(elem => { elem.style.display = "none"; });
            wrapper[i].style.display = "flex";
        });
    }
}

function doRequest() {
    let xhr = request("php/calculate.php", null);
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
                find();
                getFieldsCulturesList(xhr);
                addSelects(chart_2d_div, 0);
                addOtherStuff(chart_2d_div, 0);
                search.year1.onkeyup = find;
                search.year1.onclick = find;
                search.year2.onkeyup = find;
                search.year2.onclick = find;
                search.culture.onkeyup = find;
                search.field.onkeyup = find;
                search.onsubmit = function(e) {
                    e.preventDefault();
                }
                search.calculate.onclick = calc.bind(null, main_table_body, main_table_header);
                add_2d_button.onclick = addChartDiv.bind(null, 0);

                new ResizeSensor(wrapper[1].querySelector("div.charts_container"), function() {
                    onPlotlyResise(wrapper[1]);
                })
                wrapper[1].onscroll = function() {
                    onPlotlyResise(wrapper[1]);
                }

            }
        }
    }
}

function addChartDiv(type) {
    let chart_div = document.createElement("div");
    if (type == 0) {
        chart_div.innerHTML = chart_2d_div_template;
    }
    chart_div.className = "chart_div";
    charts_container[type].querySelector("form.new_chart_form").before(chart_div);
    chart_div.querySelector("hr").classList.add("active");
    addSelects(chart_div, type);
    addOtherStuff(chart_div, type);

}

function addOtherStuff(chart_div, type) {
    let add_chart_button = chart_div.querySelector("span.add_chart");
    let data = [];
    let plotly_num = document.querySelectorAll(".plotly_div").length;
    if (type == 0) {
        console.log("onclick")
        add_chart_button.onclick = addChart.bind(null, chart_div, data, type, plotly_num);
    }
}

function addSelects(chart_div, type) {
    let param_form = chart_div.querySelector(".param_form");
    addSelect(param_form, select_param_template, "x_select_param", chart_div.querySelector("span.axis_y_span"));
    let x_select_field = addSelect(param_form, select_field_template, "x_select_field", chart_div.querySelector("span.axis_y_span"));
    addOptions(x_select_field, fields_list, "cadastral");
    let x_select_culture = addSelect(param_form, select_culture_template, "x_select_culture", chart_div.querySelector("span.axis_y_span"));
    addOptions(x_select_culture, cultures_list, "name");

    addSelect(param_form, select_param_template, "y_select_param", null, chart_div.querySelector("span.axis_y_span"));
    let y_select_field = addSelect(param_form, select_field_template, "y_select_field", null, chart_div.querySelector("span.axis_y_span"));
    addOptions(y_select_field, fields_list, "cadastral");
    let y_select_culture = addSelect(param_form, select_culture_template, "y_select_culture", null, chart_div.querySelector("span.axis_y_span"));
    addOptions(y_select_culture, cultures_list, "name");

    if (type == 1) {
        addSelect(param_form, select_param_template, "z_select_param", chart_div.querySelector("span.axis_z_span"));
        let z_select_field = addSelect(param_form, select_field_template, "z_select_field", null, chart_div.querySelector("span.axis_z_span"));
        addOptions(z_select_field, fields_list, "cadastral");
        let z_select_culture = addSelect(param_form, select_culture_template, "z_select_culture", null, chart_div.querySelector("span.axis_z_span"));
        addOptions(z_select_culture, cultures_list, "name");
    }

    function addSelect(form, select_template, name, before, after) {
        let sel = document.createElement("select");
        sel.className = name;
        sel.name = name;
        sel.innerHTML = select_template.innerHTML;
        if (before) form.insertBefore(sel, before);
        else if (after) form.insertBefore(sel, after.nextSibling);
        return sel;
    }

    function addOptions(select, data, key) {
        for (let k = 0; k < data.length; k++) {
            let option = document.createElement("option");
            option.value = k;
            option.innerHTML = data[k][key];
            select.append(option);
        }
    }
}

function onPlotlyResise(wrapper) {
    let plotly_div = wrapper.querySelectorAll("div.plotly_div");
    let font_size = (getComputedStyle(document.documentElement).fontSize).replace("px", "");
    for (let i = 0; i < plotly_div.length; i++) {
        updateLayout(plotly_div[i]);
        let left_right = getPlotlyLRCoordinates(plotly_div[i]);
        let top_bottom = getPlotlyTBCoordinates(plotly_div[i]);
        plotly_div[i].onmousemove = function(e) {
            let lr = isBorder(left_right, e.clientX, font_size);
            let tb = isBorder(top_bottom, e.clientY, font_size);
            if (lr && !tb) {
                plotly_div[i].style.cursor = "col-resize";
                plotly_div[i].onmousedown = function(e) {
                    removeMouseMoveListeners();
                    let start_x = e.clientX;
                    let height = plotly_div[i].getBoundingClientRect().height;
                    let width = plotly_div[i].getBoundingClientRect().width;
                    document.documentElement.onmousemove = function(e) {
                        document.getSelection().removeAllRanges();
                        document.body.style.cursor = "col-resize";
                        removePlotlyOpacity(plotly_div[i]);
                        let new_width = (width + e.clientX - start_x) / font_size;
                        if (new_width > 10) {
                            plotly_div[i].style.width = new_width + "rem";
                        }
                    }
                    document.documentElement.onmouseup = function() {
                        document.body.style.cursor = "default";
                        document.documentElement.onmousemove = null;
                        plotly_div[i].onmousedown = null;
                        updateLayout(plotly_div[i]);
                        addPlotlyOpacity(plotly_div[i]);
                        onPlotlyResise(wrapper);
                    }
                }
            } else if (!lr && tb) {
                plotly_div[i].style.cursor = "row-resize";
                plotly_div[i].onmousedown = function(e) {
                    removeMouseMoveListeners();
                    let start_y = e.clientY;
                    let height = plotly_div[i].getBoundingClientRect().height;
                    document.documentElement.onmousemove = function(e) {
                        document.getSelection().removeAllRanges();
                        plotly_div[i].style.cursor = "row-resize";
                        removePlotlyOpacity(plotly_div[i]);
                        let new_height = (height + e.clientY - start_y) / font_size;
                        if (new_height > 10) {
                            plotly_div[i].style.height = new_height + "rem";
                        }
                    }
                    document.documentElement.onmouseup = function() {
                        document.body.style.cursor = "default";
                        document.documentElement.onmousemove = null;
                        plotly_div[i].onmousedown = null;
                        updateLayout(plotly_div[i]);
                        addPlotlyOpacity(plotly_div[i]);
                        onPlotlyResise(wrapper);
                    }
                }
            } else {
                plotly_div[i].style.cursor = "default";
            }
        }
    }

    function removePlotlyOpacity(plotly_div) {
        let plotly = plotly_div.querySelector(".plotly");
        if(plotly) {
            plotly.classList.add("resizing");
        }
    }

    function addPlotlyOpacity(plotly_div) {
        let plotly = plotly_div.querySelector(".plotly");
        if(plotly) {
            plotly.classList.remove("resizing");
        }
    }

    function removeMouseMoveListeners() {
        for (let i = 0; i < plotly_div.length; i++) {
            plotly_div[i].onmousemove = null;
        }
    }

    function getPlotlyLRCoordinates(plotly_div) {
        return [plotly_div.getBoundingClientRect().left, plotly_div.getBoundingClientRect().left + plotly_div.getBoundingClientRect().width];
    }

    function getPlotlyTBCoordinates(plotly_div) {
        return [plotly_div.getBoundingClientRect().top, plotly_div.getBoundingClientRect().top + plotly_div.getBoundingClientRect().height];
    }

    function isBorder(b, x, font_size) {
        for (let k = 0; k < b.length; k++) {
            if (Math.abs(x - b[k]) / font_size <= 0.25) {
                return true;
            }
        }
        return false;
    }
}

function getFieldsCulturesList(xhr) {
    if (xhr.response.fields_rows.length > 0) {
        fields_list = xhr.response.fields_rows;
    }
    if (xhr.response.cultures_rows.length > 0) {
        cultures_list = xhr.response.cultures_rows;
    }
}

function find() {
    let xhr = request("php/find.php", new FormData(search));
    xhr.onload = function() {
        if (xhr.status != 200) {
            console.log(xhr.status);
        } else {
            console.log(xhr.response);
            if (xhr.response == null) return;
            if (!checkBdServerHome(xhr)) {
                showPopup(popup, "Ошибка сохранения таблиц");
                return;
            }
            if (!checkInfoServer(xhr)) {
                showPopup(popup, xhr.response.info[0]);
            }
            if (xhr.response.factors_result.length > 0) {
                fillTable(main_table_body, xhr.response.factors_result[0]);
            } else {
                clearTable(main_table_body);
            }
            setTableEngine(table[0]);
        }
    }

    function fillTable(body, data) {
        body.innerHTML = data;
    }

    function clearTable(body) {
        body.innerHTML = "";
    }
}

function calc(body, header) {
    let cells = body.querySelectorAll("td");
    for (let i = 0; i < cells.length; i++) {
        let col = i % header.querySelectorAll("th").length;
        if (col > 4) {
            if (cells[i - 2].innerHTML == "" || cells[i - 1].innerHTML == "") {
                continue;
            }
            let a = parseFloat(+(cells[i - 2].innerHTML));
            let b = parseFloat(+(cells[i - 1].innerHTML));
            if (isNaN(a) || isNaN(b)) {
                continue;
            }
            if (col == 5) {
                cells[i].innerHTML = x1(a, b).toFixed(3);
            } else if (col == 8) {
                cells[i].innerHTML = x2(a, b).toFixed(3);
            } else if (col == 11) {
                cells[i].innerHTML = x3(a, b).toFixed(3);
            } else if (col == 14) {
                cells[i].innerHTML = x4(a, b).toFixed(3);
            } else if (col == 17) {
                cells[i].innerHTML = x5(a, b).toFixed(3);
            } else if (col == 20) {
                cells[i].innerHTML = x6(a, b).toFixed(3);
            } else if (col == 23) {
                cells[i].innerHTML = x7(a, b).toFixed(3);
            } else if (col == 26) {
                cells[i].innerHTML = x8(a, b).toFixed(3);
            } else if (col == 29) {
                cells[i].innerHTML = x9(a, b).toFixed(3);
            } else if (col == 32) {
                cells[i].innerHTML = x10(a, b).toFixed(3);
            } else if (col == 35) {
                cells[i].innerHTML = x11(a, b).toFixed(3);
            } else if (col == 38) {
                cells[i].innerHTML = x12(a, b).toFixed(3);
            } else if (col == 41) {
                cells[i].innerHTML = x13(a, b).toFixed(3);
            } else if (col == 44) {
                cells[i].innerHTML = x14(a, b).toFixed(3);
            } else if (col == 47) {
                cells[i].innerHTML = x15(a, b).toFixed(3);
            } else if (col == 50) {
                cells[i].innerHTML = x16(a, b).toFixed(3);
            } else if (col == 53) {
                cells[i].innerHTML = x17(a, b).toFixed(3);
            } else if (col == 56) {
                cells[i].innerHTML = x18(a, b).toFixed(3);
            } else if (col == 59) {
                cells[i].innerHTML = x19(a, b).toFixed(3);
            } else if (col == 62) {
                cells[i].innerHTML = x20(a, b).toFixed(3);
            } else if (col == 65) {
                cells[i].innerHTML = x21(a, b).toFixed(3);
            } else if (col == 68) {
                cells[i].innerHTML = x22(a, b).toFixed(3);
            } else if (col == 71) {
                cells[i].innerHTML = x23(a, b).toFixed(3);
            } else if (col == 74) {
                cells[i].innerHTML = x24(a, b).toFixed(3);
            } else if (col == 77) {
                cells[i].innerHTML = x25(a, b).toFixed(3);
            } else if (col == 80) {
                cells[i].innerHTML = x26(a, b).toFixed(3);
            } else if (col == 83) {
                cells[i].innerHTML = x27(a, b).toFixed(3);
            } else if (col == 86) {
                cells[i].innerHTML = x28(a, b).toFixed(3);
            } else if (col == 89) {
                cells[i].innerHTML = x29(a, b).toFixed(3);
            } else if (col == 92) {
                cells[i].innerHTML = x30(a, b).toFixed(3);
            } else if (col == 95) {
                cells[i].innerHTML = x31(a, b).toFixed(3);
            } else if (col == 98) {
                cells[i].innerHTML = x32(a, b).toFixed(3);
            } else if (col == 101) {
                cells[i].innerHTML = x33(a, b).toFixed(3);
            } else if (col == 104) {
                cells[i].innerHTML = x34(a, b).toFixed(3);
            } else if (col == 107) {
                cells[i].innerHTML = x35(a, b).toFixed(3);
            } else if (col == 110) {
                cells[i].innerHTML = x36(a, b).toFixed(3);
            } else if (col == 113) {
                cells[i].innerHTML = x37(a, b).toFixed(3);
            } else if (col == 116) {
                cells[i].innerHTML = x38(a, b).toFixed(3);
            } else if (col == 119) {
                cells[i].innerHTML = x39(a, b).toFixed(3);
            }
        }
    }
}

function x1(so, st) {
    return so * 10 / st;
}

function x2(so, st10) {
    return so * 10 / st10;
}

function x3(so, st15) {
    return so * 10 / st15;
}

function x4(so, st20) {
    return so * 10 / (st20 + 20);
}

function x5(so2, st) {
    return so2 * 10 / st;
}

function x6(so2, st10) {
    return so2 * 10 / st10;
}

function x7(so2, st15) {
    return so2 * 10 / st15;
}

function x8(so2, st20) {
    return so2 * 10 / (st20 + 20);
}

function x9(sv, st) {
    return sv / st;
}

function x10(sv, st10) {
    return sv / st10;
}

function x11(sv, st15) {
    return sv / st15;
}

function x12(sv, st20) {
    return sv / (st20 + 20);
}

function x13(sv40, st) {
    return sv40 / st;
}

function x14(sv45, st) {
    return sv45 / st;
}

function x15(sv50, st) {
    return sv50 / st;
}

function x16(sv40, st10) {
    return sv40 / st10;
}

function x17(sv40, st15) {
    return sv40 / st15;
}

function x18(sv40, st20) {
    return sv40 / (st20 + 20);
}

function x19(sv45, st10) {
    return sv45 / st10;
}

function x20(sv45, st15) {
    return sv45 / st15;
}

function x21(sv45, st20) {
    return sv45 / (st20 + 20);
}

function x22(sv50, st10) {
    return sv50 / st10;
}

function x23(sv50, st15) {
    return sv50 / st15;
}

function x24(sv50, st20) {
    return sv50 / (st20 + 20);
}

function x25(chdo, chdt10) {
    return chdo / chdt10;
}

function x26(chdo, chdt15) {
    return chdo / chdt15;
}

function x27(chdo, chdt20) {
    return chdo / (chdt20 + 1);
}

function x28(chdo2, chdt10) {
    return chdo2 / chdt10;
}

function x29(chdo2, chdt15) {
    return chdo2 / chdt15;
}

function x30(chdo2, chdt20) {
    return chdo2 / (chdt20 + 1);
}

function x31(chdv40, chdt10) {
    return chdv40 / chdt10;
}

function x32(chdv40, chdt15) {
    return chdv40 / chdt15;
}

function x33(chdv40, chdt20) {
    return chdv40 / (chdt20 + 1);
}

function x34(chdv45, chdt10) {
    return chdv45 / chdt10;
}

function x35(chdv45, chdt15) {
    return chdv45 / chdt15;
}

function x36(chdv45, chdt20) {
    return chdv45 / (chdt20 + 1);
}

function x37(chdv50, chdt10) {
    return chdv50 / chdt10;
}

function x38(chdv50, chdt15) {
    return chdv50 / chdt15;
}

function x39(chdv50, chdt20) {
    return chdv50 / (chdt20 + 1);
}