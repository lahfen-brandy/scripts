# !/usr/bin/bash

# extract directory segments (good for dir brute)


cat wayback.txt \
  | sed -E 's|https?://[^/]+||' \
  | cut -d'?' -f1 \
  | sed 's|/$||' \
  | tr '/' '\n' \
  | sed '/^$/d' \
  | sort -u > dir_segments.txt

# Make a dirs-for-ffuf list with trailing slash:
sed 's|$|/|' dir_segments.txt > dirs_for_ffuf.txt
