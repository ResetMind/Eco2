function linear(x, y, back, forward, step) {
    console.log(x);
    console.log(y);
    let a = create2DimArray(2);
    let b = new Array(2);
    a[0][0] = x.length;
    a[0][1] = 0;
    a[1][1] = 0;
    for(let i = 0; i < x.length; i++) {
        a[0][1] += x[i];
        a[1][1] += Math.pow(x[i], 2);
    }
    a[1][0] = a[0][1];
    b[0] = 0;
    b[1] = 0;
    for(let i = 0; i < y.length; i++) {
        b[0] += y[i];
        b[1] += y[i] * x[i];
    }
    let coef = holeckiy(a, b);
    let y_tr = new Array();
    let y_tr_2 = new Array();
    let x_tr = new Array();
    for(let i = x[0] - step; i >= x[0] - back * step; i -= step) {
        x_tr.unshift(i);
        y_tr.unshift(get_y_linear(coef, i));
    }
    for(let i = 0; i < x.length; i++) {
        x_tr.push(x[i]);
        y_tr.push(get_y_linear(coef, x[i]));
        y_tr_2.push(get_y_linear(coef, x[i]));
    }
    let last = x_tr[x_tr.length - 1];
    for(let i = last + step; i <= last + forward * step; i += step) {
        x_tr.push(i);
        y_tr.push(get_y_linear(coef, i));
    }
    //console.log(x_tr);
    console.log(y_tr);
    return {
        x_tr: x_tr, 
        y_tr: y_tr, 
        r: r2(y, y_tr_2).toFixed(4),
        a: get_a(y, y_tr_2).toFixed(4),
        coef: coef
    };
}

function get_y_linear(coef, x) {
    return coef[0] + coef[1] * x;
}

function hyperbole(x, y, back, forward, step) {
    let a = create2DimArray(2);
    let b = new Array(2);
    a[0][0] = x.length;
    a[0][1] = 0;
    a[1][1] = 0;
    for(let i = 0; i < x.length; i++) {
        a[0][1] += 1 / x[i];
        a[1][1] += 1 / Math.pow(x[i], 2);;
    }
    a[1][0] = a[0][1];
    b[0] = 0;
    b[1] = 0;
    for(let i = 0; i < y.length; i++) {
        b[0] += y[i];
        b[1] += y[i] / x[i];
    }
    let coef = holeckiy(a, b);
    let y_tr = new Array();
    let y_tr_2 = new Array();
    let x_tr = new Array();
    for(let i = x[0] - step; i >= x[0] - back * step; i -= step) {
        x_tr.unshift(i);
        y_tr.unshift(get_y_hyperbole(coef, i));
    }
    for(let i = 0; i < x.length; i++) {
        x_tr.push(x[i]);
        y_tr.push(get_y_hyperbole(coef, x[i]));
        y_tr_2.push(get_y_hyperbole(coef, x[i]));
    }
    let last = x_tr[x_tr.length - 1];
    for(let i = last + step; i <= last + forward * step; i += step) {
        x_tr.push(i);
        y_tr.push(get_y_hyperbole(coef, i));
    }
    console.log(y_tr);
    return {
        x_tr: x_tr, 
        y_tr: y_tr, 
        r: r2(y, y_tr_2).toFixed(4),
        a: get_a(y, y_tr_2).toFixed(4),
        coef: coef
    };
}

function get_y_hyperbole(coef, x) {
    return coef[0] + coef[1] * 1 / x;
}

