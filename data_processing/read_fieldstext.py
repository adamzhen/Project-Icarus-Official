# STEP 2 of FIELDS data processing

import os

arr = []
NUMORBITS = 12

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
            for p in range(len(rline)):
                j = rline[p]
                if '.' in j: #converts to float if the string is a float, since only the floats contain '.'
                  if float(j) < 5:
                    output += f'{float(j):.1f}, ' # add :.0f for spane to reduce the number of decimal places
                  else:
                    output += f'{float(j):.0f}, '
                else:
                    output += f"'{j}', "
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