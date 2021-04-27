#!C:\Users\spons\anaconda3\python.exe
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
import cgi
import json
import sys
import cgitb


def findParam(y, p_values, d_values, q_values, prlen):
    best_score, best_cfg = -float("inf"), None
    info = ""
    for p in p_values:
        for d in d_values:
            for q in q_values:
                arima_order = [p, d, q]
                try:
                    result = arima(y, arima_order, len(y), "")
                    if(result["error"] != -1):
                        return {
                            "error": result["error"]
                        }
                    llf = result["llf"]
                    if llf > best_score:
                        best_score, best_cfg = llf, arima_order
                    info = info + ('ARIMA%s LLF=%.3f\n'%(arima_order, llf))
                except:
                    return {
                        "error":1
                    }
    return arima(y, best_cfg, len(y) + prlen - 1, info)


def arima(y, arima_order, prlen, info):
    yhat = mse = llf = aic = bic = summary = error = -1
    try:
        model = ARIMA(y, order=arima_order)
        model_fit = model.fit()
        yhat = model_fit.predict(0, prlen).tolist()
        mse = model_fit.mse
        llf = model_fit.llf
        aic = model_fit.aic
        bic = model_fit.bic
        summary = model_fit.summary().as_html()
    except Exception as e:
        error = str(e)
    return {
        "yhat": yhat,
        "order": arima_order,
        "mse": mse,
        "llf": llf,
        "aic": aic,
        "bic": bic,
        "summary": summary,
        "info":info,
        "error": error
    }


cgitb.enable()
#json_data = json.load(sys.stdin)
json_data = '{"y":[1.282, 0.958, 11.22, 0.431, 2.029, 1.699, 6.46, 0.401, 12.03, 5.233, 1.254, 3.051, 8.626, 3.693, 5.616, 0.906, 8.833, 2.236, 12.255, 1.273, 6.913, 4.737, 0.848, 13.418, 2.337, 7.242], "order":[2, 2, 2], "prlen":10, "auto":1}'
json_data = json.loads(json_data)
y = json_data["y"]
order = json_data["order"]
prlen = json_data["prlen"]
auto = json_data["auto"]
yhat = mse = llf = aic = bic = summary = info = error = -1

if(auto == 1):
    p_values = range(len(y) - 4, len(y) + 1)
    d_values = range(0, 2)
    q_values = range(0, 2)
    result = findParam(y, p_values, d_values, q_values, prlen)
else:
    result = arima(y, order, len(y) + prlen - 1, "")

print('Content-Type: application/json\n\n')
print(json.dumps(result))
