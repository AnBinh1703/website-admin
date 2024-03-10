import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className="cards">
      <h1>AutoCar Tournament: The Robot Harvesting Challenge</h1>
      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              src="https://howtorobot.com/sites/default/files/2023-03/shutterstock_1995250223.jpg"
              text="Harvesting Robots: Automated Farming in 2023"
              label="Sustainable"
              path="/"
            />
            <CardItem
              src="https://howtorobot.com/sites/default/files/inline-images/shutterstock_2196471315.jpg"
              text="Agricultural Robot Applications"
              label="Efficient"
              path="/"
            />
          </ul>
          <ul className="cards__items">
            <CardItem
              src="https://howtorobot.com/sites/default/files/inline-images/shutterstock_1354492286-min.jpg"
              text="Robots can be equipped with sensors and mapping technologies"
              label="Productive"
              path="/"
            />
            <CardItem
              src="https://howtorobot.com/sites/default/files/inline-images/Robot%20arm%20on%20AMR%20placing%20a%20box%20-%20shutterstock_1982083181.jpg"
              text="Wheeled AMR with Robotic Arm"
              label="Flexible"
              path="/"
            />
            <CardItem
              src="https://www.shutterstock.com/shutterstock/videos/1106305751/thumb/1.jpg?ip=x480"
              text="Robot Picking Tomatoes Tomato Garden Agricultural"
              label="Convenient"
              path="/"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
