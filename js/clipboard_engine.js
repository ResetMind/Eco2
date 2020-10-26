let clipboard = null;

function setClipParam(trigger, target) {
    if(clipboard != null) {
        clipboard.destroy();
    }
    clipboard = new ClipboardJS(trigger, {
        target: function() {
            return target;
        }
    });
    clipboard.on("success", function(e) {
        console.info("Action:", e.action);
        console.info("Text:", e.text);
        console.info("Trigger:", e.trigger);
        e.clearSelection();
    });
    clipboard.on("error", function(e) {
        console.error("Action:", e.action);
        console.error("Trigger:", e.trigger);
    });
}