import React from "react";

import { User } from "firebase/auth";

interface AccountProps {
  user: User | null;
  onLogout: () => void;
}
const Account: React.FC<AccountProps> = ({ user, onLogout }) => {

  if (!user) {
    return <p className="text-center text-red-500">User not found</p>;
  }
  
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Account Details</h1>

          <img src={user?.photoURL || "https://via.placeholder.com/150"} alt="User Profile" className="w-24 h-24 rounded-full mx-auto mb-4" />
        <p className="text-lg font-semibold">{user?.displayName}</p>
          <p className="text-gray-600">{user?.email}</p>
          <br/><br/><br/>
        <button onClick={onLogout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">Logout</button>
        </div>


      </div>
    </div>
  );
};

export default Account;