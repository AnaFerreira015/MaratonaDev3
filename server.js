// Configurando o servidor
const express = require('express')
const server = express()

// Configurar o servidor para usar arquivos estáticos
server.use(express.static('public'))

// Habilitar o body do formulário
server.use(express.urlencoded({ extended: true }))

// Configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '12345',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

// Configurando a template engine
const nunjucks = require('nunjucks')
nunjucks.configure("./", {
    express: server,
    noCache: true
})


// Configurando a apresentação da página
server.get("/", function (req, res) {
    db.query("SELECT * FROM donors", function (err, result) {
        if (err) return res.send("Erro no banco de dados")
        
        const donors = result.rows
        return res.render("index.html", { donors })
    })
})

server.post("/", function (req, res) {
    // Pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigátorios")
    }

    // Coloca valores dentro do banco de dados
    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`
    const values = [name, email, blood]

    db.query(query, values, function (err) {
        if (err) return res.send("Erro no banco de dados")

        // Fluxo ideal
        return res.redirect("/")
    })

})

server.listen(3000, function () {
    console.log("Iniciei o servidor")
})