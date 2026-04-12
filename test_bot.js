const prompt = "hello";
fetch('https://text.pollinations.ai/' + encodeURIComponent(prompt))
.then(res => res.text())
.then(console.log)
.catch(console.error);
