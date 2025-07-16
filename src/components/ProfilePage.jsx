import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function ProfilePage({ onClose }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex flex-col p-4 text-white space-y-3">
      <h2 className="text-lg font-semibold mb-2">Profile</h2>
      {user ? (
        <>
          <div className="text-sm">
            <b>Email:</b> {user.email}
          </div>
          <div className="text-sm">
            <b>ID:</b> {user.user_id?.slice(0, 4)}...
          </div>
          <button
            onClick={logout}
            className="bg-red-600 text-xs px-3 py-1 rounded mt-3 hover:bg-red-700"
          >
            Log Out
          </button>
        </>
      ) : (
        <div className="text-sm">You are browsing as guest.</div>
      )}
      <button
        onClick={onClose}
        className="text-primary/70 hover:underline text-xs mt-2"
      >
        Close
      </button>
    </div>
  );
}
