let horiz_stub_up = document.querySelector(".horiz_stub_up");
let header = document.querySelector("header");
let footer = document.querySelector("footer");
let table_header = document.querySelectorAll(".table_header");
let table_body = document.querySelectorAll(".table_body");
let content = document.querySelectorAll(".content");

setTableEngine(0);

function setTableEngine(n) {
    
    /*content.style.height = document.documentElement.clientHeight - horiz_stub_up.clientHeight * 2 - header.clientHeight * 2 - 22 + "px";*/
    /*content.style.width = document.documentElement.clientWidth + "px";*/
    /*console.log(content.clientWidth);
    console.log(content.offsetWidth - content.clientWidth);*/
    /*content[n - 1].onscroll = function() {
        console.log(content.scrollLeft);
    }*/
}

window.onresize = function setHeaderMargin() {
    for(let i = 0; i < content.length; i++) {
        content[i].style.top = table_header[i].getBoundingClientRect().height + header.getBoundingClientRect().height + horiz_stub_up.getBoundingClientRect().height + "px";
        console.log("res " + i);
    }
}