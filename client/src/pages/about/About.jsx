import "./About.scss";

const About = () => {
  return (
    <div className="about-page">
      <div className="overlay">
        <div className="text-content">
          <h1>About Horizon Estate</h1>
          <p>
            Horizon Estate is more than just a real estate agency — we are your
            trusted partner in finding the place you’ll call home. With years of
            experience in the property market, we specialize in connecting
            people with spaces that match their lifestyle, dreams, and budget.
          </p>
          <p>
            Whether you’re buying, selling, or renting, our team of professional
            agents is committed to making the process smooth and stress-free. We
            offer a wide range of properties, from cozy apartments to luxury
            villas, tailored to meet every need.
          </p>
          <p>
            Our mission is to help you make informed decisions when it comes to
            one of the most significant investments of your life. We provide
            expert advice, personalized services, and detailed knowledge of the
            local market to guide you in finding the perfect property.
          </p>
        </div>
        <div className="facts">
          <div className="fact-card">
            <h2>15+ Years</h2>
            <p>Of Real Estate Experience</p>
          </div>
          <div className="fact-card">
            <h2>3000+</h2>
            <p>Happy Clients Served</p>
          </div>
          <div className="fact-card">
            <h2>98%</h2>
            <p>Customer Satisfaction Rate</p>
          </div>
          <div className="fact-card">
            <h2>50+</h2>
            <p>Certified Agents</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
