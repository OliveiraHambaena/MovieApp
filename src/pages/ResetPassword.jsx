import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Exchange the access_token in the hash for a session
    const hash = window.location.hash;
    if (hash) {
      supabase.auth
        .exchangeCodeForSession(hash)
        .then(({ error }) => {
          if (error) {
            setError("Invalid or expired reset link.");
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Invalid or expired reset link.");
          setLoading(false);
        });
    } else {
      setError("No reset token found.");
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated! You can now log in.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Set a New Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Update Password</button>
      </form>
      {message && <div style={{ color: "green" }}>{message}</div>}
    </div>
  );
}

export default ResetPassword;
