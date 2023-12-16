const pool = require('../conexao')

const listarTransacoes = async (req, res) => {
    const { id } = req.usuario;

    try {
        const { rows: transacoes } = await pool.query('SELECT *, categorias.descricao AS categoria_nome FROM transacoes JOIN categorias ON transacoes.categoria_id = categorias.id WHERE transacoes.usuario_id = $1', [id])

        return res.json(transacoes)

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })

    }
}

const detalharTransacao = async (req, res) => {
    const { id } = req.params;

    try {
        const { rows: transacao } = await pool.query('select *, categorias.descricao AS categoria_nome from transacoes JOIN categorias ON transacoes.categoria_id = categorias.id WHERE transacoes.id = $1 and transacoes.usuario_id = $2', [id, req.usuario.id]);

        if (transacao.length === 0) {
            return res.status(404).json({ mensagem: 'Transação não encontrada' })
        }

        return res.status(200).json(transacao)


    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }


}
const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body

    try {

        if (!descricao || !valor || !data || !categoria_id || !tipo) {
            return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." })
        }

        if (tipo !== 'entrada' && tipo !== 'saida') {
            return res.status(400).json({ mensagem: "O campo 'tipo' deve ser 'entrada' ou 'saida'." })
        }

        const categoria = await pool.query('select * FROM categorias WHERE id = $1', [categoria_id])

        if (categoria.rows.length === 0) {
            return res.status(404).json({ mensagem: "Categoria não encontrada." })
        }

        const novaTransacao = await pool.query('insert into transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [descricao, valor, data, categoria_id, req.usuario.id, tipo])

        return res.status(201).json(novaTransacao.rows[0])

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }

}
const atualizarTransacao = async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body

    try {

        if (!descricao || !valor || !data || !categoria_id || !tipo) {
            return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." })
        }

        const transacao = await pool.query('select * FROM transacoes WHERE id = $1 and usuario_id = $2', [id, req.usuario.id])

        if (transacao.rows.length === 0) {
            return res.status(404).json({ mensagem: "Transação não encontrada." })
        }

        const categoria = await pool.query('select * FROM categorias WHERE id = $1', [categoria_id])

        if (categoria.rows.length === 0) {
            return res.status(400).json({ mensagem: "Categoria não encontrada." });
        }

        if (tipo !== 'entrada' && tipo !== 'saida') {
            return res.status(400).json({ mensagem: "O campo 'tipo' deve ser 'entrada' ou 'saida'." })
        }

        const transacaoAtualizada = await pool.query(
            'UPDATE transacoes SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 WHERE id = $6',
            [descricao, valor, data, categoria_id, tipo, id]
        );

        res.status(204).send()

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })

    }
}
const excluirTransacao = async (req, res) => {

    const { id } = req.params

    try {

        const transacao = await pool.query('select * FROM transacoes WHERE id = $1 and usuario_id = $2', [id, req.usuario.id])

        if (transacao.rows.length === 0) {
            return res.status(404).json({ mensagem: "Transação não encontrada." })
        }

        const transacaoExcluida = await pool.query('DELETE FROM transacoes WHERE id = $1 AND usuario_id = $2', [id, req.usuario.id])

        return res.status(204).send()

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const obterExtrato = async (req, res) => {
    const usuarioId = req.usuario.id;

    try {
        const somaEntrada = await pool.query(
            'SELECT SUM(valor) FROM transacoes WHERE usuario_id = $1 AND tipo = $2', [usuarioId, 'entrada'])

        const somaSaida = await pool.query(
            'SELECT SUM(valor) FROM transacoes WHERE usuario_id = $1 AND tipo = $2', [usuarioId, 'saida'])

        const entradaTotal = somaEntrada.rows[0].sum || 0;
        const saidaTotal = somaSaida.rows[0].sum || 0;

        res.status(200).json({
            entrada: entradaTotal,
            saida: saidaTotal
        });


    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}
module.exports = {
    listarTransacoes,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    excluirTransacao,
    obterExtrato,
 
}