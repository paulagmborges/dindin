const pool = require('../conexao')

const listarCategorias = async (req, res) => {
    
    try{

    const categorias = await pool.query('select * from categorias')
    
        return res.status(200).json(categorias.rows)
    
    }catch{ 
        return res.status(500).json(message.error)
        }
    }
   
module.exports = {
    listarCategorias,    
}