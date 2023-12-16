const express = require('express')
const rotas = express()

const {
    cadastrarUsuario,
    login,
    detalharUsuario,
    atualizarUsuario
} = require('./controladores/usuario')

const { listarTransacoes, detalharTransacao, cadastrarTransacao, atualizarTransacao, excluirTransacao, obterExtrato  } = require("./controladores/transacao");

const verificaLogin = require('./intermediario/verificaLogin')

const {listarCategorias} = require('./controladores/categorias')


rotas.post('/usuario',cadastrarUsuario)
rotas.post('/login',login)
rotas.get('/categorias',listarCategorias)


rotas.use(verificaLogin)
rotas.get('/usuario', detalharUsuario)
rotas.put('/usuario', atualizarUsuario)
  
rotas.get('/transacao', listarTransacoes)
rotas.get('/transacao/extrato', obterExtrato)
rotas.get('/transacao/:id', detalharTransacao)
rotas.post('/transacao', cadastrarTransacao)
rotas.put('/transacao/:id', atualizarTransacao)
rotas.delete('/transacao/:id', excluirTransacao)

module.exports = rotas