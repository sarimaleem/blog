# Blog:

**(IN PROGRESS)**

Current Planned Features:

* CRUD Blog Posts in markdown, options can be done from commandline
* Mark posts as public/private (So blog can be used as a personal journal)
* Comments optional
* Commandline app that makes posting/updating easier

## Schema Planning

blog schema:
_id (mongo)
title (maybe unique index? assuming one author)
raw markdown
html

later add:
author
date published
last date updated
tags
private/public

## TODO: 
* all the features above
* add basic html and css template
* move mongodb to like not a folder in this repository