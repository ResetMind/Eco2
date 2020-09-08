setTableEngine(1);

function setTableEngine(n) {
    let table_header = document.querySelector(".table" + n + "_header");
    let table_body = document.querySelector(".table" + n + "_body");
    let content = document.querySelectorAll(".content")[n - 1];
    console.log(content);
    content.onscroll = function() {
        console.log(content.scrollLeft);
    }
}