function parabole2(x, y, back, forward, step) {
    let a = create2DimArray(3);
    let b = new Array(3);
    a[0][0] = x.length;
    a[0][1] = 0;
    a[0][2] = 0;
    a[1][2] = 0;
    a[2][2] = 0;
    for(let i = 0; i < x.length; i++) {
        a[0][1] += x[i];
        a[0][2] += Math.pow(x[i], 2);
        a[1][2] += Math.pow(x[i], 3);
        a[2][2] += Math.pow(x[i], 4);
    }
    a[1][0] = a[0][1];
    a[1][1] = a[0][2];

    a[2][0] = a[1][1];
    a[2][1] = a[1][2];

    b[0] = 0;
    b[1] = 0;
    b[2] = 0;
    for(let i = 0; i < y.length; i++) {
        b[0] += y[i];
        b[1] += y[i] * x[i];
        b[2] += y[i] * Math.pow(x[i], 2);
    }
    let coef = holeckiy(a, b);
    let y_tr = new Array();
    let y_tr_2 = new Array();
    let x_tr = new Array();
    for(let i = x[0] - step; i >= x[0] - back * step; i -= step) {
        x_tr.unshift(i);
        y_tr.unshift(get_y_tr(i));
    }
    for(let i = 0; i < x.length; i++) {
        x_tr.push(x[i]);
        y_tr.push(get_y_tr(x[i]));
        y_tr_2.push(get_y_tr(x[i]));
    }
    let last = x_tr[x_tr.length - 1];
    for(let i = last + step; i <= last + forward * step; i += step) {
        x_tr.push(i);
        y_tr.push(get_y_tr(i));
    }
    function get_y_tr(x) {
        return coef[0] + coef[1] * x + coef[2] * Math.pow(x, 2);
    }
    let xy = [x_tr, y_tr, r2(y, y_tr_2)];
    return xy;
}

function parabole3(x, y, back, forward, step) {
    let a = create2DimArray(4);
    let b = new Array(4);
    a[0][0] = x.length;
    a[0][1] = 0;
    a[0][2] = 0;
    a[0][3] = 0;
    a[1][3] = 0;
    a[2][3] = 0;
    a[3][3] = 0;
    for(let i = 0; i < x.length; i++) {
        a[0][1] += x[i];
        a[0][2] += Math.pow(x[i], 2);
        a[0][3] += Math.pow(x[i], 3);
        a[1][3] += Math.pow(x[i], 4);
        a[2][3] += Math.pow(x[i], 5);
        a[3][3] += Math.pow(x[i], 6);
    }
    a[1][0] = a[0][1];
    a[1][1] = a[0][2];
    a[1][2] = a[0][3];

    a[2][0] = a[1][1];
    a[2][1] = a[1][2];
    a[2][2] = a[1][3];

    a[3][0] = a[2][1];
    a[3][1] = a[2][2];
    a[3][2] = a[2][3];

    b[0] = 0;
    b[1] = 0;
    b[2] = 0;
    b[3] = 0;
    for(let i = 0; i < y.length; i++) {
        b[0] += y[i];
        b[1] += y[i] * x[i];
        b[2] += y[i] * Math.pow(x[i], 2);
        b[3] += y[i] * Math.pow(x[i], 3);
    }
    let coef = holeckiy(a, b);
    let y_tr = new Array();
    let y_tr_2 = new Array();
    let x_tr = new Array();
    for(let i = x[0] - step; i >= x[0] - back * step; i -= step) {
        x_tr.unshift(i);
        y_tr.unshift(get_y_tr(i));
    }
    for(let i = 0; i < x.length; i++) {
        x_tr.push(x[i]);
        y_tr.push(get_y_tr(x[i]));
        y_tr_2.push(get_y_tr(x[i]));
    }
    let last = x_tr[x_tr.length - 1];
    for(let i = last + step; i <= last + forward * step; i += step) {
        x_tr.push(i);
        y_tr.push(get_y_tr(i));
    }
    function get_y_tr(x) {
        return coef[0] + coef[1] * x + coef[2] * Math.pow(x, 2) + coef[3] * Math.pow(x, 3);
    }
    let xy = [x_tr, y_tr, r2(y, y_tr_2)];
    return xy;
}

