const e = 0.001;
let fibList = [];

function halfDivision(type, a, b, func, coef) {
    while(Math.abs(a - b) > e) {
        let x1 = a + 0.25 * (b - a);
        let x2 = b - 0.25 * (b - a);
        let y1 = func(coef, x1);
        let y2 = func(coef, x2);
        let comp;
        if(type == "0") comp = y1 < y2;
        else comp = y1 > y2;
        if(comp) {
            b = x2;
        } else {
            a = x1;
        }
    }
    let x_res = (a + b) / 2;
    let y_res = func(coef, x_res);;
    console.log(x_res + " " + y_res);
    return [x_res, y_res];
}

function goldenRatio(type, a, b, func, coef) {
    let x1 = a + 0.38 * (b - a);
    let x2 = b - 0.38 * (b - a);
    let y1 = func(coef, x1);
    let y2 = func(coef, x2);
    while(Math.abs(a - b) > e) {
        let comp;
        if(type == "0") comp = y1 < y2;
        else comp = y1 > y2;
        if(comp) {
            b = x2;
            x2 = x1;
            y2 = y1;
            x1 = a + 0.38 * (b - a);
            y1 = func(coef, x1);
        } else {
            a = x1;
            x1 = x2;
            y1 = y2;
            x2 = b - 0.38 * (b - a);
            y2 = func(coef, x2);
        }
    }
    let x_res = (a + b) / 2;
    let y_res = func(coef, x_res);;
    return [x_res, y_res];
}

function fibonacci(type, a, b, func, coef) {
    if(b == a) return;
    let n = (b - a) / e;
    getFibList(n);
    let y_res = null, x_res = null;
    for (let k = 2; k <= fibList.length; k++) {
        let x1 = b - fibList[fibList.length - k] * (b - a) / fibList[fibList.length - k + 1];
        let x2 = a + fibList[fibList.length - k] * (b - a) / fibList[fibList.length - k + 1];
        let y1 = func(coef, x1);
        let y2 = func(coef, x2);
        let comp;
        if(type == "0") comp = y1 < y2;
        else comp = y1 > y2;
        if (comp) {
            x_res = x1;
            y_res = y1;
            b = x2;
        } else {
            x_res = x2;
            y_res = y2;
            a = x1;
        }
    }
    return [x_res, y_res];
}

function getFibList(n) {
    let f0 = 1, f1 = 1;
    fibList.push(f0);
    fibList.push(f1);
    do {
        if (n > fibList[fibList.length - 2] && n < fibList[fibList.length - 1]) {
            break;
        }
        fibList.push(fibList[fibList.length - 2] + fibList[fibList.length - 1]);
    } while (true);
}