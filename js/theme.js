if(getCookie("theme")) {
    setTheme(getCookie("theme"));
} else {
    setTheme(0);
}

function setTheme(type) {
    if(type == 0) {
        document.querySelector("#theme").setAttribute("href", "../eco2/css/light_theme.css");
        document.cookie = "theme=0;max-age=31556926";
    } else if(type == 1) {
        document.querySelector("#theme").setAttribute("href", "../eco2/css/dark_theme.css");
        document.cookie = "theme=1;max-age=31556926";
    }
}

function getCookie(name) {
	var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}