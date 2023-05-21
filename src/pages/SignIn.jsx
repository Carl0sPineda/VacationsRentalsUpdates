import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import OAuth from "../components/OAuth";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { toast } from "react-toastify";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const navigate = useNavigate();
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredentials.user) {
        navigate("/");
      }
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error("Necesitas registrarte");
      } else {
        toast.error("Credenciales incorrectas");
      }
    }
  }

  return (
    <section>
      {/* <h1 className="text-3xl text-center mt-6 font-bold">Login</h1> */}
      <div
        className="flex justify-center flex-wrap items-center
      px-6 py-12 max-w-6xl mx-auto"
      >
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://images.unsplash.com/photo-1599842079323-663d060a0f99?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzV8fGNvc3RhJTIwcmljYSUyMGxvZ2lufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
            alt="key"
            className="w-full rounded-2xl"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={onSubmit}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email"
              className="mb-6 w-full px-4 py-2 text-xl
             text-gray-700 bg-white border-gray-300
             rounded transition ease-in-out"
            />
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={onChange}
                placeholder="Contraseña"
                className="w-full px-4 py-2 text-xl
             text-gray-700 bg-white border-gray-300
             rounded transition ease-in-out"
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  className="absolute
              right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <AiFillEye
                  className="absolute right-3 
             top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div>
            <div
              className="flex 
              justify-between whitespace-nowrap tex-sm 
              sm:text-lg"
            >
              <p className="mb-6">
                No tienes una cuenta?
                <Link
                  to="/sign-up"
                  className="text-red-600
                hover:text-red-700
                transition duration-200
                ease-in-out
                ml-1"
                >
                  Registrate
                </Link>
              </p>
              <p>
                <Link
                  to="/forgot-password"
                  className="text-blue-600
                hover:text-blue-800
                transition duration-200
                ease-in-out"
                >
                  Recuperar contraseña?
                </Link>
              </p>
            </div>
            <button
              className="w-full text-center bg-slate-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-slate-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-slate-800"
              type="submit"
            >
              Inicia sesión
            </button>
            <div className="flex items-center  my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
              <p className="text-center font-semibold mx-4">O</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
}
