function checkBdServer(xhr, bd_span) {
    if (xhr.response.bd_e.length > 0) {
        showError(bd_span, null, xhr.response.bd_e[0]);
        return false;
    } else {
        removeError(bd_span, null);
        return true;
    }
}

function checkAccessServer(xhr) {
    if (xhr.response.access_e.length > 0) {
        return false;
    }
    return true;
}

function checkBdServerHome(xhr) {
    if (xhr.response.bd_e.length > 0) {
        return false;
    }
    return true;
}

function showError(span, input, text) {
    span.classList.add("show");
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