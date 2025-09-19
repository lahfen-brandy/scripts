# FROM ROOM OWNERS MEDIUM PAGE <<<<< I ADDED THIS LINE TO THE SCRIPT.

import socket
# Define the server's address and port
server_address = ('192.168.80.128', 8000) # Replace with your server's address and port

def send_word(word):
  # Create a socket object
  client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  try:
    # Connect to the server
    client_socket.connect(server_address)
    # Send the word to the server
    client_socket.sendall(word.encode())
    # Receive data from the server (if applicable)
    response = client_socket.recv(1024)
    response = response.decode()
    if not word in response:
      print(f"Sent: {word} | Received: {response}")
  except ConnectionRefusedError:
    print("Connection was refused. Is the server running?")
  finally:
    # Close the socket connection
    client_socket.close()

def read_wordlist_from_file(filename):
  with open(filename, 'r') as file:
    wordlist = file.readlines()
  return [word.strip() for word in wordlist]

# Path to the wordlist file
wordlist_filename = 'wordlist.txt'
# Read words from the file
words = read_wordlist_from_file(wordlist_filename)
# Iterate through the words and send each one to the server
for word in words:
  send_word(word)
