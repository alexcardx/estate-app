import "./Agents.scss";
import { agents } from "../../constants";

const AgentsPage = () => {
  return (
    <div className="agents-page">
      <section className="intro">
        <h1>Meet Our Agents</h1>
        <p>
          At <strong>Horizon Estate</strong>, our team is the heart of what we
          do. With years of experience, passion for real estate, and commitment
          to your goals, our agents are here to guide you every step of the way.
        </p>
      </section>

      <section className="agents-list">
        {agents.map((agent, index) => (
          <div className="agent-card" key={index}>
            <img src={agent.image} alt={agent.name} />
            <div className="info">
              <h2>{agent.name}</h2>
              <h4>{agent.role}</h4>
              <p>{agent.description}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AgentsPage;
