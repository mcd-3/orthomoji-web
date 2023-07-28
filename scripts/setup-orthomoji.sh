#!/bin/sh

# NOTE: This script is OUTDATED!
#       This was a script used for testing when orthomoji-dom was not yet completed.
#       It is NOT recommended to use this script anymore as it might not work anymore.
#       Use at your own risk.

# Check if script is being executed from the scripts directory
pwd_output=$(pwd)
echo $pwd_output

if [[ $pwd_output != *orthomoji-web/scripts ]]; then
    echo "This script must be executed from the /scripts directory. Exiting..."
    exit 0
fi

# Check if orthomoji already exists. If so, delete it
if [ -d "./../orthomoji" ]; then
    rm -rf ./../orthomoji
    echo "Previous orthomoji instance removed. Installing a fresh copy..."
fi

# Clone orthomoji
echo "Cloning Orthomoji from GitHub"
mkdir ./../orthomoji
git clone https://github.com/mcd-3/orthomoji ./../orthomoji

# Replace specific files
# These changes alone should be enough to make orthomoji work on the DOM
cat ./replacements/generator.txt > ./../orthomoji/tools/generator.js
cat ./replacements/canvas.txt > ./../orthomoji/tools/canvas.js

# Delete some unnecessary files
rm ./../orthomoji/tools/image-saver.js
rm ./../orthomoji/package.json
rm ./../orthomoji/package-lock.json
rm ./../orthomoji/.gitignore

# Adding info file
echo "Creating INFO.txt file..."
info_path="./../orthomoji/INFO.txt"
touch $info_path
echo "[ORTHOMOJI]\n" >> $info_path
echo "This repository was cloned and edited by the setup-orthomoji.sh script." >> $info_path
echo "Orthomoji and this script were created by Matthew Carvalho-Dagenais." >> $info_path
echo "For more information, please see the respective licenses for this project and for orthomoji." >> $info_path