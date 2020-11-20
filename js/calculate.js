let bd_e_preloader = document.querySelector(".bd_e_preloader");
let contents = document.querySelectorAll(".content");
let radios = document.querySelectorAll("input[type=\"radio\"]");
let span_footer = document.querySelector(".span_footer");
let table_body_main = contents[0].querySelector(".table_body");
let table_header_main = contents[0].querySelector(".table_header");
let chart_div_template = document.querySelector(".chart_div");
let checkbox_td = document.querySelector(".checkbox_td");
let new_chart_form_div = document.querySelectorAll(".new_chart_form_div");
let add_2d_button = document.querySelector(".add_2d_button");
let add_3d_button = document.querySelector(".add_3d_button");
let add_drm_button = document.querySelector(".add_drm_button");
let select_culture = document.querySelector(".select_culture");
let select_field = document.querySelector(".select_field");
let select_param = document.querySelector(".select_param");
let trends_2d_template = document.querySelector(".trends_2d");
let trends_3d_template = document.querySelector(".trends_3d");
let cultures_list = [];
let fields_list = [];

document.addEventListener("DOMContentLoaded", () => {
    search.onsubmit = function (e) {
        e.preventDefault();
    }
    doRequest();
    find();
    search.year1.onkeyup = find;
    search.year1.onclick = find;
    search.year2.onkeyup = find;
    search.year2.onclick = find;
    search.culture.onkeyup = find;
    search.field.onkeyup = find;
    search.calculate.onclick = calc.bind(null, table_body_main, table_header_main);
    contents[1].style.display = "flex";
    add_2d_button.onclick = addChartDiv.bind(null, 0);
    add_3d_button.onclick = addChartDiv.bind(null, 1);;
    //add_drm_button.onclick = addChartDiv(content[3]);
    onRadioChange();
});

function addChartDiv(type) {
    let plotly_num = document.querySelectorAll(".plotly_div").length;
    let chart_div = document.createElement("div");
    chart_div.className = "chart_div";
    chart_div.innerHTML = chart_div_template.innerHTML;
    new_chart_form_div[type].before(chart_div); // type 0 = 2d
    let param_form = chart_div.querySelector(".param_form");

    addSpan(param_form, "Ось Х:");
    addSelect(param_form, select_param, "x_select_param");
    let x_select_culture = addSelect(param_form, select_culture, "x_select_culture");
    addOptions(x_select_culture, cultures_list, "name");
    let x_select_field = addSelect(param_form, select_field, "x_select_field");
    addOptions(x_select_field, fields_list, "cadastral");

    addSpan(param_form, "Ось Y:");
    addSelect(param_form, select_param, "y_select_param");
    let y_select_culture = addSelect(param_form, select_culture, "y_select_culture");
    y_select_culture.innerHTML = x_select_culture.innerHTML;
    let y_select_field = addSelect(param_form, select_field, "y_select_field");
    y_select_field.innerHTML = x_select_field.innerHTML;

    if (type == 1) {
        addSpan(param_form, "Ось Z:");
        addSelect(param_form, select_param, "z_select_param");
        let z_select_culture = addSelect(param_form, select_culture, "z_select_culture");
        z_select_culture.innerHTML = x_select_culture.innerHTML;
        let z_select_field = addSelect(param_form, select_field, "z_select_field");
        z_select_field.innerHTML = x_select_field.innerHTML;
    }

    let data = [];
    let add_chart_button = chart_div.querySelector(".add_chart_button");
    if (type == 0) {
        let trends_2d = document.createElement("div");
        trends_2d.className = "trends_2d";
        trends_2d_template.querySelector(".a_error_checkbox").setAttribute("id", "a_error_checkbox_" + plotly_num);
        trends_2d_template.querySelector(".a_error_checkbox_label").setAttribute("for", "a_error_checkbox_" + plotly_num);
        trends_2d.innerHTML = trends_2d_template.innerHTML;
        add_chart_button.onclick = addChart.bind(null, chart_div, data, trends_2d, plotly_num, type);
    } else if(type == 1) {
        let trends_3d = document.createElement("div");
        trends_3d.className = "trends_3d";
        trends_3d.innerHTML = trends_3d_template.innerHTML;
        add_chart_button.onclick = addChart.bind(null, chart_div, data, trends_3d, plotly_num, type);
    }

}

function addSelect(form, select, name) {
    let sel = document.createElement("select");
    sel.className = name;
    sel.name = name;
    sel.innerHTML = select.innerHTML;
    form.insertBefore(sel, form.querySelector(".add_chart_button"));
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

function addSpan(form, text) {
    let span = document.createElement("span");
    span.innerHTML = text;
    form.insertBefore(span, form.querySelector(".add_chart_button"));
}

function getFieldsCulturesList(xhr) {
    if (xhr.response.fields_rows.length > 0) {
        fields_list = xhr.response.fields_rows;
    }
    if (xhr.response.cultures_rows.length > 0) {
        cultures_list = xhr.response.cultures_rows;
    }
}

function doRequest() {
    let xhr = request("php/calculate.php", null);
    xhr.onload = function () {
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
            }
            getFieldsCulturesList(xhr);
        }
    }
}

function onRadioChange() {
    console.log(contents);
    for (let i = 0; i < radios.length; i++) {
        console.log(i);
        radios[i].addEventListener("change", function () {
            for (let k = 0; k < contents.length; k++) {
                contents[k].style.display = "none";
            }
            contents[i].style.display = "flex";
            //removeCellRect(selected_content_i);
            //setTableEngine(i);
        });
    }
}

function find() {
    let xhr = request("php/find.php", new FormData(search));
    xhr.onload = function () {
        if (xhr.status != 200) {
            console.log(xhr.status);
        } else {
            console.log(xhr.response);
            if (xhr.response == null) return;
            if (!checkBdServerHome(xhr)) {
                showText(span_footer, xhr.response.bd_e[0], true);
            } else {
                showText(span_footer, "", false);
            }
            if (!checkInfoServerHome(xhr)) {
                showText(span_footer, xhr.response.info[0], false);
            } else {
                showText(span_footer, "", false);
            }
            if (xhr.response.factors_result.length > 0) {
                fillTable(table_body_main, xhr.response.factors_result[0]);
            } else {
                clearTable(table_body_main);
            }
            setTableEngine(contents[0].querySelector(".table_body_div"), 0, table_body_main, table_header_main);
        }
    }
}

function fillTable(body, data) {
    body.innerHTML = data;
}

function clearTable(body) {
    body.innerHTML = "";
}

function calc(body, header) {
    let cells = body.querySelectorAll("td");
    let ths = header.querySelectorAll("th");
    for (let i = 0; i < cells.length; i++) {
        let col = i % ths.length;
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