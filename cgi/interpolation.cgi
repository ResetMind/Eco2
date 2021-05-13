#!C:\Users\spons\anaconda3\python.exe
import numpy as np
from scipy.interpolate import interp1d
import cgi
import json
import sys
import cgitb
import os
import traceback


def main():
    global x, y, x_new, y_new, step, t, result, error, tb
    #json_data = '{"x":[1980,1981,1982,1983,1984,1985,1986,1987,1990,1991], "y":[429,470,379,375,367,502,374,575,348,398], "step":"0.5", "type":"spline"}'
    try:
        #json_data = json.loads(json_data)
        json_data = json.load(sys.stdin)
        x = json_data["x"]
        y = json_data["y"]
        step = float(json_data["step"])
        t = json_data["type"]
    except Exception as e:
        error = type(e).__name__
        tb = traceback.format_exc()
        return
    try:
        x_new = np.arange(x[0], x[-1] + step, step).tolist()
        if(t == "linear"):
            f = interp1d(x, y)
        elif(t == "spline"):
            f = interp1d(x, y, kind="cubic")
        y_new = f(x_new).tolist()
    except Exception as e:
        error = type(e).__name__
        tb = traceback.format_exc()
        return


cgitb.enable()
x = y = x_new = y_new = step = t = result = tb = error = -1
main()
result = {"x": x, "y": y, "x_new": x_new,
          "y_new": y_new, "error": error, "tb": tb}

print('Content-Type: application/json\n\n')
print(json.dumps(result))
