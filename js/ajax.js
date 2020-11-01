let xhr;

function request(url, data) {
    xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.responseType = "json";
    xhr.send(data);
}