function parabole4(x, y, back, forward, step) {
    let a = create2DimArray(5);
    let b = new Array(5);
    a[0][0] = x.length;
    a[0][1] = 0;
    a[0][2] = 0;
    a[0][3] = 0;
    a[0][4] = 0;
    a[1][4] = 0;
    a[2][4] = 0;
    a[3][4] = 0;
    a[4][4] = 0;
    for(let i = 0; i < x.length; i++) {
        a[0][1] += x[i];
        a[0][2] += Math.pow(x[i], 2);
        a[0][3] += Math.pow(x[i], 3);
        a[0][4] += Math.pow(x[i], 4);
        a[1][4] += Math.pow(x[i], 5);
        a[2][4] += Math.pow(x[i], 6);
        a[3][4] += Math.pow(x[i], 7);
        a[4][4] += Math.pow(x[i], 8);
    }
    a[1][0] = a[0][1];
    a[1][1] = a[0][2];
    a[1][2] = a[0][3];
    a[1][3] = a[0][4];

    a[2][0] = a[1][1];
    a[2][1] = a[1][2];
    a[2][2] = a[1][3];
    a[2][3] = a[1][4];

    a[3][0] = a[2][1];
    a[3][1] = a[2][2];
    a[3][2] = a[2][3];
    a[3][3] = a[2][4];

    a[4][0] = a[3][1];
    a[4][1] = a[3][2];
    a[4][2] = a[3][3];
    a[4][3] = a[3][4];

    b[0] = 0;
    b[1] = 0;
    b[2] = 0;
    b[3] = 0;
    b[4] = 0;
    for(let i = 0; i < y.length; i++) {
        b[0] += y[i];
        b[1] += y[i] * x[i];
        b[2] += y[i] * Math.pow(x[i], 2);
        b[3] += y[i] * Math.pow(x[i], 3);
        b[4] += y[i] * Math.pow(x[i], 4);
    }
    let coef = holeckiy(a, b);
    let y_tr = new Array();
    let y_tr_2 = new Array();
    let x_tr = new Array();
    for(let i = x[0] - step; i >= x[0] - back * step; i -= step) {
        x_tr.unshift(i);
        y_tr.unshift(get_y_tr(i));
    }
    for(let i = 0; i < x.length; i++) {
        x_tr.push(x[i]);
        y_tr.push(get_y_tr(x[i]));
        y_tr_2.push(get_y_tr(x[i]));
    }
    let last = x_tr[x_tr.length - 1];
    for(let i = last + step; i <= last + forward * step; i += step) {
        x_tr.push(i);
        y_tr.push(get_y_tr(i));
    }
    function get_y_tr(x) {
        return coef[0] + coef[1] * x + coef[2] * Math.pow(x, 2) + coef[3] * Math.pow(x, 3) + coef[4] * Math.pow(x, 4);
    }
    let xy = [x_tr, y_tr, r2(y, y_tr_2)];
    return xy;
}

