function setTableEngine(table) {// div.table
    let table_body = table.querySelector("div.table_body");
    let table_header = table.querySelector("table.table_header");
    let table_header_left = table_header.getBoundingClientRect().left;
    table_body.onscroll = function() {
        /*console.log(table_header.offsetLeft);
        console.log(table_body.clientLeft);*/
        table_header.style.left = -table_body.scrollLeft + "px";
        console.log("scroll");
    }

    window.onresize = function() {
        
    }
}