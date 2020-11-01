function request(url, data) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.responseType = "json";
    xhr.send(data);
    return xhr;
}