import express from 'express';
import sqlite from 'sqlite3';

const database = new sqlite.Database('./db.sqlite');

database.exec(`
CREATE TABLE IF NOT EXISTS tarefas (
    id integer primary key autoincrement,
    titulo varchar(255),
    descricao varchar(255),
    feito boolean
);
`);

// criar o app
const app = express();
app.use(express.json());

// descrever o app
app.get('/', (req, res) => {
  res.json({
    mensagem: 'ok',
  });
});

// Retornando uma string
app.get('/string', (req, res) => {
  res.send('uma string aleatória');
});

// Mostrando todas tarefas
app.get('/tarefas', (req, res) => {
  database.all(
    `SELECT id, titulo, descricao, feito FROM tarefas;`,
    (err, rows) => {
      if (err != null) {
        res.json({
          mensagem: 'algo deu errado',
        });
      } else {
        res.json(rows);
      }
    }
  );
});

// Obtendo tarefa especifica
app.get('/tarefas/:tarefaId', (req, res) => {
  const id = req.params.tarefaId;
  database.get(
    `SELECT id, titulo, descricao, feito FROM tarefas WHERE id = ?;`,
    [id],
    (err, row) => {
      if (err != null) {
        res.status(500).json({
          mensagem: 'algo deu errado',
        });
      } else {
        if (row === undefined) {
          res.status(404).json({
            mensagem: 'tarefa não encontrada',
          });
        } else {
          res.status(200).json(row);
        }
      }
    }
  );
});

// Adicionando tarefa
app.post('/tarefas', (req, res) => {
  const tarefa = req.body;
  database.run(
    `INSERT INTO tarefas (titulo, descricao, feito) VALUES (?, ?, 0)`,
    [tarefa.titulo, tarefa.descricao],
    (err) => {
      if (err != null) {
        res.json({
          mensagem: 'Algo deu errado e não foi possível criar sua tarefa',
        });
      } else {
        res.status(201).json({
          mensagem: 'tarefa criada com sucesso',
        });
      }
    }
  );
});

// Alterando tarefa
app.put('/tarefas', (req, res) => {
  const tarefa = req.body;
  database.run(
    'UPDATE tarefas SET titulo = ?, descricao = ?, feito = ? WHERE id = ?',
    [tarefa.titulo, tarefa.descricao, tarefa.feito, tarefa.id],
    (err) => {
      if (err != null) {
        res.json({
          mensagem: 'Algo deu errado e não foi possível alterar essa tarefa',
        });}
      else {
        res.status(201).json({
          mensagem: 'Tarefa alterada com sucesso'
        })
      }
    }
  )
});

// Deletando tarefa
app.delete('/tarefas', (req, res) => {
  const tarefa = req.body;
  database.run(
    'DELETE FROM tarefas WHERE id = ?', 
    [tarefa.id],
    (err) => {
      if (err != null) {
        res.json({
          mensagem: 'Algo deu errado e não foi possível deletar essa tarefa',
        });}
      else {
        res.status(201).json({
          mensagem: 'Tarefa deletada com sucesso'
        })
      }
    }
  )
});

// roda o servidor
app.listen(3000, () => {
  console.log('servidor rodando na porta 3000');
});
