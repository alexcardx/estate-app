import { Outlet } from "react-router";
import Layout from "./components/layout/Layout";

const App = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default App;
