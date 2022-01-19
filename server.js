const express = require('express');
const app = express();

app.use(express.static(__dirname + '/www'));

app.get('/*', function(req, res) {
    res.sendFile('index.html', {root: 'dist/nsfw-webapp'});
});

app.listen(process.env.PORT || 8080);

console.log('app started on port', process.env.PORT || 8080)