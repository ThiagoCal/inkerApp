import { useEffect, useState } from "react";
import { auth, db, functions } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword, sendPasswordResetEmail,
  confirmPasswordReset
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";

export const passwordReset = async (email) => {
  return await sendPasswordResetEmail(auth, email)
}

// export const confirmThePasswordReset = async (
//   oobCode, newPassword
// ) => {
//   if(!oobCode && !newPassword) return;
  
//   return await confirmPasswordReset(auth, oobCode, newPassword)
// }

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        // fetchData(user.email);
        navigate("/");
      }
    });
    return unsubscribe;
  }, []);

  const handleResetPassword = async () => {
    try {
      await passwordReset(email);
      setMessage(
        "E-mail de redefinição de senha enviado! Verifique sua caixa de entrada."
      );
    } catch (error) {
      setError(
        "Erro ao enviar e-mail de redefinição de senha. Verifique o endereço de e-mail e tente novamente."
      );
    }
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with:", user.email);
      })
      .catch((error) => {
        console.log(error.code);
        switch (error.code) {
          case "auth/invalid-email":
            setMessage("Your email address appears to be malformed.");
            break;
          case "auth/wrong-password":
            setMessage("Wrong password.");
            break;
          case "auth/user-not-found":
            setMessage("User with this email doesn't exist.");
            break;
          case "auth/user-disabled":
            setMessage("User with this email has been disabled.");
            break;
          case "auth/too-many-requests":
            setMessage("Too many requests. Try again later.");
            break;
          case "auth/operation-not-allowed":
            setMessage("Signing in with Email and Password is not enabled.");
            break;
          default:
            setMessage("An undefined Error happened.");
        }
      });
  };

  return (
    <div className="container mx-auto mt-4  border border-gray-200 p-4 rounded-lg max-w-sm">
      <form>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@inkerApp.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        {message ? <div className="mt-2 mb-2">{message}</div> : <></>}
        <div className="flex flex-col">
          <button
            type="button"
            onClick={handleLogin}
            className="text-white mb-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Login
          </button>
          {/* <button
            type="button"
            onClick={handleSignUp}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Register
          </button> */}
          {/* <div> */}
          <button
            onClick={handleResetPassword}
            type="button"
            className="group relative w-full flex justify-center  text-sm w-full sm:w-auto px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              {/* <!-- Heroicon name: lock-closed --> */}
              <svg
                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M4 8V6a4 4 0 118 0v2h1a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1h1zm2-2v2h8V6a2 2 0 00-2-2H6a2 2 0 00-2 2z"
                />
              </svg>
            </span>
            Enviar E-mail de Redefinição de Senha
          </button>
          {/* </div> */}
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
          )}
          {message && (
            <p className="mt-2 text-center text-sm text-green-600">{message}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
