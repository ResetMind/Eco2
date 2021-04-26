#!C:\Users\spons\anaconda3\python.exe
import sys
import cgitb; cgitb.enable()
import json
import cgi
from statsmodels.tsa.arima.model import ARIMA

myjson = json.load(sys.stdin)
print(myjson)
# Do something with 'myjson' object

result = {"success":"3"}
print('Content-Type: application/json\n\n')
print(json.dumps(result))