from SA.tools.pre_load_data import pre_load_data as sa_pre
from GA.tools.pre_load_data import pre_load_data as ga_pre
from os.path import join

sa_pre(join("SA", "tools", "Data"))
ga_pre(join("GA", "tools", "Data"))