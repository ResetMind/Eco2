function process_th_spl(x_arr, y_arr) {
    /*y_arr = [33.1154, 34.8138, 36.5982, 38.4747, 40.4473, 42.5211,
        44.7012, 46.9931, 49.4024, 51.9354, 54.5982, 57.3975, 60.3403];
    x_arr = [3.5, 3.55, 3.6, 3.65, 3.7, 3.75, 3.8, 3.85, 3.9, 3.95, 4.0, 4.05, 4.1];*/
    let h = [];
    for (let k = 0; k < x_arr.length - 1; k++) {
        h.push(x_arr[k + 1] - x_arr[k]);
    }
    let arr = [];
    for (let k = 1; k < h.length; k++) {
        let row = [];
        row.push(h[k - 1]);
        row.push(2 * (h[k - 1] + h[k]));
        row.push(h[k]);
        row.push(3 * ((y_arr[k + 1] - y_arr[k]) / h[k] - (y_arr[k] - y_arr[k - 1]) / h[k - 1]));
        arr.push(row);
    }
    //console.log(arr);
    let alpha = [], beta = [];
    for (let k = 0; k < arr.length; k++) {
        if (k == 0) {
            alpha.push(-arr[k][3] / arr[k][1]);
            beta.push(arr[k][3] / arr[k][1]);
        } else {
            let y = arr[k][0] * alpha[k - 1] + arr[k][1];
            alpha.push(-arr[k][2] / y);
            beta.push((arr[k][3] - arr[k][0] * beta[k - 1]) / y);
        }
    }
    //console.log(alpha);
    //console.log(beta);
    let c = [];
    //console.log(beta.length);
    for (let k = beta.length - 1; k >= 0; k--) {
        //console.log(k);
        if (k == beta.length - 1) {
            c.unshift(beta[k]);
        } else {
            c.unshift(alpha[k] * c[0] + beta[k]);
        }
    }
    c.unshift(0);
    c.push(0);
    let d = [], b = [];
    for (let k = 1; k <= h.length; k++) {
        d.push((c[k] - c[k - 1]) / 3 * h[k - 1]);
        b.push((y_arr[k] - y_arr[k - 1]) / h[k - 1] + (2 * c[k] + c[k - 1]) * h[k - 1] / 3);
    }
    d.push(0);
    b.unshift(0);
    console.log(c);
    console.log(d);
    console.log(b);
    return [b, c, d];
}

function get_th_spl(x_arr, y_arr, b, c, d, x) {
    /*y_arr = [33.1154, 34.8138, 36.5982, 38.4747, 40.4473, 42.5211,
        44.7012, 46.9931, 49.4024, 51.9354, 54.5982, 57.3975, 60.3403];
    x_arr = [3.5, 3.55, 3.6, 3.65, 3.7, 3.75, 3.8, 3.85, 3.9, 3.95, 4.0, 4.05, 4.1];*/
    let i = 0;
    if (x < x_arr[0]) i = 0;
    else if (x >= x_arr[x_arr.length - 1]) i = x_arr.length - 1;
    else {
        for (let k = 1; k < x_arr.length; k++) {
            if (x >= x_arr[k - 1] && x < x_arr[k]) {
                i = k - 1;
                break;
            }
        }
    }
    return y_arr[i] + b[i] * (x - x_arr[i]) + c[i] * Math.pow(x - x_arr[i], 2) +
        d[i] * Math.pow(x - x_arr[i], 3);
}