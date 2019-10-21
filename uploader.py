"""
Python script for uploading a file to AWS S3 using a pre-signed URL
"""

import requests

# Pre-signed URL from uploadObject mutation goes here
url = ""

# Path to file to be uploaded
filename = "media/S3.png"

with open(filename, 'rb') as f:
    files = {'file': (filename, f)}
    http_response = requests.put(url, files=files, headers={"content-type": "application/octet-stream"})
    print(http_response)
    print(http_response.text)

