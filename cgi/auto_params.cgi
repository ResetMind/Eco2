#!C:\Users\spons\anaconda3\python.exe
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
import cgi, json, sys, cgitb

cgitb.enable()
json_data = json.load(sys.stdin)
#json_data = '{"y":[1.282, 0.958, 11.22, 0.431, 2.029, 1.699, 6.46, 0.401, 12.03, 5.233, 1.254, 3.051, 8.626, 3.693, 5.616, 0.906, 8.833, 2.236, 12.255, 1.273, 6.913, 4.737, 0.848, 13.418, 2.337, 7.242], "order":[2, 2, 2], "prlen":10}'
#json_data = json.loads(json_data)
y = json_data["y"]
order = json_data["order"]
prlen = json_data["prlen"]
yhat = -1
summary = -1
error = -1

try:
    model = ARIMA(y, order=order)
    model_fit = model.fit()
    yhat = model_fit.predict(0, len(y) + prlen - 1).tolist()
    summary = model_fit.summary().as_html()
except Exception as e:
    error = str(e)

result = {
    "y": y,
    "order": order,
    "prlen": prlen,
    "yhat": yhat,
    "summary": summary,
    "error": error
    }
print('Content-Type: application/json\n\n')
print(json.dumps(result))
