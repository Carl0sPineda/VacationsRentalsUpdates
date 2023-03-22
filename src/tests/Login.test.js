import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

describe("Login pruebas unitarias", () => {
  it("Registra un nuevo usuario con éxito", async () => {
    const email = "test21@gmail.com";
    const password = "123456";

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    expect(userCredential.user.email).toBe(email);
  });

  it("La contraseña no cumple con los 6 caracteres requeridos", async () => {
    const email = "test25@gmail.com";
    const weakPassword = "12345";

    const error = await createUserWithEmailAndPassword(
      auth,
      email,
      weakPassword
    ).catch((error) => error);

    expect(error.code).toBe("auth/weak-password");
  });

  it("El email digitado ya se encuentra en uso", async () => {
    const emailAlreadyInUse = "test20@gmail.com";
    const password = "123455";

    const error = await createUserWithEmailAndPassword(
      auth,
      emailAlreadyInUse,
      password
    ).catch((error) => error);

    expect(error.code).toBe("auth/email-already-in-use");
  });

  it("Inicia sesión con éxito, credenciales válidas", async () => {
    const email = "test20@gmail.com";
    const password = "test20@gmail.com";

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    expect(userCredential.user.email).toBe(email);
  });

  it("Verifica credenciales inválidas(contraseña) al hacer login", async () => {
    const email = "test20@gmail.com";
    const wrongPassword = "12345678";

    const error = await signInWithEmailAndPassword(
      auth,
      email,
      wrongPassword
    ).catch((error) => error);

    expect(error.code).toBe("auth/wrong-password");
  });

  it("Verifica credenciales inválidas(email) al hacer login", async () => {
    const wrongEmail = "test00@gmail.com";
    const password = "12345678";

    const error = await signInWithEmailAndPassword(
      auth,
      wrongEmail,
      password
    ).catch((error) => error);

    expect(error.code).toBe("auth/user-not-found");
  });
});
