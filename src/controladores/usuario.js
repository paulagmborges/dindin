require('dotenv').config()
const bcrypt = require('bcrypt')
const pool = require('../conexao')

const cadastrarUsuario = async (req, res) => {

  const { nome, email, senha } = req.body

  try {

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Envie todos os dados' })
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const emailExiste = await pool.query(
      'select * from usuarios where email =$1',
      [email]
    )
    if (emailExiste.rowCount > 0) {
      return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o email informado' })
    }

    const novoUsario = await pool.query(
      'insert into usuarios (nome, email, senha) values($1, $2, $3) returning*',
      [nome, email, senhaCriptografada]
    )

    return res.status(201).json(novoUsario.rows[0])

  } catch (error) {
    return res.status(500).json(error.message)
  }
};

const detalharUsuario = async (req, res) => {
  const { id } = req.usuario;

  try {

    const obterUsuario = await pool.query(
      'select * from usuarios where id = $1 ',
      [id]
    );

    if (obterUsuario < 1) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' })
    }

    return res.status(200).json(obterUsuario.rows[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor' })
  }
}
const atualizarUsuario = async (req, res) => {

  const { id } = req.usuario;
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' })
  }

  try {

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    const buscarUsuario = await pool.query(
      'select * from usuarios where id = $1',
      [id]
    );

    if (buscarUsuario < 1) {
      return res.status(404).json({ mensagem: 'Usuario não encontrado' });
    }

    const usuarioAtualizado = await pool.query(
      'update usuarios set nome = $1, email = $2, senha = $3 where id = $4',
      [nome, email, senhaCriptografada, id]
    );

    return res.status(200).send(usuarioAtualizado.rows[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

module.exports = {
  cadastrarUsuario,
  detalharUsuario,
  atualizarUsuario,
}