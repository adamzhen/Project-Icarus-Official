# STEP 1 of WISPR data processing

# This code was run on a computer with wget installed, producing the text files that were to be used for data display on the website
import math
import sys
import subprocess
from astropy.io import fits
import os

print("running!!")
NUMORBITS = 15

#
#sets up wget
def runcmd(cmd, verbose = False, *args, **kwargs):
    process = subprocess.Popen(
        cmd,
        stdout = subprocess.PIPE, 
        stderr = subprocess.PIPE,
        text = True, 
        shell = True
    )
    std_out, std_err = process.communicate()
    if verbose:
        print(std_out.strip(), std_err)
    pass

#obtains FITS files by date
date = "20210429"
orbit = "orbit08"
runcmd("wget -nc -r -l=2 --no-parent --accept fits https://wispr.nrl.navy.mil/data/rel/fits/L3/orbit15/", verbose=True)


#creates list of FITS files in certain date
#extracts HAE coordinates from the FITS files
m_in_au = 149597870700 #conversion factor obtained from https://cneos.jpl.nasa.gov/glossary/au.html

for i in range(15, NUMORBITS+1):
    if i<10:
        orbit = 'orbit'+'0'+str(i)
    else:
        orbit = 'orbit'+str(i)
    with open(f'wispr_data/wispr_txt_data/{orbit}.txt', 'w') as f:
        dates_list = os.listdir(f'wispr.nrl.navy.mil\\data\\rel\\fits\\L3\\{orbit}')
        for datey in dates_list:
            fits_list = os.listdir(f'wispr.nrl.navy.mil\\data\\rel\\fits\\L3\\{orbit}\\{datey}')
            for fitsy in fits_list:
                testfits = fits.open(f'wispr.nrl.navy.mil\\data\\rel\\fits\\L3\\{orbit}\\{datey}\\{fitsy}')
                x = testfits[0].header['HAEX_OBS']
                y = testfits[0].header['HAEY_OBS']
                z = testfits[0].header['HAEZ_OBS']
                ttime = testfits[0].header['DATE-AVG'][:16]
                yr = ttime[:4]
                mth = ttime[5:7]
                day = ttime[8:10]
                T = int(ttime.index('T'))
                time = ttime[T+1:T+6]
                ddate = f'{mth}/{day}/{yr}'
                pngtime = yr+mth+day+'_'+time[:2]+time[3:]
                dist = math.sqrt((x/m_in_au)**2 + (y/m_in_au)**2 + (z/m_in_au)**2)
                f.write(f'{pngtime}, {ddate}, {time}, {x}, {y}, {z}, {dist}\n')
