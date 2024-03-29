import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { getDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import React from "react";
import { GrGooglePlus } from "react-icons/gr";
import { FaFacebookF } from "react-icons/fa";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const navigate = useNavigate();

  async function onGoogleClick() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/profile");
      toast.success("Login realizado con éxito!!");
    } catch (error) {
      toast.error("Error al realizar el login con Google");
      console.log(error);
    }
  }

  async function onFacebookClick() {
    try {
      const auth = getAuth();
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/profile");
      toast.success("Login realizado con éxito!!");
    } catch (error) {
      toast.error("Error al realizar el login con Facebook");
      console.log(error);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={onGoogleClick}
        className="flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out rounded"
      >
        <GrGooglePlus className="text-3xl  mr-5" />
        Login con Google
      </button>

      <button
        type="button"
        onClick={onFacebookClick}
        className="mt-6 flex items-center justify-center w-full bg-blue-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-blue-800 active:bg-blue-900 shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out rounded"
      >
        <FaFacebookF className="text-3xl  mr-5 " />
        Login con Facebook
      </button>
    </div>
  );
}
