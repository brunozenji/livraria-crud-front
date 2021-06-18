import './App.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';

function App() {

  const [livroTitulo, setLivroTitulo] = useState('');
  const [livroAutor, setLivroAutor] = useState('');
  const [livroLista, setLivroLista] = useState([]);
  const [livroNovoTitulo, setLivroNovoTitulo] = useState('');
  const [livroNovoAutor, setLivroNovoAutor] = useState('');

  useEffect(() => {
    consultaLista()
  }, []);


  const consultaLista = () => {
    axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
    axios
      .get("http://localhost:8081/livros")
      .then((res) => {
        setLivroLista(res.data.data);
      })
      .catch(() => {
        console.error('Erro ao tentar consultar a lista de livros cadastrados.');
        alert('Erro ao tentar consultar a lista de livros cadastrados.');
        setLivroLista([]);
      })
  }

  const novoLivro = () => {
    axios
      .post('http://localhost:8081/livros', {
        titulo: livroTitulo,
        autor: livroAutor
      })
      .then((res) => {
        let livros = livroLista;
        let result = res.data;

        livros.push(result);
        setLivroLista(livros);
      })
      .catch(() => {
        console.error('Erro ao tentar cadastrar um novo livro.');
        alert('Erro ao tentar cadastrar um novo livro.');
      })
      .finally(() => {
        setLivroTitulo('');
        setLivroAutor('');
      })
  }

  const apagaLivro = (id) => {
    axios
      .delete(`http://localhost:8081/livros/${id}`)
      .then(() => {
        console.log(`livro ${id} apagado`);
        consultaLista();
      })
      .catch(() => {
        console.error('Erro ao tentar excluir o Livro.');
        alert('Erro ao tentar excluir o Livro.');
      })
  }

  const atualizaLivro = (id) => {
    axios
      .put(`http://localhost:8081/livros/${id}`, {
        titulo: livroNovoTitulo ? livroNovoTitulo : livroTitulo,
        autor: livroNovoAutor ? livroNovoAutor: livroAutor
      })
      .then(() => {
        console.log(`livro ${id} atualizado`);
        consultaLista();
      })
      .catch(() => {
        console.log('Erro ao tentar atualizar os dados do livro.');
        alert('Erro ao tentar atualizar os dados do livro.');
      });
      setLivroNovoTitulo("");
      setLivroNovoAutor("");
  }

  return (
    <div className="App">
      <h1 className="h1">CRUD LIVRARIA</h1>

      <div className="form-livro">

        <label>Nome do Livro </label>
        <input
          placeholder="Nome do livro"
          type="text"
          name="livroTitulo"
          value={livroTitulo}
          onChange={(e) => {
            setLivroTitulo(e.target.value)
          }}
        />

        <label>Autor do Livro </label>
        <input
          placeholder="Autor do livro"
          type="text"
          name="livroAutor"
          value={livroAutor}
          onChange={(e) => {
            setLivroAutor(e.target.value)
          }}
        />
      </div>

      <div className="form-button">
        <button
          className="button"
          onClick={novoLivro}
        >
          Enviar
        </button>
      </div>

      {
        livroLista.map((livro) => {
          return (
            <div className="info-livro">
              <h1>Titulo: {livro.titulo} - Autor: {livro.autor}</h1>
              <input
                type="text"
                id={livro.id}
                onChange={(e) => {
                  setLivroNovoTitulo(e.target.value)
                }} placeholder="Novo Titulo" />

              <input
                type="text"
                id={"update-" + livro.id}
                onChange={(e) => {
                  setLivroNovoAutor(e.target.value)
                }} placeholder="Novo Autor" />

              <button className="button"
                onClick={() => {
                  atualizaLivro(livro.id)
                }}>
                Atualizar
              </button>
              <button className="button"
                onClick={() => {
                  apagaLivro(livro.id)
                }}>
                Apagar
              </button>

            </div>
          )
        })
      }

    </div>
  );
}

export default App;
