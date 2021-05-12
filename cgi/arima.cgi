#!C:\Users\spons\anaconda3\python.exe
import numpy as np
from statsmodels.tsa.arima.model import ARIMA, ARIMAResults
import cgi
import json
import sys
import cgitb
import os
import traceback


def findParam(y, p_values, d_values, q_values, prlen, path):
    global error, tb, info, llf
    best_score, best_cfg = -float("inf"), None
    for p in p_values:
        for d in d_values:
            for q in q_values:
                arima_order = [p, d, q]
                path_order = path.split("[")[1].split("]")[0]
                path = path.replace("[" + path_order + "]",
                                    str(arima_order).replace(" ", ""))
                try:
                    arima(y, arima_order, len(y), path)
                    if(error != -1):
                        continue
                    if llf > best_score:
                        best_score, best_cfg = llf, arima_order
                    info = info + ("ARIMA%s LLF=%.3f<br>" % (arima_order, llf))
                except Exception as e:
                    error = type(e).__name__
                    tb = traceback.format_exc()
                    return
    info = info + ("Best ARIMA%s LLF=%.3f" % (best_cfg, best_score))
    path_order = path.split("[")[1].split("]")[0]
    path = path.replace("[" + path_order + "]", str(best_cfg).replace(" ", ""))
    arima(y, best_cfg, len(y) + prlen - 1, path)


def arima(y, arima_order, prlen, path):
    global yhat, order, mse, llf, aic, bic, summary, error, tb
    model_fit = getSavedModel(path)["model_fit"]
    if(model_fit == None):
        try:
            model = ARIMA(y, order=arima_order)
            model_fit = model.fit()
            folder_name = path.split("/")[0]
            os.makedirs(folder_name, exist_ok=True)
            model_fit.save(path)
        except Exception as e:
            error = type(e).__name__
            tb = traceback.format_exc()
            return
    try:
        yhat = model_fit.predict(0, prlen).tolist()
        mse = model_fit.mse
        llf = model_fit.llf
        aic = model_fit.aic
        bic = model_fit.bic
        summary = model_fit.summary().as_html()
        order = arima_order
    except Exception as e:
        error = type(e).__name__
        tb = traceback.format_exc()


def getSavedModel(path):
    model_fit = None
    error = -1
    try:
        model_fit = ARIMAResults.load(path)
    except Exception as e:
        error = str(e)
    return {
        "model_fit": model_fit,
        "error": error
    }


def main():
    global result, y, x, k, prlen, auto, yhat, order, mse, llf, aic, bic, summary, error, tb
    #json_data = '{"y":[1.282, 0.958, 11.22, 0.431, 2.029, 1.699, 6.46, 0.401, 12.03, 5.233, 1.254, 3.051, 8.626, 3.693, 5.616, 0.906, 8.833, 2.236, 12.255, 1.273, 6.913, 4.737, 0.848, 13.418, 2.337, 7.242], "order":[1,2,1], "prlen":1, "auto":0, "path":"a@gmail.com/1e79fa8e9b499f00a59225569bc698ee_yst_[1,2,1].pickle"}'
    try:
        #json_data = json.loads(json_data)
        json_data = json.load(sys.stdin)
        k = json_data["k"]
        y = json_data["y"][:k]
        x = json_data["x"][:k]
        order = json_data["order"]
        prlen = json_data["prlen"]
        auto = json_data["auto"]
        path = json_data["path"]
    except Exception as e:
        error = type(e).__name__
        tb = traceback.format_exc()
        return
    if(auto == 1):
        p_values = range(len(y) - 3, len(y) + 1)
        d_values = range(0, 2)
        q_values = range(0, 2)
        findParam(y, p_values, d_values, q_values, prlen, path)
    else:
        arima(y, order, len(y) + prlen - 1, path)


cgitb.enable()
y = x = k = prlen = auto = yhat = order = mse = llf = aic = bic = summary = error = tb = -1
info = ""
main()
result = {
    "k": k,
    "prlen": prlen,
    "auto": auto,
    "y": y,
    "x": x,
    "yhat": yhat,
    "order": order,
    "mse": mse,
    "llf": llf,
    "aic": aic,
    "bic": bic,
    "summary": summary,
    "error": error,
    "tb": tb,
    "info": info
}

print('Content-Type: application/json\n\n')
print(json.dumps(result))
