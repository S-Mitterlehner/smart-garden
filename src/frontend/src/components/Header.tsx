import { Menu, Switch, UnstyledButton } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";
import { Link } from "react-router";
import { SocketType, useAppSettingsContext } from "../hooks/useAppSettings";

export default function Header() {
  const { socketType } = useAppSettingsContext();

  const showTodo = () => {
    alert("TODO: Not implemented yet!");
  };

  return (
    <header className="sticky top-0 z-10 bg-emerald-600 py-2 text-white shadow-md">
      <div className="m-auto flex max-w-screen-desktop flex-row justify-between px-4">
        <Link to="/" className="text-xl font-black">
          <span>S</span>
          <span className="hidden phone:inline">mart</span>
          <span className="hidden phone:inline">-</span>
          <span>G</span>
          <span className="hidden phone:inline">arden</span>
        </Link>
        <div className="flex flex-row items-center gap-8">
          <Link to="/bed/a3c51a2a-0b07-442f-af31-3b7d88dda10d">Test Bed</Link>

          <Menu>
            <Menu.Target>
              <UnstyledButton>
                <IconMenu2 />
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown w={"200px"}>
              <Menu.Item onClick={showTodo}>Plants</Menu.Item>
              <Menu.Item onClick={showTodo}>Beds</Menu.Item>
              <Menu.Divider />
              <Menu.Label>Fast Settings</Menu.Label>
              <Menu.Item>
                <Switch
                  color="#5ee9b5"
                  checked={socketType.get === SocketType.SignalR}
                  onChange={(e) =>
                    socketType.set(e.currentTarget.checked ? SocketType.SignalR : SocketType.GraphQLSubs)
                  }
                  label={socketType.get}
                ></Switch>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item onClick={showTodo}>Settings</Menu.Item>
              <Menu.Item onClick={showTodo}>Logout</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </header>
  );
}
