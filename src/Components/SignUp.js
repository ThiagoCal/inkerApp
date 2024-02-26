import { useEffect, useState } from "react";
import { auth, db, functions } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Registered with:", user.email);
        
      })
      .catch((error) => {
        console.log(error.code);
        switch (error.code) {
          case "auth/invalid-email":
            setMessage("Your email address appears to be malformed.");
            break;
          case "auth/unverified-email":
            setMessage("The operation requires a verified email.");
            break;
          case "auth/user-not-found":
            setMessage("User with this email doesn't exist.");
            break;
          case "auth/weak-password":
            setMessage("The password must be 6 characters long or more.");
            break;
          case "auth/email-already-in-use":
            setMessage(
              "The email address is already in use by another account."
            );
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
            onClick={handleSignUp}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Register
          </button>

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