function parabole5(x, y, back, forward, step) {
    let a = create2DimArray(6);
    let b = new Array(6);
    a[0][0] = x.length;
    a[0][1] = 0;
    a[0][2] = 0;
    a[0][3] = 0;
    a[0][4] = 0;
    a[0][5] = 0;
    a[1][5] = 0;
    a[2][5] = 0;
    a[3][5] = 0;
    a[4][5] = 0;
    a[5][5] = 0;
    for(let i = 0; i < x.length; i++) {
        a[0][1] += x[i];
        a[0][2] += Math.pow(x[i], 2);
        a[0][3] += Math.pow(x[i], 3);
        a[0][4] += Math.pow(x[i], 4);
        a[0][5] += Math.pow(x[i], 5);
        a[1][5] += Math.pow(x[i], 6);
        a[2][5] += Math.pow(x[i], 7);
        a[3][5] += Math.pow(x[i], 8);
        a[4][5] += Math.pow(x[i], 9);
        a[5][5] += Math.pow(x[i], 10);
    }
    a[1][0] = a[0][1];
    a[1][1] = a[0][2];
    a[1][2] = a[0][3];
    a[1][3] = a[0][4];
    a[1][4] = a[0][5];

    a[2][0] = a[1][1];
    a[2][1] = a[1][2];
    a[2][2] = a[1][3];
    a[2][3] = a[1][4];
    a[2][4] = a[1][5];

    a[3][0] = a[2][1];
    a[3][1] = a[2][2];
    a[3][2] = a[2][3];
    a[3][3] = a[2][4];
    a[3][4] = a[2][5];

    a[4][0] = a[3][1];
    a[4][1] = a[3][2];
    a[4][2] = a[3][3];
    a[4][3] = a[3][4];
    a[4][4] = a[3][5];

    a[5][0] = a[4][1];
    a[5][1] = a[4][2];
    a[5][2] = a[4][3];
    a[5][3] = a[4][4];
    a[5][4] = a[4][5];

    b[0] = 0;
    b[1] = 0;
    b[2] = 0;
    b[3] = 0;
    b[4] = 0;
    b[5] = 0;
    for(let i = 0; i < y.length; i++) {
        b[0] += y[i];
        b[1] += y[i] * x[i];
        b[2] += y[i] * Math.pow(x[i], 2);
        b[3] += y[i] * Math.pow(x[i], 3);
        b[4] += y[i] * Math.pow(x[i], 4);
        b[5] += y[i] * Math.pow(x[i], 5);
    }
    let coef = holeckiy(a, b);
    let y_tr = new Array();
    let y_tr_2 = new Array();
    let x_tr = new Array();
    for(let i = x[0] - step; i >= x[0] - back * step; i -= step) {
        x_tr.unshift(i);
        y_tr.unshift(get_y_tr(i));
    }
    for(let i = 0; i < x.length; i++) {
        x_tr.push(x[i]);
        y_tr.push(get_y_tr(x[i]));
        y_tr_2.push(get_y_tr(x[i]));
    }
    let last = x_tr[x_tr.length - 1];
    for(let i = last + step; i <= last + forward * step; i += step) {
        x_tr.push(i);
        y_tr.push(get_y_tr(i));
    }
    function get_y_tr(x) {
        return coef[0] + coef[1] * x + coef[2] * Math.pow(x, 2) + coef[3] * Math.pow(x, 3) + coef[4] * Math.pow(x, 4) + coef[5] * Math.pow(x, 5);
    }
    let xy = [x_tr, y_tr, r2(y, y_tr_2)];
    return xy;
}

