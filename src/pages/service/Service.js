
import React from "react";
import canteen from "./../pic/service/canteen.PNG";
import furnishedroom from "./../pic/service/furnishedroom.PNG";
import housekeeping from "./../pic/service/housekeeping.PNG";
import watchmen from "./../pic/service/watchmen.PNG";
import wifi from "./../pic/service/wifi.PNG";
import armedguard from "./../pic/service/armedguard.PNG";
import { Button } from "react-bootstrap";



export default function Service() {
  const services = [
    {
      id: 1,
      title: "Canteen",
      description: "Well-furnished rooms with all necessary amenities.",
      image: canteen,
    },
    {
      id: 2,
      title: "Furnished Rooms",
      description: "Safe environment with CCTV surveillance.",
      image: furnishedroom,
    },
    {
      id: 3,
      title: "Housekeeping",
      description: "Nutritious meals served daily.",
      image: housekeeping,
    },
    {
      id: 4,
      title: "Watch men",
      description: "High-speed internet available throughout the hostel.",
      image: watchmen,
    },
    {
      id: 5,
      title: "Armed Guards",
      description: "High-speed internet available throughout the hostel.",
      image: armedguard,
    },
    {
      id: 6,
      title: "WiFi",
      description: "High-speed internet available throughout the hostel.",
      image: wifi,
    },
  ];

  return (
    <div className="services">
      <h2 style={{color:'black'}}> Services</h2>
      <div className="service-cards">
        {services.map((service) => (
          <div key={service.id} className="card">
            <img src={service.image} alt={service.title} />
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>

        ))}
      </div>
    </div>
  );
};


