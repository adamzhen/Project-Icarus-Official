# STEP 2 of data processing

import os

def format_orbit(orbit):
    o = int(orbit)
    if o<10:
        return 'orbit'+'0'+str(o)
    else:
        return 'orbit'+str(o)
# orbits_list = os.listdir(f'wispr_txt_data')
arr = []
NUMORBITS = 12
with open(f'wispr_data/fits_lists.txt', 'w') as l:
    l.write('[')
    for n in range(1,NUMORBITS+1):
        orbit = format_orbit(n) # set orbit number
        f = open(f'wispr_data/wispr_txt_data/{orbit}.txt','r')
        lines = f.readlines()
        l.write('[')
        for i in range(len(lines)):
            line = lines[i]
            output = "["
            rline = line.replace('\n','').split(', ')
            dist = float(rline[-1])
            if dist<=0.25:
                for j in rline:
                    if '.' in j: #converts to float if the string is a float, since only the floats contain '.'
                        output += f'{j}, '
                    else:
                        output += f"'{j}', "
                output = output[:-2] # removes the last comma and space
                if i == len(lines)-1 or float((lines[i+1].replace('\n','').split(', '))[-1])>0.25:
                    output += ']\n'
                else:
                    output += '],\n'
                l.write(output)
        if n==NUMORBITS:
            l.write(']]')
        else:
            l.write('],\n')
        f.close()



