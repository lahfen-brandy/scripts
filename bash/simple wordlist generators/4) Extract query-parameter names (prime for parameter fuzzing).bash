# !/usr/bin/bash

# Extract query-parameter names (prime for parameter fuzzing)

# param names (e.g., file, id, redirect)


cat wayback.txt \
  | grep -oP '\?.*' \                      # grab query string portion
  | tr '&' '\n' \                         # split params
  | sed 's/^?//' \                        # strip leading ?
  | sed 's/=.*//' \                       # drop values
  | sed '/^$/d' \
  | sort -u > param_names.txt
