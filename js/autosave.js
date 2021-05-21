let timer;

function setAutosaveCookie(type) {
    document.cookie = "autosave=" + type + ";max-age=31556926";
}

function setAutosave() {
    let type = getCookie("autosave");
    console.log(type);
    if (type == 1) {
        timer = setInterval(function() { save_button.click() }, 1000 * 60);
    } else if (type == 2) {
        timer = setInterval(function() { save_button.click() }, 1000 * 60 * 5);
    } else if (type == 3) {
        timer = setInterval(function() { save_button.click() }, 1000 * 60 * 10);
    }
}

function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}