function parabole6(x, y, back, forward, step) {
    let a = create2DimArray(7);
    let b = new Array(7);
    a[0][0] = x.length;
    a[0][1] = 0;
    a[0][2] = 0;
    a[0][3] = 0;
    a[0][4] = 0;
    a[0][5] = 0;
    a[0][6] = 0;
    a[1][6] = 0;
    a[2][6] = 0;
    a[3][6] = 0;
    a[4][6] = 0;
    a[5][6] = 0;
    a[6][6] = 0;
    for(let i = 0; i < x.length; i++) {
        a[0][1] += x[i];
        a[0][2] += Math.pow(x[i], 2);
        a[0][3] += Math.pow(x[i], 3);
        a[0][4] += Math.pow(x[i], 4);
        a[0][5] += Math.pow(x[i], 5);
        a[0][6] += Math.pow(x[i], 6);
        a[1][6] += Math.pow(x[i], 7);
        a[2][6] += Math.pow(x[i], 8);
        a[3][6] += Math.pow(x[i], 9);
        a[4][6] += Math.pow(x[i], 10);
        a[5][6] += Math.pow(x[i], 11);
        a[6][6] += Math.pow(x[i], 12);
    }
    a[1][0] = a[0][1];
    a[1][1] = a[0][2];
    a[1][2] = a[0][3];
    a[1][3] = a[0][4];
    a[1][4] = a[0][5];
    a[1][5] = a[0][6];

    a[2][0] = a[1][1];
    a[2][1] = a[1][2];
    a[2][2] = a[1][3];
    a[2][3] = a[1][4];
    a[2][4] = a[1][5];
    a[2][5] = a[1][6];

    a[3][0] = a[2][1];
    a[3][1] = a[2][2];
    a[3][2] = a[2][3];
    a[3][3] = a[2][4];
    a[3][4] = a[2][5];
    a[3][5] = a[2][6];

    a[4][0] = a[3][1];
    a[4][1] = a[3][2];
    a[4][2] = a[3][3];
    a[4][3] = a[3][4];
    a[4][4] = a[3][5];
    a[4][5] = a[3][6];

    a[5][0] = a[4][1];
    a[5][1] = a[4][2];
    a[5][2] = a[4][3];
    a[5][3] = a[4][4];
    a[5][4] = a[4][5];
    a[5][5] = a[4][6];

    a[6][0] = a[5][1];
    a[6][1] = a[5][2];
    a[6][2] = a[5][3];
    a[6][3] = a[5][4];
    a[6][4] = a[5][5];
    a[6][5] = a[5][6];

    b[0] = 0;
    b[1] = 0;
    b[2] = 0;
    b[3] = 0;
    b[4] = 0;
    b[5] = 0;
    b[6] = 0;
    for(let i = 0; i < y.length; i++) {
        b[0] += y[i];
        b[1] += y[i] * x[i];
        b[2] += y[i] * Math.pow(x[i], 2);
        b[3] += y[i] * Math.pow(x[i], 3);
        b[4] += y[i] * Math.pow(x[i], 4);
        b[5] += y[i] * Math.pow(x[i], 5);
        b[6] += y[i] * Math.pow(x[i], 6);
    }
    let coef = holeckiy(a, b);
    let y_tr = new Array();
    let y_tr_2 = new Array();
    let x_tr = new Array();
    for(let i = x[0] - step; i >= x[0] - back * step; i -= step) {
        x_tr.unshift(i);
        y_tr.unshift(get_y_tr(i));
    }
    for(let i = 0; i < x.length; i++) {
        x_tr.push(x[i]);
        y_tr.push(get_y_tr(x[i]));
        y_tr_2.push(get_y_tr(x[i]));
    }
    let last = x_tr[x_tr.length - 1];
    for(let i = last + step; i <= last + forward * step; i += step) {
        x_tr.push(i);
        y_tr.push(get_y_tr(i));
    }
    function get_y_tr(x) {
        return coef[0] + coef[1] * x + coef[2] * Math.pow(x, 2) + coef[3] * Math.pow(x, 3) + coef[4] * Math.pow(x, 4) + coef[5] * Math.pow(x, 5) + coef[6] * Math.pow(x, 6);
    }
    let xy = [x_tr, y_tr, r2(y, y_tr_2)];
    return xy;
}

function exponent(x, y, back, forward, step) {
    let a = create2DimArray(2);
    let b = new Array(2);
    a[0][0] = x.length;
    a[0][1] = 0;
    a[1][1] = 0;
    for(let i = 0; i < x.length; i++) {
        a[0][1] += x[i];
        a[1][1] += Math.pow(x[i], 2);
    }
    a[1][0] = a[0][1];
    b[0] = 0;
    b[1] = 0;
    for(let i = 0; i < y.length; i++) {
        b[0] += Math.log(y[i]);
        b[1] += Math.log(y[i]) * x[i];
    }
    let coef = holeckiy(a, b);
    coef[0] = Math.exp(coef[0]); // мы находили с = ln_a1
    let y_tr = new Array();
    let y_tr_2 = new Array();
    let x_tr = new Array();
    for(let i = x[0] - step; i >= x[0] - back * step; i -= step) {
        x_tr.unshift(i);
        y_tr.unshift(get_y_tr(i));
    }
    for(let i = 0; i < x.length; i++) {
        x_tr.push(x[i]);
        y_tr.push(get_y_tr(x[i]));
        y_tr_2.push(get_y_tr(x[i]));
    }
    let last = x_tr[x_tr.length - 1];
    for(let i = last + step; i <= last + forward * step; i += step) {
        x_tr.push(i);
        y_tr.push(get_y_tr(i));
    }
    function get_y_tr(x) {
        return coef[0] * Math.exp(coef[1] * x);
    }
    let xy = [x_tr, y_tr, r2(y, y_tr_2)];
    return xy;
}

