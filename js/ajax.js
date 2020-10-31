let xhr;

function request(url, data) {
    xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.send(data);
    xhr.onload = function() {
        if (xhr.status != 200) {
            console.log(xhr.status);
        } else {
            console.log(xhr.response);
        }
    }
}