# STEP 2 of FIELDS data processing

import os
from math import sqrt 

arr = []
NUMORBITS = 12

def psd_to_v(psd, srate): # converts 10^-12 PSD (V^2/Hz) to millivolts using a sampling rate of srate (18,750 Hz for DC & 150,000 Hz for AC))
    return sqrt(psd*10**(-12) * srate) * 10**3

with open(f'fields_data/fields_list.js', 'w') as l:
    l.write(f'var fieldsList = [')
    for n in range(1,NUMORBITS+1): 
        f = open(f'fields_data/fields_txt_data/fields_orbit{n}.txt','r')
        lines = f.readlines()
        l.write('[')
        for i in range(len(lines)): 
            line = lines[i]
            output = "["
            rline = line.replace('\n','').split(', ')
            for p in range(4): # date and magentic field data
                j = rline[p]
                if '.' in j: #converts to float if the string is a float, since only the floats contain '.'
                  if float(j) < 5:
                    output += f'{float(j):.1f}, ' # add :.0f for spane to reduce the number of decimal places
                  else:
                    output += f'{float(j):.0f}, '
                else:
                    output += f"'{j}', "
            for p in range(4, len(rline), 2): # gets electric field data and sums every 2 data points (in order to decrease file size)
                if p < 58: # DC
                    k = psd_to_v(float(rline[p]) + float(rline[p+1]), 18750) # sums the 2 data points and converts to volts
                else: # AC
                    k = psd_to_v(float(rline[p]) + float(rline[p+1]), 150000) # sums the 2 data points and converts to volts
                if k < 5:
                    output += f'{k:.2f}, ' # add :.0f for spane to reduce the number of decimal places
                else:
                    output += f'{k:.0f}, '
            output = output[:-2] # removes the last comma and space
            if i == len(lines)-1:
                output += ']\n'
            else:
                output += '],\n'
            l.write(output)
        if n==NUMORBITS:
            l.write(']];')
        else:
            l.write('],\n')
        f.close()
        # print(f"Minimum Temp: {min(temp)}")
        # print(f"Maximum Temp: {max(temp)}")
        # print("Number of nan values: ", count_nan)
        # plt.plot(np.arange(0, len(temp)), temp)
        # plt.show()