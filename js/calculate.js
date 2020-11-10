let bd_e_preloader = document.querySelector(".bd_e_preloader");
let content = document.querySelectorAll(".content");
let radios = document.querySelectorAll("input[type=\"radio\"]");
let span_footer = document.querySelector(".span_footer");
let table_body_main = content[0].querySelector(".table_body");
let table_header_main = content[0].querySelector(".table_header");

document.addEventListener("DOMContentLoaded", () => {
    search.onsubmit = function(e) {
        e.preventDefault();
    }
    search.year1.onkeydown = find;
    search.year1.onclick = find;
    search.year2.onkeydown = find;
    search.year2.onclick = find;
    search.culture.onkeydown = find;
    search.field.onkeydown = find;
    search.calculate.onclick = calc.bind(null, table_body_main, table_header_main);
    content[0].style.display = "flex";
    setTableEngine(content[0].querySelector(".table_body_div"), 0, table_body_main, table_header_main);
    onRadioChange();
    doRequest();
});

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
            }

        }
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
                showText(span_footer, xhr.response.bd_e[0], true);    
            } else {
                showText(span_footer, "", false);
            }
            if(!checkInfoServerHome(xhr)) {
                showText(span_footer, xhr.response.info[0], false); 
            } else {
                showText(span_footer, "", false);
            }
            if(xhr.response.factors_result.length > 0) {
                fillTable(table_body_main, xhr.response.factors_result[0]);
            } else {
                clearTable(table_body_main);
            }
        }
    }
}

function fillTable(body, data) {
    body.innerHTML = data;
}

function clearTable(body) {
    body.innerHTML = "";
}

function onRadioChange() {
    for (let i = 0; i < radios.length; i++) {
        console.log(i);
        radios[i].addEventListener("change", function() {
            content.forEach(elem => { elem.style.display = "none"; });
            content[i].style.display = "flex";
            //removeCellRect(selected_content_i);
            //setTableEngine(i);
        });
    }
}

function calc(body, header) {
    let cells = body.querySelectorAll("td");
    let ths = header.querySelectorAll("th");
    for (let i = 0; i < cells.length; i++) {
        let col = i % ths.length;
        if (col % 3 == 0 && col != 0) {
            if (cells[i - 2].innerHTML == "" || cells[i - 1].innerHTML == "") {
                continue;
            }
            let a = parseFloat(+(cells[i - 2].innerHTML));
            let b = parseFloat(+(cells[i - 1].innerHTML));
            if (isNaN(a) || isNaN(b)) {
                continue;
            }
            if (col == 3) {
                cells[i].innerHTML = x1(a, b).toFixed(3);
            } else if (col == 6) {
                cells[i].innerHTML = x2(a, b).toFixed(3);
            } else if (col == 9) {
                cells[i].innerHTML = x3(a, b).toFixed(3);
            } else if (col == 12) {
                cells[i].innerHTML = x4(a, b).toFixed(3);
            } else if (col == 15) {
                cells[i].innerHTML = x5(a, b).toFixed(3);
            } else if (col == 18) {
                cells[i].innerHTML = x6(a, b).toFixed(3);
            } else if (col == 21) {
                cells[i].innerHTML = x7(a, b).toFixed(3);
            } else if (col == 24) {
                cells[i].innerHTML = x8(a, b).toFixed(3);
            } else if (col == 27) {
                cells[i].innerHTML = x9(a, b).toFixed(3);
            } else if (col == 30) {
                cells[i].innerHTML = x10(a, b).toFixed(3);
            } else if (col == 33) {
                cells[i].innerHTML = x11(a, b).toFixed(3);
            } else if (col == 36) {
                cells[i].innerHTML = x12(a, b).toFixed(3);
            } else if (col == 39) {
                cells[i].innerHTML = x13(a, b).toFixed(3);
            } else if (col == 42) {
                cells[i].innerHTML = x14(a, b).toFixed(3);
            } else if (col == 45) {
                cells[i].innerHTML = x15(a, b).toFixed(3);
            } else if (col == 48) {
                cells[i].innerHTML = x16(a, b).toFixed(3);
            } else if (col == 51) {
                cells[i].innerHTML = x17(a, b).toFixed(3);
            } else if (col == 54) {
                cells[i].innerHTML = x18(a, b).toFixed(3);
            } else if (col == 57) {
                cells[i].innerHTML = x19(a, b).toFixed(3);
            } else if (col == 60) {
                cells[i].innerHTML = x20(a, b).toFixed(3);
            } else if (col == 63) {
                cells[i].innerHTML = x21(a, b).toFixed(3);
            } else if (col == 66) {
                cells[i].innerHTML = x22(a, b).toFixed(3);
            } else if (col == 69) {
                cells[i].innerHTML = x23(a, b).toFixed(3);
            } else if (col == 72) {
                cells[i].innerHTML = x24(a, b).toFixed(3);
            } else if (col == 75) {
                cells[i].innerHTML = x25(a, b).toFixed(3);
            } else if (col == 78) {
                cells[i].innerHTML = x26(a, b).toFixed(3);
            } else if (col == 81) {
                cells[i].innerHTML = x27(a, b).toFixed(3);
            } else if (col == 84) {
                cells[i].innerHTML = x28(a, b).toFixed(3);
            } else if (col == 87) {
                cells[i].innerHTML = x29(a, b).toFixed(3);
            } else if (col == 90) {
                cells[i].innerHTML = x30(a, b).toFixed(3);
            } else if (col == 93) {
                cells[i].innerHTML = x31(a, b).toFixed(3);
            } else if (col == 96) {
                cells[i].innerHTML = x32(a, b).toFixed(3);
            } else if (col == 99) {
                cells[i].innerHTML = x33(a, b).toFixed(3);
            } else if (col == 102) {
                cells[i].innerHTML = x34(a, b).toFixed(3);
            } else if (col == 105) {
                cells[i].innerHTML = x35(a, b).toFixed(3);
            } else if (col == 108) {
                cells[i].innerHTML = x36(a, b).toFixed(3);
            } else if (col == 111) {
                cells[i].innerHTML = x37(a, b).toFixed(3);
            } else if (col == 114) {
                cells[i].innerHTML = x38(a, b).toFixed(3);
            } else if (col == 117) {
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