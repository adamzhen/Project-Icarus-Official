# Visualizes the fields data

import os
from matplotlib import pyplot as plt
import numpy as np

br = []
bt = []
bn = []

NUMORBITS = 12
mins = []
maxs = []

for n in range(1,NUMORBITS+1): 
  f = open(f'fields_data/fields_txt_data/fields_orbit{n}.txt','r')
  lines = f.readlines()
  for i in range(len(lines)): 
      line = lines[i]
      rline = line.replace('\n','').split(', ')
      br.append(float(rline[1]))
      bt.append(float(rline[2]))
      bn.append(float(rline[3]))
  mins.append(min(min(br), min(bt), min(bn)))
  maxs.append(max(max(br), max(bt), max(bn)))
  print(f"Orbit {n} min: {mins[n-1]}")
  print(f"Orbit {n} max: {maxs[n-1]}")
  plt.plot(np.arange(0, len(br)), br)
  plt.plot(np.arange(0, len(bt)), bt)
  plt.plot(np.arange(0, len(bn)), bn)
  plt.legend(['Br', 'Bt', 'Bn'])
  plt.title(f'Orbit {n}')
  plt.xlabel('Time (s)')
  plt.ylabel('Magnetic Field (nT)')
  plt.show()
  f.close()
  # print(f"Minimum Temp: {min(temp)}")
  # print(f"Maximum Temp: {max(temp)}")
  # print("Number of nan values: ", count_nan)
  # plt.plot(np.arange(0, len(temp)), temp)
  # plt.show()
