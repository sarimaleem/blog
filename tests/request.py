import requests

url = "http://127.0.0.1:3000/post"

f = open('/home/sarim/blog/tests/post.md', 'r')
text = f.read()

body = {"title" : "convert", "text" : text}
print(body)
headers = {"Content-Type" : "application/json"}

res = requests.post(url, headers=headers, json=body)

print(res)

