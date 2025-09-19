#Extract param values (useful to test known filenames or IDs)

# A simple (but effective) awk/python approach to collect all values

# Extract param values (useful to test known filenames or IDs)

# this is the 5th script in the simple
# wordlist generator, all were written
# in bash, except this

from urllib.parse import urlparse, parse_qs
import sys

values = set()

for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    try:
        query = urlparse(line).query
        for key, val_list in parse_qs(query).items():
            for val in val_list:
                if val:
                    values.add(val)
    except Exception:
        pass

for val in sorted(values):
    print(val)
