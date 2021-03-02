let r_paste = document.querySelector("li.r_paste");
let r_cut = document.querySelector("li.r_сut");
let r_clear = document.querySelector("li.r_clear");
let r_row_up = document.querySelector("li.r_row_up");
let r_row_down = document.querySelector("li.r_row_down");
let r_delete_row = document.querySelector("li.r_delete_row");
let right_context_menu = document.querySelector("ul.right_context_menu");
let context_menu = document.querySelectorAll("ul.context_menu")

function setRightContextMenu() {
    document.body.oncontextmenu = function(e) {
        if (e.target.nodeName == "TD") {
            e.preventDefault();
            closeAllContext();

            showContextMenu(e.clientX, e.clientY, right_context_menu);
        }
    }
}

document.body.onmousedown = function() {
    closeAllContext();
}

function showContextMenu(x, y, menu) {
    
    menu.classList.add("active");
    if (y + menu.getBoundingClientRect().height > document.documentElement.clientHeight) {
        y = y - menu.getBoundingClientRect().height - 5;
    }
    if (x + menu.getBoundingClientRect().width > document.documentElement.clientWidth) {
        x = x - menu.getBoundingClientRect().width - 5;
    }
    menu.style.top = (y + 2) + "px";
    menu.style.left = (x + 2) + "px";
}

function closeAllContext() {
    for(let i = 0; i < context_menu.length; i++) {
        context_menu[i].classList.remove("active");
    }
}