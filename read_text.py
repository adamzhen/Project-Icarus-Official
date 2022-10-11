import os

def format_orbit(orbit):
    o = int(orbit)
    if o<10:
        return 'orbit'+'0'+str(o)
    else:
        return 'orbit'+str(o)
# orbits_list = os.listdir(f'wispr_txt_data')

orbit = format_orbit(11) # set orbit number
f = open(f'wispr_txt_data/{orbit}.txt','r')
lines = f.readlines()
arr = []
for line in lines:
    row = []
    rline = line.replace('\n','').split(',')
    for j in rline:
        row.append(j)
    arr.append(row)
print(arr)



