import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconUserPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthContext } from "../hooks/useAuth";

export default function RegisterPage() {
  const { register, isLoading, isLoggedIn } = useAuthContext();
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      username: (value) => (value.length < 3 ? "Username must be at least 3 characters long" : null),
      password: (value) => (value.length < 6 ? "Password must be at least 6 characters long" : null),
      confirmPassword: (value, values) => (value !== values.password ? "Passwords do not match" : null),
    },
  });

  const handleRegister = ({ username, password }: { username: string; password: string; confirmPassword: string }) => {
    console.log("hit");
    const message = register(username, password).then((message) => {
      if (message)
        notifications.show({
          title: "Error",
          message: message,
          color: "red",
        });
      else {
        notifications.show({
          title: "Registered in",
          message: "You have successfully registered and can now log in.",
          color: "green",
        });
        navigate("/login");
      }
    });
  };

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  return (
    <div className="mx-auto mt-20 flex w-96 flex-col gap-4">
      <h1 className="text-center text-xl font-semibold">Create your account</h1>
      <h3 className="text-center text-sm text-gray-600">Register a new account to get started.</h3>

      <form onSubmit={form.onSubmit(handleRegister)} className="mt-4 flex flex-col gap-4">
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
          autoComplete="off"
          required
          {...form.getInputProps("password")}
        />

        <PasswordInput
          label="Confirm Password"
          key={form.key("confirmPassword")}
          autoComplete="new-password"
          required
          {...form.getInputProps("confirmPassword")}
        />
        <div className="grid grid-cols-2 gap-8">
          <Link to="/login">
            <Button type="button" fullWidth variant="outline">
              Log In
            </Button>
          </Link>

          <Button type="submit" loading={isLoading} fullWidth leftSection={<IconUserPlus size={18} />}>
            Register
          </Button>
        </div>
      </form>
    </div>
  );
}
