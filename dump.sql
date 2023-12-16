create database dindin;

create table usuarios (
    id serial primary key,
    nome text not null,
    email text UNIQUE,
    senha text not null
);

create table categorias (
    id serial primary key,
    descricao text not null
);

create table transacoes (
    id serial primary key,
    descricao text,
    valor integer ,
    data DATE,
    categoria_id integer references categorias(id),
    usuario_id integer references usuarios(id),
    tipo text not null
);

INSERT INTO categorias (descricao) VALUES
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');