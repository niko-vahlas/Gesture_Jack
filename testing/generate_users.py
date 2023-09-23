import csv

# Define the character set to iterate over
charset = "abcdefghijklmnopqrstuvwxyz"

filename = "users.csv"

# Open a new CSV file for writing
with open(filename, 'w', newline='') as csvfile:
    fieldnames = ['username', 'password', 'balance']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    # Write the header row
    writer.writeheader()

    # Use nested loops to generate usernames and passwords
    for char1 in charset:
        for char2 in charset:
            for char3 in charset:
                for char4 in charset:
                    user = f"{char1}{char1}{char2}{char3}{char4}"
                    writer.writerow({'username': user, 'password': user, 'balance': '100'})

print(f"Users written to {filename}")
