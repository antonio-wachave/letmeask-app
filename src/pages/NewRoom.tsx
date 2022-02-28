import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";

import '../styles/auth.scss';
import { Button } from "../components/Button";
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';


export function NewRoom(){

  //usuario
  const { user } = useAuth();
  //variavel de criacao de sala
  const [newRoom, setNewRoom] = useState('');
  //nova rota
  const navigate = useNavigate();

  async function handleCreateRoom(event: FormEvent){
    
    //tratamento da tecla para refresh
    event.preventDefault();
    //validacao de criacao de sala
    if(newRoom.trim() === ''){
      return;
    };
    
    //criar a sala
    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    navigate(`/rooms/${firebaseRoom.key}`);
  };

  return(
    <div id="page-auth">
    <aside>
        <img src={illustrationImg} alt="Ilustracao simbolizando perguntas e respostas" />
        <strong>Crie Salas de Q&amp;A ao-vivo</strong>
        <p> Tire as Duvidas da sua audiencia em tempo-real</p>
    </aside>
    <main>
     
      <div className="main-container">
        <img src={logoImg} alt="letmeask" />
       <h2> Criar Uma nova Sala </h2>
        <form onSubmit={handleCreateRoom}> 
          <input 
          type="text" 
          placeholder="Nome da Sala"
          onChange={event => setNewRoom(event.target.value)}
          value={newRoom}
          />
          <Button type="submit">
            Criar Sala
          </Button>
        </form>
        <p> Quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
      </div>
    </main>
  </div>
  );
};