#!/bin/bash

for user in missy leonard rootflag; do # usernames on the target system go here
  for file in flag1.txt flag2.txt; do # search parameters or names
  
    filepath="/home/$user/$file"
    echo "[*] Trying $filepath"

      # Checks if it looks like a valid base64 before decoding
      if /usr/bin/base64 "$filepath" 2>/dev/null | base64 -d 2>/dev/null | grep -q '[[:print:]]'; then
        echo "[+] Decoded output from $filepath:"
        /usr/bin/base64 "$filepath" 2>/dev/null | base64 -d 2>/dev/null
        echo -e "\n"
      else
        echo "[-] Decoding failed or not printable content."
     echo # or use printf "\n" for a new line
  fi
  done
done
