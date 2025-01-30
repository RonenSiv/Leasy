# print_path.py

import sys

def print_path():
    # Check if the user passed a path as a command-line argument
    if len(sys.argv) < 2:
        print("Please provide a path.")
        return
    
    path = sys.argv[1]
    return 'ok'

if __name__ == "__main__":
    result = print_path()
    if result:
        print(result, end='')  
