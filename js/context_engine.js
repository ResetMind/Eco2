let right_context_menu = document.querySelector(".right_context_menu");
setContextMenu();

function setContextMenu() {
    document.body.oncontextmenu = function (e) {
        if (e.target.nodeName == "TD") {
            e.preventDefault();
            showContextMenu(e.clientX, e.clientY, right_context_menu);
        }
    }
}

function showContextMenu(x, y, menu) {
    menu.classList.add("active");
    if(y + menu.getBoundingClientRect().height > document.documentElement.clientHeight - footer.getBoundingClientRect().height - horiz_stub_bottom.getBoundingClientRect().height) {
        y = y - menu.getBoundingClientRect().height - 4;
    }
    if(x + menu.getBoundingClientRect().width > document.documentElement.clientWidth) {
        x = x - menu.getBoundingClientRect().width - 4;
    }
    right_context_menu.style.top = (y + 2) + "px";
    right_context_menu.style.left = (x + 2) + "px";
}

function closeContextMenu(menu) {
    menu.classList.remove("active");
}