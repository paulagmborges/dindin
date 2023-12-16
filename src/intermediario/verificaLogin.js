require('dotenv').config()
const jwt = require('jsonwebtoken')
require('dotenv').config()
const pool = require('../conexao')

const verificaLogin = async (req, res, next) => {

  const { authorization } = req.headers

  const senhaSecreta = process.env.SENHAJWT

  try {
    if (!authorization) {

      return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado" });
    }

    const token = authorization.split(" ")[1]

    const { id } = jwt.verify(token, senhaSecreta)

    const usuario = await pool.query('select id, nome, email from usuarios where id = $1', [
      id,
    ])

    if (!usuario) {

      return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado" });
    }
    req.usuario = usuario.rows[0]

    next();
  } catch (error) {
    return res.status(500).json({mensagem:'Erro interno do servidor'})
  }
};
module.exports = verificaLogin