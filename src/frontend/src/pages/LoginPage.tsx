import { Alert, Button, PasswordInput, Tabs, TextInput } from "@mantine/core";
import { IconAlertCircle, IconCheck, IconLogin, IconUserPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../hooks/useAuth";

export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");

  const { login, register, isLoggedIn, isLoading } = useAuthContext();
  const nav = useNavigate();

  useEffect(() => {
    if (isLoggedIn) nav("/");
  }, [isLoggedIn, nav]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const action = mode === "register" ? register : login;
    const message = await action(username, password);

    if (message) {
      setError(message);
    } else if (mode === "register") {
      setSuccess("Registration successful! You can now log in.");
      setMode("login");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="mx-auto mt-20 flex w-96 flex-col gap-4">
      <h1 className="text-center text-xl font-semibold">
        {mode === "login" ? "Welcome back!" : "Create your account"}
      </h1>
      <h3 className="text-center text-sm text-gray-600">
        {mode === "login" ? "Enter your credentials to log in." : "Register a new account to get started."}
      </h3>

      <Tabs value={mode} onChange={(val) => setMode(val as "login" | "register")} variant="outline">
        <Tabs.List>
          <Tabs.Tab value="login">
            <IconLogin size={16} />
            Login
          </Tabs.Tab>
          <Tabs.Tab value="register">
            <IconUserPlus size={16} />
            Register
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <form onSubmit={handleAuth} className="mt-4 flex flex-col gap-4">
        <TextInput
          label="Email / Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          required
        />

        {mode === "register" && (
          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        )}

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
            {error}
          </Alert>
        )}

        {success && (
          <Alert icon={<IconCheck size={16} />} title="Success" color="green">
            {success}
          </Alert>
        )}

        <Button
          type="submit"
          loading={isLoading}
          fullWidth
          leftSection={mode === "login" ? <IconLogin size={18} /> : <IconUserPlus size={18} />}
        >
          {mode === "login" ? "Login" : "Register"}
        </Button>
      </form>
    </div>
  );
}
