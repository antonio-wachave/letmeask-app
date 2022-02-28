//import { FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg'; 
import answerImg from '../assets/images/answer.svg';

import { Button } from  '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../styles/room.scss';


type RoomParams = {
  id: string;
}

export function AdminRoom() {

  //const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const {questions, title} = useRoom(roomId);

  //terminar a Sala:
  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    });

    navigate("/");
  };

  //tecla de apagar os dados 
async function handleDeleteQuestion(questionId: string){
if(window.confirm('Tem certeza que voce deseja excluir essa pergunta ? ')){
  await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
  }
};

//Verificao da pergunta como respondida
async function handleCheckQuestionsAsAnswered(questionId: string) {
  await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
    isAnswered: true,
  });
}

//Dar destaque a pergunta
async function handleHighlightQuestions(questionId: string) {
  await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
    isHighlighted: true,
  });
}


  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
          <RoomCode code={roomId} />
          <Button onClick={handleEndRoom} isOutlined>Encerrar Sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1> {title} </h1>
          {questions.length > 0 && <span> {questions.length} perguntas </span>}
        </div>

        <div className="question-list">
        {questions.map(question => {
          return (
            <Question 
            key={question.id}
            content={question.content} 
            author={question.author}
            isAnswered={question.isAnswered}
            isHighlighted={question.isHighlighted}
            >
              {!question.isAnswered && (
                <>
              <button 
              type="button"
              onClick={() => handleCheckQuestionsAsAnswered(question.id)}
              >
                <img src={checkImg} alt="Verificao da pergunta como respondida" />
              </button>

              <button 
              type="button"
              onClick={() => handleHighlightQuestions(question.id)}
              >
                <img src={answerImg} alt=" Dar destaque a pergunta " />
              </button>
               </>
              )}

              <button 
              type="button"
              onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt=" apagar pergunta " />
              </button>
            </Question>
          );
        })
      };
      </div>
      </main>
    </div>
  );
};