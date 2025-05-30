import React from "react";
import gallery from "./../pic/gallery/gallery.PNG";
import gallery2 from "./../pic/gallery/gallery2.PNG";
import gallery3 from "./../pic/gallery/gallery3.PNG";


const rooms = [
  {
    id: 1,
    type: "Single Room",
    price: "$3000/month",
    facilities: ["WiFi", "AC", "Attached Bath", "Study Table"],
    image: gallery,
  },
  {
    id: 2,
    type: "Double Room",
    price: "$5000/month",
    facilities: ["WiFi", "Fan", "Shared Bathroom", "Wardrobe"],
    image: gallery2,
  },
  {
    id: 3,
    type: "Shared Room",
    price: "$8000/month",
    facilities: ["WiFi", "Common Area", "Shared Bathroom", "Storage Space"],
    image:gallery3,
  },
];

export default function Room () {
  return (
    <div className="room-page">
      <h2>Hostel Rooms</h2>
      <div className="room-container">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <img src={room.image} alt={room.type} />
            <h3>{room.type}</h3>
            <p className="price">{room.price}</p>
            <ul>
              {room.facilities.map((facility, index) => (
                <li key={index}>✅ {facility}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};


