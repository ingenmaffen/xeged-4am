const express = require('express');
const app = express();
const PORT = 4200;

app.use(express.static('public'));

app.get('*', function(req, res){
    res.sendfile(__dirname + '/public/index.html');
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));