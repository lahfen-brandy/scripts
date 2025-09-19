# !/usr/bin/bash

# produces filenames like index.php, report.pdf, old-report.zip

# extract filenames (last path segment)


cat wayback.txt \
  | sed -E 's|https?://[^/]+||' \         # remove scheme+host
  | cut -d'?' -f1 \                      # drop query string
  | awk -F/ '{print $NF}' \              # last part after last /
  | sed '/^$/d' \                        # remove empty
  | sort -u > filenames.txt
