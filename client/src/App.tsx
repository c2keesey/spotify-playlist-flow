import { FC } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import SpotifyProvider from "./SpotifyProvider";

interface Props {}

const authCode = new URLSearchParams(window.location.search).get("code");

const App: FC<Props> = () => {
  return authCode ? (
    <SpotifyProvider>
      <Dashboard authCode={authCode} />{" "}
    </SpotifyProvider>
  ) : (
    <Login />
  );
};

export default App;
