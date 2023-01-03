# STEP 2 of data processing

import os
import numpy as np
from matplotlib import pyplot as plt

# orbits_list = os.listdir(f'wispr_txt_data')
temp = []
NUMORBITS = 12
count_nan = 0
with open(f'sweap_data/spc_list.txt', 'w') as l:
    l.write('[')
    for n in range(1,NUMORBITS+1):
        f = open(f'sweap_data/sweap_txt_data/orbit{n}.txt','r')
        lines = f.readlines()
        l.write('[')
        for i in range(len(lines)):
            line = lines[i]
            output = "["
            rline = line.replace('\n','').split(', ')
            for p in range(len(rline)):
                j = rline[p]
                if p==3:
                    temp.append(float(j))
                if j == "nan":
                    count_nan += 1
                elif '.' in j: #converts to float if the string is a float, since only the floats contain '.'
                    output += f'{j}, '
                else:
                    output += f"'{j}', "
            output = output[:-2] # removes the last comma and space
            if i == len(lines)-1:
                output += ']\n'
            else:
                output += '],\n'
            l.write(output)
        if n==NUMORBITS:
            l.write(']]')
        else:
            l.write('],\n')
        f.close()
        print(f"Minimum Temp: {min(temp)}")
        print(f"Maximum Temp: {max(temp)}")
        print("Number of nan values: ", count_nan)
        plt.plot(np.arange(0, len(temp)), temp)
        plt.show()
