import React, { useState } from "react";
import { useLogin } from "../../context/LoginContext";

const LoginPage: React.FC = () => {
  const { login } = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = login(username, password);
    if (res?.message) {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md bg-card text-card-foreground border border-border rounded-2xl p-8 shadow-lg animate-fade-in">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            CRM System
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Call Management
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-ring transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-ring transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary text-primary-foreground
                       py-2.5 text-sm font-semibold hover:opacity-90 transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} CRM Call Management
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
