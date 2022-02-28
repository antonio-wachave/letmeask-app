import { createContext, ReactNode, useEffect, useState,  } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
}

//TYPAGEM TYPESCRIPT
type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {

  const [user, setUser] = useState<User>();

  //FUNCAO EXECUTA UMA VEZ
  useEffect(() => {
    //Evento de fica escutando
    const unsubscribe = auth.onAuthStateChanged(user => {
      //CONDICAO PARA VERIFICACAO DE USER
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error(" Faltando Informacao da conta google");
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        });
      };
    });

    return () => {
      unsubscribe();
    }
  }, []);

  //FUNCAO DE AUTH
  async function signInWithGoogle() {

    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    //CONDICAO PARA VERIFICACAO DE USER
    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error(" Faltando Informacao da conta google");
      }
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      });
    };
  };
  
  return (
  <AuthContext.Provider value={{ user, signInWithGoogle }}>
    {props.children}
  </AuthContext.Provider>
  );
}