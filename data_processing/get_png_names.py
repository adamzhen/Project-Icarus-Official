# This code was run in order to extract the file names of the WISPR PNGs into txt files that are more easily read in JavaScript
# The WISPR PNGs took up too much space to upload to github, so I had to extract the names from the files, then delete the files
import os

# Taking the PNGs file names and formatting them into a list that can be copied and pasted into a JavaScript file (wispr_display.js)
orbits_list = os.listdir(f'WISPR_PNGs/') 
for orbit in orbits_list:
    file_list = os.listdir(f'WISPR_PNGs/{orbit}')
    with open(f'wispr_data/PNG_lists/{orbit}.txt', 'w') as f:
        for file in file_list:
            if file.endswith(".png"):
                f.write(f"'{file}',\n")