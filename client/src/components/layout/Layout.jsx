import Navbar from "../navbar/Navbar";
import "./Layout.scss";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
