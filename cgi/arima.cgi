#!C:\Users\spons\anaconda3\python.exe
import numpy as np
from statsmodels.tsa.arima.model import ARIMA, ARIMAResults
import cgi
import json
import sys
import cgitb
import os


def findParam(y, p_values, d_values, q_values, prlen, path):
    best_score, best_cfg = -float("inf"), None
    info = ""
    for p in p_values:
        for d in d_values:
            for q in q_values:
                arima_order = [p, d, q]
                path_order = path.split("[")[1].split("]")[0]
                path = path.replace("[" + path_order + "]",
                                    str(arima_order).replace(" ", ""))
                try:
                    result = arima(y, arima_order, len(y), path)
                    if(result["error"] != -1):
                        return {
                            "error": result["error"]
                        }
                    llf = result["llf"]
                    if llf > best_score:
                        best_score, best_cfg = llf, arima_order
                    info = info + ('ARIMA%s LLF=%.3f \n' % (arima_order, llf))
                except:
                    return {
                        "error": 1
                    }
    info = info + ('Best ARIMA%s LLF=%.3f' % (best_cfg, best_score))
    path_order = path.split("[")[1].split("]")[0]
    path = path.replace("[" + path_order + "]", str(best_cfg).replace(" ", ""))
    return arima(y, best_cfg, len(y) + prlen - 1, path)


def arima(y, arima_order, prlen, path):
    yhat = mse = llf = aic = bic = summary = error = -1
    model_fit = getSavedModel(path)["model_fit"]
    if(model_fit == None):
        try:
            model = ARIMA(y, order=arima_order)
            model_fit = model.fit()
            folder_name = path.split("/")[0]
            os.makedirs(folder_name, exist_ok=True)
            model_fit.save(path)
        except Exception as e:
            error = error + str(e) + "\n"
    try:
        yhat = model_fit.predict(0, prlen).tolist()
        mse = model_fit.mse
        llf = model_fit.llf
        aic = model_fit.aic
        bic = model_fit.bic
        summary = model_fit.summary().as_html()
    except Exception as e:
        error = error + str(e) + "\n"
    return {
        "y": y,
        "yhat": yhat,
        "order": arima_order,
        "mse": mse,
        "llf": llf,
        "aic": aic,
        "bic": bic,
        "summary": summary,
        "error": error
    }


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


cgitb.enable()
json_data = json.load(sys.stdin)
#json_data = '{"y":[1.282, 0.958, 11.22, 0.431, 2.029, 1.699, 6.46, 0.401, 12.03, 5.233, 1.254, 3.051, 8.626, 3.693, 5.616, 0.906, 8.833, 2.236, 12.255, 1.273, 6.913, 4.737, 0.848, 13.418, 2.337, 7.242], "order":[26, 2, 1], "prlen":20, "auto":1, "path":"a@gmail.com/1e79fa8e9b499f00a59225569bc698ee_yst_[26,2,1].pickle"}'
#json_data = json.loads(json_data)
y = json_data["y"]
order = json_data["order"]
prlen = json_data["prlen"]
auto = json_data["auto"]
path = json_data["path"]
yhat = mse = llf = aic = bic = summary = info = error = -1

if(auto == 1):
    p_values = range(len(y) - 4, len(y) + 1)
    d_values = range(0, 2)
    q_values = range(0, 2)
    result = findParam(y, p_values, d_values, q_values, prlen, path)
else:
    result = arima(y, order, len(y) + prlen - 1, path)

print('Content-Type: application/json\n\n')
print(json.dumps(result))
