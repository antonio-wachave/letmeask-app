import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";
import '../styles/auth.scss';

import { Button } from "../components/Button";
import { useAuth } from '../hooks/useAuth';
import { database } from "../services/firebase";


export function Home(){

   const navigate = useNavigate();
   const { user, signInWithGoogle } = useAuth();
   const [roomCode, setRoomCode] = useState('');

  //funcao para criar sala 
 async function handleCreateRoom() {

    if(!user){
      await signInWithGoogle();
    };

    navigate('/rooms/new');
  };

  //fluxo de como entrar numa sala
  async function handleJoinRoom(event: FormEvent) {
    //validar o refresh
    event.preventDefault();
    //validar o espaco vazio
    if(roomCode.trim() === ''){
      return;
    };

    //declaracao e validar se a sala existe.
    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if(!roomRef.exists()){
      alert(" A Sala nao existe. ");
      return;
    };

    //para confirmar que a sala ja esta fechada
    if(roomRef.val().endedAt){
      alert(" A Sala ja es encontra encerrada ");
      return;
    }

    navigate(`/rooms/${roomCode}`);
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
        <button onClick={handleCreateRoom} className="create-room">
          <img src={googleIconImg} alt="Logo da google" />
          Crie sua sala com o google
        </button>
        <div className="separator">ou entre na sua Sala</div>
        <form onSubmit={handleJoinRoom}> 
          <input 
          type="text" 
          placeholder="Digite o codigo da sala"
          onChange={event => setRoomCode(event.target.value)}
          value={roomCode}
          />
          <Button type="submit">
            Entrar na Sala
          </Button>
        </form>
      </div>
    </main>
  </div>
  );
};