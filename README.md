# Slog ([S]imple B[log]):

## TODO

**(IN PROGRESS)**

- [x] HTML stored in database
- [x] Site correctly renders on get request
- [x] Pretty HTML/CSS
- [ ] Fix navbar
- [ ] Add Home Page
- [ ] Update post
- [ ] Delete post
- [ ] Command line app to easily post 
- [ ] Username/Password for requests
- [ ] Protection against XSS injections

Way in the future features

- [ ] comments

## Schema Planning

Current schema:
* _id
* title (ideally part of url)
* markdown
* html

Later add:
* author
* date published
* last date updated
* tags
* private/public