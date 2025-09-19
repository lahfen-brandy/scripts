# !/usr/bin/bash

# get full path patterns (useful for dirsearch)

cat wayback.txt \
  | sed -E 's|https?://[^/]+||' \
  | cut -d'?' -f1 \
  | sed '/^$/d' \
  | sort -u > paths.txt
