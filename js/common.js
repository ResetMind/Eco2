function checkEmailServer(xhr, email_input, email_span) {
    if (xhr.response.email_e.length > 0) {
        showError(email_span, email_input, xhr.response.email_e[0]);
        return false;
    } else {
        removeError(email_span, email_input);
        return true;
    }
}

function checkEmail(email_input, email_span) {
    if (email_input.value[0] == "@") {
        showError(email_span, email_input, "Email не может начинаться с символа @");
        return false;
    } else if (email_input.value.indexOf("@") == -1) {
        showError(email_span, email_input, "В email должен быть символ @");
        return false;
    } else if (email_input.value[email_input.value.length - 1] == "@" && email_input.value.split("@").length <= 2) {
        showError(email_span, email_input, "В email должны быть символы после @");
        return false;
    } else if (email_input.value.split("@").length > 2) {
        showError(email_span, email_input, "Часть email после @ не может содержать @");
        return false;
    } else {
        removeError(email_span, email_input);
        return true;
    }
}

function checkNameServer(xhr, name_input, name_span) {
    if (xhr.response.name_e.length > 0) {
        showError(name_span, name_input, xhr.response.name_e[0]);
        return false;
    } else {
        removeError(name_span, name_input);
        return true;
    }
}

function checkName(name_input, name_span) {
    if (name_input.value.length < 2 || name_input.value.length > 50) {
        showError(name_span, name_input, "Недопустимая длина имени (2-50 символов)");
    } else {
        removeError(name_span, name_input);
    }
}

function checkPassword0(password_input, password_span) {
    if (password_input.value.length < 1) {
        showError(password_span, password_input, "Недопустимая длина пароля");
        return false;
    } else {
        removeError(password_span, password_input);
        return true;
    }
}

function checkPassword0Server(xhr, password0_input, password0_span) {
    if (xhr.response.password_e.length > 0) {
        showError(password0_span, password0_input, xhr.response.password_e[0]);
        return false;
    } else {
        removeError(password0_span, password0_input);
        return true;
    }
}

function checkPassword1Server(xhr, password1_input, password1_span) {
    if (xhr.response.password1_e.length > 0) {
        showError(password1_span, password1_input, xhr.response.password1_e[0]);
        return false;
    } else {
        removeError(password1_span, password1_input);
        return true;
    }
}

function checkPassword1(password1_input, password1_span, password2_input, password2_span) {
    if (password1_input.value.length < 4 || password1_input.value.length > 12) {
        showError(password1_span, password1_input, "Недопустимая длина пароля (4-12 символов)");
    } else {
        removeError(password1_span, password1_input);
    }
    checkPassword2(password1_input, password2_input, password2_span);
}

function checkPassword2Server(xhr, password2_input, password2_span) {
    if (xhr.response.password2_e.length > 0) {
        showError(password2_span, password2_input, xhr.response.password2_e[0]);
        return false;
    } else {
        removeError(password2_span, password2_input);
        return true;
    }
}

function checkPassword2(password1_input, password2_input, password2_span) {
    if (password1_input.value != password2_input.value) {
        showError(password2_span, password2_input, "Пароли не совпадают");
    } else {
        removeError(password2_span, password2_input);
    }
}

function checkBdServer(xhr, bd_span) {
    if (xhr.response.bd_e.length > 0) {
        if(bd_span) showError(bd_span, null, xhr.response.bd_e[0]);
        return false;
    } else {
        if(bd_span) removeError(bd_span, null);
        return true;
    }
}

function checkEmailSendServer(xhr, send_email_span) {
    if (xhr.response.send_email_e.length > 0) {
        showError(send_email_span, null, xhr.response.send_email_e[0]);
        return false;
    } else {
        removeError(send_email_span, null);
        return true;
    }
}

function checkAccessServer(xhr) {
    if (xhr.response.access_e.length > 0) {
        return false;
    }
    return true;
}

function checkInfoServer(xhr) {
    if (xhr.response.info.length > 0) {
        return false;
    }
    return true;
}

function getResultsServer(xhr) {
    if (xhr.response.results.length > 0) {
        let text = "";
        for(let k = 0; k < xhr.response.results.length; k++) {
            text += xhr.response.results[k] + "<br>";
        }
        return text;
    }
    return null;
}

function getEmail(xhr) {
    if (xhr.response.info.length > 0) {
        return xhr.response.info[0];
    }
    return null;
}

function showError(span, input, text) {
    span.classList.add("show");
    span.classList.remove("close");
    if (input) {
        input.classList.add("error");
    }
    span.innerHTML = text;
}

function removeError(span, input) {
    if (span.classList.contains("show")) {
        span.classList.add("close");
    }
    span.classList.remove("show");
    if (input) {
        input.classList.remove("error");
    }
}

function showPopup(popup, text, error) {
    if(error) {
        popup.classList.add("error");
    } else {
        popup.classList.remove("error");
    }
    popup.querySelector(".popup_text").innerHTML = text;
    let footer = document.querySelector("footer");
    let f_top = footer.getBoundingClientRect().top;
    let f_width = footer.getBoundingClientRect().width;
    let p_height = popup.getBoundingClientRect().height;
    let p_width = popup.getBoundingClientRect().width;
    popup.style.left = (f_width - p_width) + "px";
    popup.style.top = (f_top - p_height) + "px";
    popup.classList.add("active");
    setTimeout(function() { closePopup(popup)}, 3000);
    popup.querySelector("span.close_cross").onclick = function() {
        closePopup(popup);
    }
}

function closePopup(popup) {
    popup.classList.remove("active");
}

function fadeOut(el, op = 1) {
	let opacity = op;
	let timer = setInterval(function() {
		if(opacity <= 0.1) {
			clearInterval(timer);
			el.style.display = "none";
		}
		el.style.opacity = opacity;
		el.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
		opacity -= opacity * 0.1;
	}, 5);
}

function fadeIn(el, op = 1) {
	let opacity = 0.01;
	el.style.opacity = opacity;
	el.style.display = "block";
	let timer = setInterval(function() {
		if(opacity >= op) {
			clearInterval(timer);
		}
		el.style.opacity = opacity;
		el.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
		opacity += opacity * 0.1;
	}, 5);
}

function getArrayIndex(arr, el) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == el) {
            return i;
        }
    }
    return -1;
}

function getTwoDimArrayIndex(arr, el) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] == el) {
                return [i, j];
            }
        }
    }
    return -1;
}

Array.prototype.last = function() {
    return this[this.length - 1];
}

function request(url, data) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.responseType = "json";
    xhr.send(data);
    return xhr;
}

function JSONRequest(url, data) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.responseType = "json";
    xhr.send(data);
    return xhr;
}

function newTr() { return document.createElement("tr"); }

function newTd(inner = "", contenteditable = false, cl = null) { 
    let td = document.createElement("td")
    td.innerHTML = inner;
    if(contenteditable) td.setAttribute("contenteditable", "");
    if(cl) td.classList.add(cl);
    return td; 
}

function newTh(inner = "", contenteditable = false) { 
    let th = document.createElement("th")
    th.innerHTML = inner; 
    if(contenteditable) th.setAttribute("contenteditable", "");
    return th; 
}