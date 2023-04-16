import { FC } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

interface Props {}

const authCode = new URLSearchParams(window.location.search).get("code");

const App: FC<Props> = () => {
  return authCode ? <Dashboard authCode={authCode} /> : <Login />;
};

export default App;
