function getArrayIndex(arr, el) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == el) {
            return i;
        }
    }
    return -1;
}

function getTwoDimArrayIndex(arr, el) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] == el) {
                return [i, j];
            }
        }
    }
    return -1;
}

function showPopup(popup, text, error) {
    if(error) {
        popup.classList.add("error");
    } else {
        popup.classList.remove("error");
    }
    popup.querySelector(".popup_text").innerHTML = text;
    let footer = document.querySelector("footer");
    let f_top = footer.getBoundingClientRect().top;
    let f_width = footer.getBoundingClientRect().width;
    let p_height = popup.getBoundingClientRect().height;
    let p_width = popup.getBoundingClientRect().width;
    popup.style.left = (f_width - p_width) + "px";
    popup.style.top = (f_top - p_height) + "px";
    popup.classList.add("active");
    setTimeout(function() { closePopup(popup)}, 10000);
    popup.querySelector("span.close_cross").onclick = function() {
        closePopup(popup);
    }
}

function closePopup(popup) {
    popup.classList.remove("active");
}