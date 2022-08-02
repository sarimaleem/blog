console.log("this script get's called so at least there's that");

fetch("/post/all")
    .then((response) => response.json())
    .then((data) => console.log(data))
