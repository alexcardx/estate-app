import SearchBar from "../../components/searchBar/SearchBar";
import bg from "../../assets/bg.png";
import "./Home.scss";

const Home = () => {
  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Find Real Estate & Get Your Dream Place</h1>
          <p className="hotel-description">
            At <strong>Horizons Estate</strong>, we believe that finding the
            perfect property should be more than just a search — it should be a
            journey that leads you to your dream lifestyle. Whether you're
            looking for a modern apartment in the heart of the city, a cozy home
            in the suburbs, or a luxurious villa by the sea, we are here to help
            you find a place that feels like home.
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Award Gained</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src={bg} alt="background" />
      </div>
    </div>
  );
};

export default Home;
