let clipboard = null;

function setClipParam(trigger, target) {
    destroyClipboard();
    clipboard = new ClipboardJS(trigger, {
        target: function() {
            return target;
        }
    });
    clipboard.on("success", function(e) {
        /*console.info("Action:", e.action);
        console.info("Text:", e.text);
        console.info("Trigger:", e.trigger);*/
        table_body[0].removeEventListener("keydown", onKeyDown); //!!!!!!!!!!!!!!!
        table_body[1].removeEventListener("keydown", onKeyDown);
        table_body[2].removeEventListener("keydown", onKeyDown);
        e.clearSelection();
        onClipboardSuccess();
    });
    clipboard.on("error", function(e) {
        console.error("Action:", e.action);
        console.error("Trigger:", e.trigger);
        onClipboardError();
    });
}

function destroyClipboard() {
    if(clipboard != null) {
        clipboard.destroy();
    }
}

function onClipboardSuccess() {
    td_selection[selected_content_i].classList.add("transition");
    td_selection[selected_content_i].classList.add("success");
    setTimeout(function() {
        td_selection[selected_content_i].classList.remove("success");
    }, 200);
}

function onClipboardError() {
    td_selection[selected_content_i].classList.add("transition");
    td_selection[selected_content_i].classList.add("error");
    setTimeout(function() {
        td_selection[selected_content_i].classList.remove("error");
    }, 200);
}