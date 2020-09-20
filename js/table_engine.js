let horiz_stub_up = document.querySelector(".horiz_stub_up");
let header = document.querySelector("header");
let footer = document.querySelector("footer");
setTableEngine(1);

function setTableEngine(n) {
    let table_header = document.querySelector(".table" + n + "_header");
    let table_body = document.querySelector(".table" + n + "_body");
    let content = document.querySelectorAll(".content")[n - 1];
    let wrapper = document.querySelectorAll(".wrapper")[n - 1];
    /*content.style.height = document.documentElement.clientHeight - horiz_stub_up.clientHeight * 2 - header.clientHeight * 2 - 22 + "px";*/
    /*content.style.width = document.documentElement.clientWidth + "px";*/
    /*console.log(content.clientWidth);
    console.log(content.offsetWidth - content.clientWidth);*/
    content.onscroll = function() {
        console.log(content.scrollLeft);
    }
}