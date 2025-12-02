from turtle import *
from time import gmtime, strftime
import os

def save(directory="./", suffix=""):
    if not os.path.exists(directory):
        os.makedirs(directory)
    
    ts = getscreen()
    ts.update()  # s'assure que le dessin est complet
    filename = "{}{}.eps".format(strftime("%Y-%m-%d_%H-%M-%S", gmtime()),f"_{suffix}" if suffix else "")
    ts.getcanvas().postscript(file=os.path.join(directory, filename))
