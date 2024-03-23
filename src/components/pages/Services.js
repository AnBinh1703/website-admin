import React from "react"; // Importing React

const TechnicalAspectCard = ({ title, description }) => (
  <div className="technical-aspect-card">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export default function Services() {
  const technicalAspects = [
    {
      title: "Sensors",
      description: "Collecting data from the environment.",
    },
    {
      title: "Processing",
      description: "Analyzing and interpreting sensor data.",
    },
    {
      title: "Decision-making",
      description: "Making decisions based on processed data.",
    },
    {
      title: "Control",
      description: "Executing actions based on decisions.",
    },
    {
      title: "Learning",
      description: "Adapting to new situations and environments.",
    },
    {
      title: "Interaction",
      description: "Communicating with other systems and devices.",
    },
  ];

  return (
    <div className="services">
      <h1>Technical Aspects of Autonomous Systems</h1>
      <img src="/inspector.jpg" alt="Technical Aspects of Autonomous Systems" />
      <p>
        Autonomous systems, such as self-driving cars, drones, and robots, rely
        on advanced technologies to operate without direct human intervention.
        Here are some key technical aspects:
      </p>
      <div className="technical-aspects-container">
        {technicalAspects.map((aspect, index) => (
          <TechnicalAspectCard
            key={index}
            title={aspect.title}
            description={aspect.description}
          />
        ))}
      </div>
    </div>
  );
}
