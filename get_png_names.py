# This code was run in order to extract the file names of the WISPR PNGs into txt files that are more easily read in JavaScript

import os

# orbits_list = os.listdir(f'WISPR_PNGs/')
# for orbit in orbits_list:
#     file_list = os.listdir(f'WISPR_PNGs/{orbit}')
#     with open(f'PNG_locations/{orbit}.txt', 'w') as f:
#         for file in file_list:
#             if file.endswith(".png"):
#                 f.write(file+'\n')

orbits_list = os.listdir(f'WISPR_PNGs/')
for orbit in orbits_list:
    file_list = os.listdir(f'WISPR_PNGs/{orbit}')
    with open(f'PNG_lists/{orbit}.txt', 'w') as f:
        for file in file_list:
            if file.endswith(".png"):
                f.write(f"'{file}',\n")