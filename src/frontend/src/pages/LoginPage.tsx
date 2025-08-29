import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLogin } from "@tabler/icons-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthContext } from "../hooks/useAuth";

export default function LoginPage() {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });

  const { login, isLoggedIn, isLoading } = useAuthContext();
  const nav = useNavigate();

  useEffect(() => {
    if (isLoggedIn) nav("/");
  }, [isLoggedIn, nav]);

  const handleLogin = async ({ username, password }: { username: string; password: string }) => {
    const message = await login(username, password);
    if (message) {
      form.setErrors({ username: message, password: "" });
    }
  };

  return (
    <div className="mx-auto mt-20 flex w-96 flex-col gap-4">
      <h1 className="text-center text-xl font-semibold">{"Welcome back!"}</h1>
      <h3 className="text-center text-sm text-gray-600">{"Enter your credentials to log in."}</h3>

      <form onSubmit={form.onSubmit(handleLogin)} className="mt-4 flex flex-col gap-4">
        <TextInput
          label="Email / Username"
          key={form.key("username")}
          autoComplete="username"
          required
          {...form.getInputProps("username")}
        />
        <PasswordInput
          label="Password"
          key={form.key("password")}
          autoComplete="current-password"
          required
          {...form.getInputProps("password")}
        />

        <div className="grid grid-cols-2 gap-8">
          <Link to="/register">
            <Button type="button" fullWidth variant="outline">
              Register Now
            </Button>
          </Link>

          <Button type="submit" loading={isLoading} fullWidth leftSection={<IconLogin size={18} />}>
            Login
          </Button>
        </div>
      </form>
    </div>
  );
}
