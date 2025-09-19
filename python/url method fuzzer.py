import requests
import sys
from colorama import init, Fore, Style

# Initialize colorama for Windows and others.
init(autoreset=True)

# Disable warnings from unverified HTTPS requests
requests.packages.urllib3.disable_warnings()

def check_post(subdomain):
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        url = f"https://{subdomain}"
        response = requests.post(url, headers=headers, timeout=5, verify=False)
    except requests.exceptions.RequestException:
        try:
            url = f"http://{subdomain}"
            response = requests.post(url, headers=headers, timeout=5)
        except requests.exceptions.RequestException:
            return None

    if response.status_code < 400:
        return url
    return None

def main(filename):
    try:
        with open(filename, 'r') as f:
            subdomains = [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        print(f"{Fore.RED}File not found: {filename}")
        return

    print(f"\n[+] Checking which subdomains accept POST requests...\n")
    for subdomain in subdomains:
        result = check_post(subdomain)
        if result:
            print(f"{Fore.GREEN}[✓] {result} accepts POST")
        else:
            print(f"{Fore.RED}[✗] {subdomain} does NOT accept POST")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"{Fore.YELLOW}Usage: python {sys.argv[0]} <subdomains.txt>")
        sys.exit(1)

    main(sys.argv[1])
