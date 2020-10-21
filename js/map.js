function setMapButton() {
    ths_1 = table_header[1].querySelectorAll("th");
    open_map = table_header[1].querySelector("a.open_map");
    ths_1[ths_1.length - 1].onmouseover = function(e) {
        open_map.style.opacity = "100";
    } 
    ths_1[ths_1.length - 1].onmouseout = function(e) {
        open_map.style.opacity = "0";
    }
}