function stepennaya(x, y, back, forward, step) {
    let a = create2DimArray(2);
    let b = new Array(2);
    a[0][0] = x.length;
    a[0][1] = 0;
    a[1][1] = 0;
    for(let i = 0; i < x.length; i++) {
        a[0][1] += Math.log(x[i]);
        a[1][1] += Math.pow(Math.log(x[i]), 2);
    }
    a[1][0] = a[0][1];
    b[0] = 0;
    b[1] = 0;
    for(let i = 0; i < y.length; i++) {
        b[0] += Math.log(y[i]);
        b[1] += Math.log(y[i]) * Math.log(x[i]);
    }
    let coef = holeckiy(a, b);
    coef[0] = Math.exp(coef[0]); // мы находили с = ln_a1
    console.log(coef);
    let y_tr = new Array();
    let y_tr_2 = new Array();
    let x_tr = new Array();
    for(let i = x[0] - step; i >= x[0] - back * step; i -= step) {
        x_tr.unshift(i);
        y_tr.unshift(get_y_tr(i));
    }
    for(let i = 0; i < x.length; i++) {
        x_tr.push(x[i]);
        y_tr.push(get_y_tr(x[i]));
        y_tr_2.push(get_y_tr(x[i]));
    }
    let last = x_tr[x_tr.length - 1];
    for(let i = last + step; i <= last + forward * step; i += step) {
        x_tr.push(i);
        y_tr.push(get_y_tr(i));
    }
    function get_y_tr(x) {
        return coef[0] * Math.pow(x, coef[1]);
    }
    let xy = [x_tr, y_tr, r2(y, y_tr_2)];
    return xy;
}

function r2(y0, y1) {
    let s_rem = 0;
    let y_avg = 0;
    for(let i = 0; i < y0.length; i++) {
        s_rem += Math.pow(y1[i] - y0[i], 2);
        y_avg += y0[i];
    }
    y_avg /= y0.length;
    let s_reg = 0;
    for(let i = 0; i < y0.length; i++) {
        s_reg += Math.pow(y1[i] - y_avg, 2);
    }
    let s_full = s_reg + s_rem;
    return 1 - s_rem / s_full;
}

function get_a(y0, y1) {
    let sum = 0;
    for(let i = 0; i < y0.length; i++) {
        sum += Math.abs((y0[i] - y1[i]) / y0[i]);
    }
    console.log(sum);
    return sum / y0.length * 100;
}

function holeckiy(a, b) {
    let n = a.length;
    let l = create2DimArray(n);
    let u = create2DimArray(n);
    let y = create2DimArray(n);
    let x = create2DimArray(n);
    for(let i = 0; i < n; i++) {
        l[i][0] = a[i][0];
        u[0][i] = a[0][i] / l[0][0];
        if(i == 0) {
            y[0] = b[0] / l[0][0];
        }
        let sum_y = 0;
        for(let j = 1; j <= i; j++) {
            let sum_l = 0;
            let sum_u = 0;
            sum_y = 0;
            for(let k = 0; k <= j - 1; k++) {
                sum_l += l[i][k] * u[k][j];
                sum_u += l[j][k] * u[k][i];
                sum_y += l[i][k] * y[k];
            }
            l[i][j] = a[i][j] - sum_l;
            u[j][i] = (a[j][i] - sum_u) / l[j][j];
        }
        if(i != 0) {
            y[i] = (b[i] - sum_y) / l[i][i];
        }
    }
    x[n - 1] = y[n - 1];
    for(let i = n - 2; i >= 0; i--) {
        let sum_x = 0;
        for(let k = i + 1; k < n; k++) {
            sum_x += u[i][k] * x[k];
        }
        x[i] = y[i] - sum_x;
    }
    //console.log(x);
    return x;
}

function create2DimArray(n) {
    let arr = new Array(n);
    for(let i = 0; i < n; i++) {
        arr[i] = new Array(n);
        for(let j = 0; j < n; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}