import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import firebaseApp from "./../../firebaseConfig";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');


const Login: React.FC = () => { 
  
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleAppleLogin = async () => {
    try {
      await signInWithPopup(auth, appleProvider);
    } catch (error) {
      console.error("Apple Sign-In Error:", error);
    }
  };

  return (
    <main>

<div className="flex items-center justify-center mt-24 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
        <h1 className="text-2xl font-bold mb-6">Login to LingoLive</h1>
        <button
          onClick={handleGoogleLogin}
          className="w-full mb-4 px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
        >
          Sign in with Google
        </button>
        <button
          onClick={handleAppleLogin}
          className="w-full px-6 py-3 bg-black text-white rounded-lg shadow-md hover:bg-gray-800"
        >
          Sign in with Apple
        </button>
      </div>
    </div>
    </main>
  );
}

export default Login;