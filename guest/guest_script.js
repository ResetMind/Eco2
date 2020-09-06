function sign_in(){
    const request = new XMLHttpRequest();
    const url = "find.php?email=" + signin.email.value + 
    "&password1=" + signin.password1.value + 
    "&password2=" + signin.password2.value;
    request.open("GET", url);
    request.addEventListener("readystatechange", () => {
        if (request.readyState === 4 && request.status === 200) {
            let response = request.responseText;
            if (response.includes("tbody")) {
                table[2].innerHTML = response;
                cellOnFocus();
            } else {
                table[2].innerHTML = "<tbody><tr><td>Совпадений нет<td></tr></tbody>";
            }
        }
    });
    request.send();
}