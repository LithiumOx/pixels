import requests
import json

url = "http://localhost:3000/canvas/single"
headers = {'Content-Type': 'application/json'}

pixel = {'x': 42, 'y': 42, 'data': [0, 25, 255, 255]}

response = requests.post(url, headers=headers, data=json.dumps(pixel))

if response.ok:
    print("Pixel successfully changed!")
else:
    print("Failed to change pixel:", response.status_code)