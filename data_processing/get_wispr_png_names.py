# STEP 3 of WISPR data processing

# This code was run in order to extract the file names of the WISPR PNGs into txt files that are more easily read in JavaScript
# The WISPR PNGs took up too much space to upload to github, so I had to extract the names from the files, then delete the files
import os

# Taking the PNGs file names and formatting them into text files for each orbit
orbits_list = os.listdir(f'public/WISPR_PNGs/') 
for orbit in orbits_list:
    file_list = os.listdir(f'public/WISPR_PNGs/{orbit}')
    with open(f'wispr_data/PNG_lists/{orbit}.txt', 'w') as f:
        for file in file_list:
            if file.endswith(".png"):
                f.write(f"'{file}',\n")

# Taking the text files in PNG_lists and compiling them into a single list that can be copied and pasted into a JavaScript file (wispr_display.js)
text_files = os.listdir(f'wispr_data/PNG_lists/') 
print(text_files)
fi = open(f'wispr_data/all-inner-pngs.txt', 'w')
fo = open(f'wispr_data/all-outer-pngs.txt', 'w')
fi.write("var allInnerPNGs = [")
fo.write("var allOuterPNGs = [")
for file in text_files:
    isInner = "inner" in file
    with open(f'wispr_data/PNG_lists/{file}', 'r') as f:
        text = f.readlines()
        for i in range(len(text)):
            row = text[i][:-1]
            if isInner:
                if i==0:
                    fi.write(f"[")
                if i==len(text)-1:
                    fi.write(f"{row[:-1]}]")
                    if file != text_files[-1] and file != text_files[-2]:
                        fi.write(f",")
                    fi.write(f"\n")
                else:
                    fi.write(f"{row}\n")
            else:
                if i==0:
                    fo.write(f"[")
                if i==len(text)-1:
                    fo.write(f"{row[:-1]}]")
                    if file != text_files[-1] and file != text_files[-2]:
                        fo.write(f",")
                    fo.write(f"\n")
                else:
                    fo.write(f"{row}\n")
fi.write("];")
fo.write("];")
fi.close()
fo.close()