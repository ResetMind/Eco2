function checkBdServer(xhr, bd_span) {
    if (xhr.response.bd_e.length > 0) {
        showError(bd_span, null, xhr.response.bd_e[0]);
        return false;
    } else {
        removeError(bd_span, null);
        return true;
    }
}

function checkBdServerHome(xhr, bd_span) {
    if (xhr.response.bd_e.length > 0) {
        bd_span.innerHTML = xhr.response.bd_e[0];
        bd_span.classList.add("error"); 
        bd_span.classList.add("active"); 
        return false;
    } else {
        bd_span.classList.remove("active"); 
        bd_span.classList.remove("error"); 
        return true;
    }
}

function checkTablesServer(xhr, tables_span) {
    if (xhr.response.tables_e.length > 0) {
        //tables_span.classList.add("error"); 
        tables_span.innerHTML = xhr.response.tables_e[0];
        return false;
    } else {
        //tables_span.classList.remove("error");
        tables_span.innerHTML = "";
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

function checkEmailServer(xhr, email_input, email_span) {
    if (xhr.response.email_e.length > 0) {
        showError(email_span, email_input, xhr.response.email_e[0]);
        return false;
    } else {
        removeError(email_span, email_input);
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

function checkName(name_input, name_span) {
    if (name_input.value.length < 2 || name_input.value.length > 50) {
        showError(name_span, name_input, "Недопустимая длина имени (2-50 символов)");
    } else {
        removeError(name_span, name_input);
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

function checkPassword0(password_input, password_span) {
    if (password_input.value.length < 1) {
        showError(password_span, password_input, "Недопустимая длина пароля");
        return false;
    } else {
        removeError(password_span, password_input);
        return true;
    }
}

function checkPassword0Server(xhr, password_input, password_span) {
    if (xhr.response.password_e.length > 0) {
        showError(password_span, password_input, xhr.response.password_e[0]);
        return false;
    } else {
        removeError(password_span, password_input);
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

function checkPassword1Server(xhr, password1_input, password1_span) {
    if (xhr.response.password1_e.length > 0) {
        showError(password1_span, password1_input, xhr.response.password1_e[0]);
        return false;
    } else {
        removeError(password1_span, password1_input);
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

function checkPassword2Server(xhr, password2_input, password2_span) {
    if (xhr.response.password2_e.length > 0) {
        showError(password2_span, password2_input, xhr.response.password2_e[0]);
        return false;
    } else {
        removeError(password2_span, password2_input);
        return true;
    }
}

function checkAccessServer(xhr) {
    if (xhr.response.access_e.length > 0) {
        return false;
    }
    return true;
}

function showError(span, input, text) {
    span.classList.add("show");
    span.classList.remove("close");
    if (input != null) {
        input.classList.add("error");
    }
    span.innerHTML = text;
}

function removeError(span, input) {
    if (span.classList.contains("show")) {
        span.classList.add("close");
    }
    span.classList.remove("show");
    if (input != null) {
        input.classList.remove("error");
    }
}