var express = require('express');
var mysql = require('mysql');
var bodyparser = require('body-parser');
var cors = require('cors');
var app = express();
app.use(cors());
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.listen(3300,()=>console.log("node app is running on port 3300."));

var connection = mysql.createConnection({
    host:'localhost',
    port:"3306",
    user:'root',
    password:'m@terna:Pr0',
    database:'maternapro'
})

//inseerting api
app.post('/insertcontacts',function(req,res)
{
    console.log("/insertcontacts");
    console.log(req.body.data);

    var data = JSON.parse(req.body.data);
    var nome = data.nome;
    var nomePreferido = data.nomePreferido;
    var cpf = data.cpf;
    var dataNascimento = data.dataNascimento;
    var telefone = data.telefone;
    var email = data.email;
    var estahGravida = data.estahGravida;
    var dataUltimaMenstruacao = data.dataUltimaMenstruacao;
    var telefoneEmergencia = data.telefoneEmergencia;
    var aceite = data.aceite;
    console.log("Conectando...");
    connection.connect(function(err)
    {
        if (err) throw err;
        console.log("conectado!");
        var query = "insert into contact (name, nomePreferido, cpf, dataNascimento, telefone, email, estahGravida, dataUltimaMenstruacao, telefoneEmergencia, aceite) values ('"+nome+"','"+nomePreferido+"','"+cpf+"','"+dataNascimento+"','"+telefone+"','"+email+"','"+estahGravida+"','"+dataUltimaMenstruacao+"','"+telefoneEmergencia+"','"+aceite+"')";
        console.log(query);
        
        connection.query(query,function(err,result,field)
        {
            if(err)
            {
                res.end(JSON.stringify(err));
            }
            else
            {
                if(result.affectedRows > 0)
                {
                    res.end("successfully inserted.")
                }
                else{
                    res.end("please try again.")
                }
            }
        })
    })
})