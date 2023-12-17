require('dotenv').config()
const bcrypt = require('bcrypt')
const pool = require('../conexao')
const jwt = require('jsonwebtoken')


const login = async (req, res) => {

    const { email, senha } = req.body;
  
    try {
      if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
      }
  
      const buscarUsuario = await pool.query(
        'select * from usuarios where email = $1',
        [email]
      )
  
      if (!buscarUsuario.rowCount) {
        return res.status(400).json({ messagem: 'Email e senha inválido' });
      }
  
      const senhaValida = await bcrypt.compare(senha, buscarUsuario.rows[0].senha);
  
      if (!senhaValida) {
        return res.status(401).json({ menssagem: 'Email e senha invalido' })
      }
  
      const { senha: _, ...usuarioLogado } = buscarUsuario.rows[0];
  
      const token = jwt.sign({ id: usuarioLogado.id }, process.env.JWT_SENHA , { expiresIn: '8h' })
  
      return res.status(200).json({ usuario: usuarioLogado, token, })
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

module.exports = { login } 