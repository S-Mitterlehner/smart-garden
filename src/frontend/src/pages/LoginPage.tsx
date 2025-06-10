import { Button, PasswordInput, TextInput } from "@mantine/core";
import { IconLogin, IconMail } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../hooks/useAuth";

export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const nav = useNavigate();

  const { login, isLoggedIn } = useAuthContext();

  useEffect(() => {
    if (isLoggedIn) nav("/");
  }, [isLoggedIn, nav]);

  return (
    <form
      className="mx-auto mt-20 flex w-96 flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        login(username, password);
      }}
    >
      <TextInput
        label="Email / Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
      />
      <PasswordInput label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <div className="flex flex-row items-center gap-4">
        <Button variant="outline" w="100%">
          <div className="flex flex-row items-center justify-center gap-2">
            <IconMail></IconMail>
            <p>Register</p>
          </div>
        </Button>
        <Button variant="filled" type="submit" w="100%">
          <div className="flex flex-row items-center justify-center gap-2">
            <IconLogin></IconLogin>
            <p>Login</p>
          </div>
        </Button>
      </div>
    </form>
  );
}
