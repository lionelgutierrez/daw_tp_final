var PORT=3000;
var express = require('express');
var app = express();
var mysql = require('./mysql');
app.use(express.json()); // para parsear application/json
app.use(express.static('.')); // para servir archivos estaticos


//EJ 12
//Se recibe parametro filter /ws/devices?filter=X
//Si no se recibe se asume que se filtra todo
//Valores posibles para filter:
// 0 para no filtrar por tipo
// 1 para filtrar el tipo “lámpara”
// 2 para filtrar el tipo “persiana”
app.get('/devices', function(req, res, next) {

    var consulta = "SELECT * FROM Devices";
    var filtro = req.query.filter;
    if (filtro == null) {
        filtro = 0;
    }
    filtro = parseInt(filtro);
    
    if (isNaN(filtro)) {
        res.send("Parametro incorrecto. El filter debe ser numerico").status(400);   
        return;
    }
    // SI el valor de filtro es > 0 filtro por tipo.
    // Dado que tipo comienza en 0 en la DB uso el valor del parametro menos 1
    // tambien se podria hacer un mapeo, pero de este modo queda mas generico si se 
    // agregan nuevos tipos
    if (filtro>0){
        filtro--;
        consulta+= " WHERE TYPE="+filtro;
    }

    mysql.query(consulta, function(err, rta, field) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(rta).status(200);
    });
});
app.get('/devices/:id', function(req, res, next) {
    mysql.query('SELECT * FROM Devices WHERE id=?', [req.params.id], function(err, rta, field) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(rta);
    });
});
app.post('/devices', function(req, res, next) {

    console.log(req.body);

    st=0;
    if(req.body.state)
        st=1;

    id = req.body.id.split("_")[1]; // viene dev_xx

    mysql.query('UPDATE Devices SET state=? WHERE id=?', [st, id], function(err, rta, field) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(JSON.stringify(req.body));
    });
});


app.listen(PORT, function(req, res) {
    console.log("API funcionando en el puerto "+PORT);
});