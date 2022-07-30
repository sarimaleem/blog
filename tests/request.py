import requests



f = open('/home/sarim/slog/tests/post.md', 'r')
title = "first"
text = f.read()
url = "http://127.0.0.1:3000/post" + "/" + title

body = {"text" : text, "tags" : ["random"], "visibility" : "PUBLIC"}
# print(body)
headers = {"Content-Type" : "application/json"}

res = requests.post(url, headers=headers, json=body)

print(res.status_code)
print(res.text)

