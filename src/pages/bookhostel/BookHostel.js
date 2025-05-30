
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Container, Form } from "react-bootstrap";

export default function HostelManagement() {
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomError, setRoomError] = useState("");

  const [formData, setFormData] = useState({
    room_number: "",
    food_status: "With Food",
    stay_from: "",
    stay_duration: "",
    total_fee: "",
    first_name: "",
    last_name: "",
    gender: "Male",
    phone: "",
    email: "",
    guardian_name: "",
    guardian_relation: "",
    guardian_contact_no: "",
    address: "",
    city: "",
    state: "",
  });

  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [loadingBooking, setLoadingBooking] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/room"   , {
          headers: {
              Authorization: `Bearer ${token}`  // 🔐 Send token in Authorization header
          }
      });
        if (Array.isArray(response.data.data)) {
          setRooms(response.data.data);
        } else {
          setRoomError("No rooms found.");
        }
      } catch (err) {
        setRoomError("Error fetching rooms.");
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const selectedRoom = rooms.find(
      (room) => room.room_number === parseInt(formData.room_number)
    );
    if (selectedRoom && formData.stay_duration) {
      const duration = parseInt(formData.stay_duration);
      const perMonth = parseFloat(selectedRoom.per_month || 0);
      let total = duration * perMonth;

      if (formData.food_status === "With Food") {
        total += 500 * duration;
      }

      setFormData((prevData) => ({
        ...prevData,
        total_fee: total.toFixed(2),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        total_fee: "",
      }));
    }
  }, [formData.room_number, formData.stay_duration, formData.food_status, rooms]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingBooking(true);
    setBookingError("");
    setBookingMessage("");

    const submissionData = {
      ...formData,
      room_number: parseInt(formData.room_number),
      stay_duration: parseInt(formData.stay_duration),
    };

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post("http://localhost:5000/api/book_hostel", submissionData, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
      if (response.data.statuscode === 200) {
        setBookingMessage("Hostel booked successfully!");
      } else {
        setBookingError(response.data.error || "Booking failed.");
      }
    } catch (err) {
      setBookingError("Error booking hostel. Please try again.");
    } finally {
      setLoadingBooking(false);
    }
  };

  return (
    <Container className="bookhostel">
      <h2 className="text-center">Hostel Booking Form</h2>

      <Form onSubmit={handleSubmit}>
        <h5 className="mb-3">Room Details</h5>
        <div className="d-flex gap-3 mt-3 flex-wrap">
          <Form.Group style={{ width: "32%" }}>
            <Form.Label>Room Number</Form.Label>
            <Form.Select name="room_number" value={formData.room_number} onChange={handleChange}>
              <option value="">Select Room</option>
              {rooms
                .filter((room) => room.available_seats > 0)
                .map((room) => (
                  <option key={room.room_id} value={room.room_number}>
                    Room {room.room_number} ({room.room_type}) - Seats: {room.available_seats}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>

          <Form.Group style={{ width: "32%" }}>
            <Form.Label>Stay Duration (Months)</Form.Label>
            <Form.Select name="stay_duration" value={formData.stay_duration} onChange={handleChange}>
              <option value="">Select duration</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} month(s)
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group style={{ width: "32%" }}>
            <Form.Label>Stay From</Form.Label>
            <Form.Control
              type="date"
              name="stay_from"
              value={formData.stay_from}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group style={{ width: "32%" }}>
            <Form.Label>Food Status</Form.Label>
            <Form.Select name="food_status" value={formData.food_status} onChange={handleChange}>
              <option value="With Food">With Food</option>
              <option value="Without Food">Without Food</option>
            </Form.Select>
          </Form.Group>

          <Form.Group style={{ width: "32%" }}>
            <Form.Label>Total Fee (Rs.)</Form.Label>
            <Form.Control type="text" value={formData.total_fee} readOnly />
          </Form.Group>
        </div>

        <h5 className="mb-3 mt-4">Student Info</h5>
        <div className="d-flex gap-3 flex-wrap">
          <Form.Group style={{ width: "32%" }}>
            <Form.Label>First Name</Form.Label>
            <Form.Control name="first_name" value={formData.first_name} onChange={handleChange} />
          </Form.Group>
          <Form.Group style={{ width: "32%" }}>
            <Form.Label>Last Name</Form.Label>
            <Form.Control name="last_name" value={formData.last_name} onChange={handleChange} />
          </Form.Group>
          <Form.Group style={{ width: "32%" }}>
            <Form.Label>Gender</Form.Label>
            <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
              <option>Male</option>
              <option>Female</option>
            </Form.Select>
          </Form.Group>
          <Form.Group style={{ width: "32%" }}>
            <Form.Label>Phone</Form.Label>
            <Form.Control name="phone" value={formData.phone} onChange={handleChange} />
          </Form.Group>
          <Form.Group style={{ width: "32%" }}>
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" value={formData.email} onChange={handleChange} />
          </Form.Group>
        </div>

        <h5 className="mb-3 mt-4">Guardian Info</h5>
        <div className="d-flex gap-3 flex-wrap">
          <Form.Group style={{ width: "32%" }}>
            <Form.Label>Guardian Name</Form.Label>
            <Form.Control name="guardian_name" value={formData.guardian_name} onChange={handleChange} />
          </Form.Group>
          <Form.Group style={{ width: "32%" }}>
            <Form.Label>Guardian Relation</Form.Label>
            <Form.Control name="guardian_relation" value={formData.guardian_relation} onChange={handleChange} />
          </Form.Group>
          <Form.Group style={{ width: "32%" }}>
            <Form.Label>Guardian Contact No</Form.Label>
            <Form.Control name="guardian_contact_no" value={formData.guardian_contact_no} onChange={handleChange} />
          </Form.Group>
        </div>

        <h5 className="mb-3 mt-4">Address Info</h5>
        <div className="d-flex gap-3 flex-wrap">
          <Form.Group style={{ width: "32%" }}>
            <Form.Label>Address</Form.Label>
            <Form.Control name="address" value={formData.address} onChange={handleChange} />
          </Form.Group>
          <Form.Group style={{ width: "32%" }}>
            <Form.Label>City</Form.Label>
            <Form.Control name="city" value={formData.city} onChange={handleChange} />
          </Form.Group>
          <Form.Group style={{ width: "32%" }}>
            <Form.Label>State</Form.Label>
            <Form.Control name="state" value={formData.state} onChange={handleChange} />
          </Form.Group>
        </div>

        <div className="text-center mt-4">
          <Button type="submit" style={{ backgroundColor: "#299d92", border: "none" }}>
            {loadingBooking ? "Booking..." : "Book Hostel"}
          </Button>
        </div>
        {bookingMessage && <p className="text-success text-center mt-3">{bookingMessage}</p>}
        {bookingError && <p className="text-danger text-center mt-3">{bookingError}</p>}
      </Form>
    </Container>
  );
}















// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Button, Container, Form } from "react-bootstrap";

// export default function HostelManagement() {
//   const [rooms, setRooms] = useState([]);
//   const [loadingRooms, setLoadingRooms] = useState(true);
//   const [roomError, setRoomError] = useState("");

//   const [formData, setFormData] = useState({
//     room_number: "",
//     food_status: "With Food",
//     stay_from: "",
//     stay_duration: "",
//     first_name: "",
//     last_name: "",
//     gender: "Male",
//     phone: "",
//     email: "",
//     guardian_name: "",
//     guardian_relation: "",
//     guardian_contact_no: "",
//     address: "",
//     city: "",
//     state: "",
//   });

//   const [bookingMessage, setBookingMessage] = useState("");
//   const [bookingError, setBookingError] = useState("");
//   const [loadingBooking, setLoadingBooking] = useState(false);

//   // Fetch all rooms
//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/room");
//         console.log("Full Rooms Response:", response.data);

//         if (Array.isArray(response.data) && response.data.length > 0) {
//           setRooms(response.data); // ✅ Corrected here
//         } else {
//           setRoomError("No rooms found.");
//         }
//       } catch (err) {
//         setRoomError("Error fetching rooms.");
//         console.error("Fetch Room Error:", err);
//       } finally {
//         setLoadingRooms(false);
//       }
//     };

//     fetchRooms();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoadingBooking(true);
//     setBookingError("");
//     setBookingMessage("");
//     formData.stay_duration = parseInt(formData.stay_duration);
//     formData.room_number = parseInt(formData.room_number);

//     try {
//       const response = await axios.post("http://localhost:5000/api/book_hostel", formData);
//       if (response.data.statuscode === 200) {
//         setBookingMessage("Hostel booked successfully!");
//       } else {
//         setBookingError(response.data.error || "Booking failed.");
//       }
//     } catch (err) {
//       setBookingError("Error booking hostel. Please try again.");
//       console.error("Booking Error:", err);
//     } finally {
//       setLoadingBooking(false);
//     }
//   };

//   return (
//     <Container className="bookhostel">
//       <h2 className="text-center">Hostel Booking Form</h2>

//       <h2>All Rooms</h2>
//       {loadingRooms ? (
//         <p>Loading...</p>
//       ) : roomError ? (
//         <p style={{ color: "red" }}>{roomError}</p>
//       ) : Array.isArray(rooms) && rooms.length > 0 ? (
//         <ul>
//           {rooms.map((room, index) => (
//             <li key={index}>
//               Room {room.room_number} - Capacity: {room.capacity}, ₹{room.per_day} per day
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No rooms found</p>
//       )}

//       <Form onSubmit={handleSubmit}>
//         <h5 className="mb-3">Room Details</h5>
//         <div className="d-flex gap-3 mt-3">
//           <Form.Group style={{ width: "50%" }}>
//             <Form.Label>Room Number</Form.Label>
//             <Form.Select name="room_number" value={formData.room_number} onChange={handleChange}>
//               <option value="">Select Room</option>
//               {rooms.map((room, index) => (
//                 <option key={index} value={room.room_number}>
//                   {room.room_number}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>

//           <Form.Group style={{ width: "50%" }}>
//             <Form.Label>Stay Duration</Form.Label>
//             <Form.Control
//               type="text"
//               name="stay_duration"
//               value={formData.stay_duration}
//               onChange={handleChange}
//               placeholder="Enter duration"
//             />
//           </Form.Group>

//           <Form.Group style={{ width: "50%" }}>
//             <Form.Label>Stay From</Form.Label>
//             <Form.Control
//               type="date"
//               name="stay_from"
//               value={formData.stay_from}
//               onChange={handleChange}
//             />
//           </Form.Group>
//         </div>

//         <div className="d-flex gap-3 mt-3">
//           <Form.Group style={{ width: "32%" }}>
//             <Form.Label>Food Status</Form.Label>
//             <Form.Select name="food_status" value={formData.food_status} onChange={handleChange}>
//               <option value="With Food">With Food</option>
//               <option value="Without Food">Without Food</option>
//             </Form.Select>
//           </Form.Group>
//         </div>

//         <h5 className="mb-3 mt-3">Personal Information</h5>
//         <div className="d-flex gap-3 mt-3">
//           <Form.Group style={{ width: "50%" }}>
//             <Form.Label>First Name</Form.Label>
//             <Form.Control
//               type="text"
//               name="first_name"
//               value={formData.first_name}
//               onChange={handleChange}
//               placeholder="Enter first name"
//             />
//           </Form.Group>

//           <Form.Group style={{ width: "50%" }}>
//             <Form.Label>Last Name</Form.Label>
//             <Form.Control
//               type="text"
//               name="last_name"
//               value={formData.last_name}
//               onChange={handleChange}
//               placeholder="Enter last name"
//             />
//           </Form.Group>

//           <Form.Group style={{ width: "50%" }}>
//             <Form.Label>Gender</Form.Label>
//             <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//               <option value="Other">Other</option>
//             </Form.Select>
//           </Form.Group>
//         </div>

//         <div className="d-flex gap-3 mt-3">
//           <Form.Group style={{ width: "32.5%" }}>
//             <Form.Label>Phone</Form.Label>
//             <Form.Control
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="Enter phone number"
//             />
//           </Form.Group>

//           <Form.Group style={{ width: "32.5%" }}>
//             <Form.Label>Email</Form.Label>
//             <Form.Control
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter email"
//             />
//           </Form.Group>
//         </div>

//         <h5 className="mb-3 mt-3">Guardian Information</h5>
//         <div className="d-flex gap-3 mt-3">
//           <Form.Group style={{ width: "50%" }}>
//             <Form.Label>Guardian Name</Form.Label>
//             <Form.Control
//               type="text"
//               name="guardian_name"
//               value={formData.guardian_name}
//               onChange={handleChange}
//               placeholder="Enter guardian name"
//             />
//           </Form.Group>

//           <Form.Group style={{ width: "50%" }}>
//             <Form.Label>Guardian Contact</Form.Label>
//             <Form.Control
//               type="text"
//               name="guardian_contact_no"
//               value={formData.guardian_contact_no}
//               onChange={handleChange}
//               placeholder="Enter guardian contact number"
//             />
//           </Form.Group>

//           <Form.Group style={{ width: "50%" }}>
//             <Form.Label>Guardian Relation</Form.Label>
//             <Form.Control
//               type="text"
//               name="guardian_relation"
//               value={formData.guardian_relation}
//               onChange={handleChange}
//               placeholder="Enter relation"
//             />
//           </Form.Group>
//         </div>

//         <h5 className="mb-3 mt-3">Address Information</h5>
//         <div className="d-flex gap-3 mt-3">
//           <Form.Group style={{ width: "50%" }}>
//             <Form.Label>Address</Form.Label>
//             <Form.Control
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               placeholder="Enter address"
//             />
//           </Form.Group>

//           <Form.Group style={{ width: "50%" }}>
//             <Form.Label>City</Form.Label>
//             <Form.Control
//               type="text"
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//               placeholder="Enter city"
//             />
//           </Form.Group>

//           <Form.Group style={{ width: "50%" }}>
//             <Form.Label>State</Form.Label>
//             <Form.Control
//               type="text"
//               name="state"
//               value={formData.state}
//               onChange={handleChange}
//               placeholder="Enter state"
//             />
//           </Form.Group>
//         </div>

//         <div className="text-center mt-4">
//           <Button type="submit" style={{ backgroundColor: "#299d92", border: "none" }}>
//             Book Hostel
//           </Button>
//         </div>
//         {bookingMessage && <p className="text-success text-center mt-3">{bookingMessage}</p>}
//         {bookingError && <p className="text-danger text-center mt-3">{bookingError}</p>}
//       </Form>
//     </Container>
//   );
// }











// ------------------old --------------------------------code--------------------------------------
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Button, Container, Form } from "react-bootstrap";


// export default function HostelManagement () {
//   const [rooms, setRooms] = useState([]);
//   const [loadingRooms, setLoadingRooms] = useState(true);
//   const [roomError, setRoomError] = useState("");

//   const [formData, setFormData] = useState({
//     room_number: "",
//     food_status: "With Food",
//     stay_from: "",
//     stay_duration: "",
//     first_name: "",
//     last_name: "",
//     gender: "Male",
//     phone: "",
//     email: "",
//     guardian_name: "",
//     guardian_relation: "",
//     guardian_contact_no: "",
//     address: "",
//     city: "",
//     state: "",
//   });

//   const [bookingMessage, setBookingMessage] = useState("");
//   const [bookingError, setBookingError] = useState("");
//   const [loadingBooking, setLoadingBooking] = useState(false);

//   // Fetch Available Rooms
//   useEffect(() => {
   
//     const fetchRooms = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/available_rooms");
//         if (response.data.statuscode === 200) {
//           setRooms(response.data.available_rooms);
//         } else {
//           setRoomError("No available rooms found.");
//         }
//       } catch (err) {
//         setRoomError("Error fetching rooms.");
//       } finally {
//         setLoadingRooms(false);
//       }
//     };

//     fetchRooms();
//   }, []);

//   // Handle Input Change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle Form Submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoadingBooking(true);
//     setBookingError("");
//     setBookingMessage("");
//     formData.stay_duration = parseInt(formData.stay_duration);
//     formData.room_number = parseInt(formData.room_number);

//     try {
//       const response = await axios.post("http://localhost:5000/api/book_hostel", formData);
//       if (response.data.statuscode === 200) {
//         setBookingMessage("Hostel booked successfully!");
//       } else {
//         setBookingError(response.data.error || "Booking failed.");
//       }
//     } catch (err) {
//       setBookingError("Error booking hostel. Please try again.");
//     } finally {
//       setLoadingBooking(false);
//     }
//   };

//     return (
//         <Container className="bookhostel">
//             <h2 className="text-center">Hostel Booking Form</h2>

//             <h2>Available Rooms</h2>
//         {loadingRooms ? (
//         <p>Loading...</p>
//          )  : roomError ? (
//         <p style={{ color: "red" }}>{roomError}</p>
//          ) : Array.isArray(rooms) && rooms.length > 0 ? (
//     <ul>
//         {rooms.map((room, index) => (
//             <li key={index}>
//                 Room {room.room_number} - Capacity: {room.capacity}, ₹{room.per_day} per day
//             </li>
//         ))}
//     </ul>  
//         ) : (
//         <p>No rooms available</p>
//        )}

//             <Form onSubmit={handleSubmit}>
//                 <h5 className="mb-3">Room Details</h5>
//                 <div  className="d-flex gap-3 mt-3">
//                 <Form.Group style={{ width: "50%" }} >
//                     <Form.Label>Room Number</Form.Label>
//                     <Form.Control type="text" name="room_number" onChange={handleChange} placeholder="Enter room number" />
//                 </Form.Group>
//                 <Form.Group style={{ width: "50%" }} >
//                     <Form.Label>Stay Duration</Form.Label>
//                     <Form.Control 
//                     type="text"
//                      name="stay_duration"
//                      value={formData.stay_duration} 
//                      onChange={handleChange}
//                       placeholder="Enter duration" />
//                 </Form.Group>
//                 <Form.Group style={{ width: "50%" }}>
//                     <Form.Label>Stay From</Form.Label>
//                     <Form.Control type="date" name="stay_from" value={formData.stay_from} onChange={handleChange} />
//                 </Form.Group>
//                 </div>
//                 <div  className="d-flex gap-3 mt-3">
//                 <Form.Group style={{ width: "32%" }}>
//                     <Form.Label>Food Status</Form.Label>
//                     <Form.Select name="food_status" value={formData.food_status} onChange={handleChange}>
//                        <option value="With Food">With Food</option>
//                        <option value="Without Food">Without Food</option>
//                     </Form.Select>
//                 </Form.Group >
//                 </div>
//                 <h5 className="mb-3 mt-3">Personal Information</h5>
//                 <div  className="d-flex gap-3 mt-3">
//                 <Form.Group style={{ width: "50%" }}>
//                     <Form.Label>First Name</Form.Label>
//                     <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Enter first name" />
//                 </Form.Group>

//                 <Form.Group style={{ width: "50%" }}>
//                     <Form.Label>Last Name</Form.Label>
//                     <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Enter last name" />
//                 </Form.Group>

//                 <Form.Group style={{ width: "50%" }}>
//                     <Form.Label>Gender</Form.Label>
//                     <Form.Select name="gender" onChange={handleChange}>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                     </Form.Select>
//                 </Form.Group>
//                 </div>
//                 <div  className="d-flex gap-3 mt-3">

//                 <Form.Group style={{ width: "32.5%" }}>
//                     <Form.Label>Phone</Form.Label>
//                     <Form.Control type="tel" name="phone" value={formData.phone}  onChange={handleChange} placeholder="Enter phone number" />
//                 </Form.Group>

//                 <Form.Group style={{ width: "32.5%" }}>
//                     <Form.Label>Email</Form.Label>
//                     <Form.Control type="email" name="email" value={formData.email}  onChange={handleChange} placeholder="Enter email" />
//                 </Form.Group>
//                 </div>

//                 <h5 className="mb-3 mt-3">Guardian Information</h5>

//                 <div  className="d-flex gap-3 mt-3">
//                 <Form.Group style={{ width: "50%" }}>
//                     <Form.Label>Guardian Name</Form.Label>
//                     <Form.Control type="text" name="guardian_name" value={formData.guardian_name} onChange={handleChange} placeholder="Enter guardian name" />
//                 </Form.Group>

//                 <Form.Group style={{ width: "50%" }}>
//                     <Form.Label>Guardian Contact</Form.Label>
//                     <Form.Control type="text" name="guardian_contact_no" value={formData.guardian_contact_no} onChange={handleChange} placeholder="Enter guardian contact number" />
//                 </Form.Group>

//                 <Form.Group style={{ width: "50%" }}>
//                     <Form.Label>Guardian Relation</Form.Label>
//                     <Form.Control type="text" name="guardian_relation" value={formData.guardian_relation} onChange={handleChange} placeholder="Enter relation" />
//                 </Form.Group>
//                 </div>

//                 <h5 className="mb-3 mt-3">Address Information</h5>
//                 <div  className="d-flex gap-3 mt-3">
//                 <Form.Group style={{ width: "50%" }}>
//                     <Form.Label>Address</Form.Label>
//                     <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter address" />
//                 </Form.Group>

//                 <Form.Group style={{ width: "50%" }}>
//                     <Form.Label>City</Form.Label>
//                     <Form.Control type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Enter city" />
//                 </Form.Group>

//                 <Form.Group style={{ width: "50%" }}>
//                     <Form.Label>State</Form.Label>
//                     <Form.Control type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Enter state" />
//                 </Form.Group>
//                 </div>
//                 <div className="text-center mt-4">
//                     <Button type="submit" style={{ backgroundColor: '#299d92', border: 'none' }} >
//                          Book Hostel
//                     </Button>
//                 </div>
//             </Form>
//         </Container>
//     );
// }











// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Button, Container, Form } from "react-bootstrap";


// export default function HostelManagement () {
//   const [rooms, setRooms] = useState([]);
//   const [loadingRooms, setLoadingRooms] = useState(true);
//   const [roomError, setRoomError] = useState("");

//   const [formData, setFormData] = useState({
//     room_number: "",
//     food_status: "With Food",
//     stay_from: "",
//     stay_duration: "",
//     first_name: "",
//     last_name: "",
//     gender: "Male",
//     phone: "",
//     email: "",
//     guardian_name: "",
//     guardian_relation: "",
//     guardian_contact_no: "",
//     address: "",
//     city: "",
//     state: "",
//   });

//   const [bookingMessage, setBookingMessage] = useState("");
//   const [bookingError, setBookingError] = useState("");
//   const [loadingBooking, setLoadingBooking] = useState(false);

//   // Fetch Available Rooms
//   useEffect(() => {
   
//     const fetchRooms = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/available_rooms");
//         if (response.data.statuscode === 200) {
//           setRooms(response.data.available_rooms);
//         } else {
//           setRoomError("No available rooms found.");
//         }
//       } catch (err) {
//         setRoomError("Error fetching rooms.");
//       } finally {
//         setLoadingRooms(false);
//       }
//     };

//     fetchRooms();
//   }, []);

//   // Handle Input Change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle Form Submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoadingBooking(true);
//     setBookingError("");
//     setBookingMessage("");
//     formData.stay_duration = parseInt(formData.stay_duration);
//     formData.room_number = parseInt(formData.room_number);

//     try {
//       const response = await axios.post("http://localhost:5000/api/book_hostel", formData);
//       if (response.data.statuscode === 200) {
//         setBookingMessage("Hostel booked successfully!");
//       } else {
//         setBookingError(response.data.error || "Booking failed.");
//       }
//     } catch (err) {
//       setBookingError("Error booking hostel. Please try again.");
//     } finally {
//       setLoadingBooking(false);
//     }
//   };

//   return (
//     <>
//     <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
//       <h1>Hostel Management System</h1>

//       {/* Available Rooms Section */}
//       <h2>Available Rooms</h2>
//       <h2>Available Rooms</h2>
// {loadingRooms ? (
//     <p>Loading...</p>
// ) : roomError ? (
//     <p style={{ color: "red" }}>{roomError}</p>
// ) : Array.isArray(rooms) && rooms.length > 0 ? (
//     <ul>
//         {rooms.map((room, index) => (
//             <li key={index}>
//                 Room {room.room_number} - Capacity: {room.capacity}, ₹{room.per_day} per day
//             </li>
//         ))}
//     </ul>
// ) : (
//     <p>No rooms available</p>
// )}


//       {/* Booking Form Section */}
//       <h2>Book Hostel</h2>
//       <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//         <input type="text" name="room_number" placeholder="Room Number" value={formData.room_number} onChange={handleChange} required />
//         <select name="food_status" value={formData.food_status} onChange={handleChange}>
//           <option value="With Food">With Food</option>
//           <option value="Without Food">Without Food</option>
//         </select>
//         <h5 className="mb-3">Room Details</h5>
//         <input type="date" name="stay_from" value={formData.stay_from} onChange={handleChange} required />
//         <input type="number" name="stay_duration" placeholder="Stay Duration (days)" value={formData.stay_duration} onChange={handleChange} required />
//         <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
//         <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
//         <select name="gender" value={formData.gender} onChange={handleChange}>
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//           <option value="Other">Other</option>
//         </select>
//         <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
//         <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
//         <input type="text" name="guardian_name" placeholder="Guardian Name" value={formData.guardian_name} onChange={handleChange} required />
//         <input type="text" name="guardian_relation" placeholder="Guardian Relation" value={formData.guardian_relation} onChange={handleChange} required />
//         <input type="text" name="guardian_contact_no" placeholder="Guardian Contact No" value={formData.guardian_contact_no} onChange={handleChange} required />
//         <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
//         <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
//         <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
//         <button type="submit" disabled={loadingBooking}>{loadingBooking ? "Booking..." : "Book Hostel"}</button>
//       </form>

//       {/* Success & Error Messages */}
//       {bookingMessage && <p style={{ color: "green" }}>{bookingMessage}</p>}
//       {bookingError && <p style={{ color: "red" }}>{bookingError}</p>}
//     </div>
//     </>
//   );
// };















































// import React, { useState } from "react";
// import axios from "axios";
// import { Button, Container, Form } from "react-bootstrap";

// export default function Feedback() {
//     const API_URL = "http://127.0.0.1:5000/api/book_hostel"; // Backend API URL


//     const [formData, setFormData] = useState({
//         room_no: "",
//         seater: "",
//         stay_duration: "",
//         stay_from: "",
//         food_status: "",
//         fees: "",
//         first_name: "",
//         last_name: "",
//         gender: "",
//         phone: "",
//         email: "",
//         guardian_name: "",
//         guardian_contact_no: "",
//         guardian_relation: "",
//         address: "",
//         city: "",
//         state: "",

//     });

//     // Handle Input Change
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage("");

//         try {
//             const response = await axios.post(API_URL, formData, {
//                 headers: {
//                     "Content-Type": "application/json",
//                 }
//             });

//             if (response.status === 201 || response.status === 200) {
//                 setMessage("Booking successful! ✅");
//                 setFormData({
//                     room_no: "",
//                     seater: "",
//                     stay_duration: "",
//                     stay_from: "",
//                     food_status: "",
//                     fees: "",
//                     first_name: "",
//                     last_name: "",
//                     gender: "",
//                     phone: "",
//                     email: "",
//                     guardian_name: "",
//                     guardian_contact_no: "",
//                     guardian_relation: "",
//                     address: "",
//                     city: "",
//                     state: "",
//                 });
//             }
//         } catch (error) {
//             setMessage("Error: " + (error.response?.data?.message || "Something went wrong! ❌"));
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <Container className="bookhostel">
//                 <h2 className="text-center">Hostel Booking Form </h2>
//                 <Form onSubmit={handleSubmit}>
//                     <h5 className="mb-3">Room Details</h5>

//                     {/* Room Number & Type */}
//                     <div className="d-flex gap-3">
//                         <Form.Group style={{ width: "50%" }}>
//                             <Form.Label>Room Number</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="roomNo"
                                
//                                 onChange={handleChange}
//                                 placeholder="Enter room number" />
//                         </Form.Group>

//                         <Form.Group style={{ width: "50%" }}>
//                             <Form.Label>Room Type</Form.Label>
//                             <Form.Select name="roomType" onChange={handleChange}>
//                                 <option value="">Select Room Type</option>
//                                 <option value="single">Single</option>
//                                 <option value="double">Double</option>
//                                 <option value="suite">Suite</option>
//                             </Form.Select>
//                         </Form.Group>
//                         <Form.Group style={{ width: "50%" }}>
//                             <Form.Label>Select of Seats</Form.Label>
//                             <Form.Select name="roomType" onChange={handleChange}>
//                                 <option value="single">Single</option>
//                                 <option value="double">Double</option>
//                                 <option value="double">triple</option>
//                                 <option value="suite">Suite</option>
//                             </Form.Select>
//                         </Form.Group>
//                     </div>

//                     {/* Stay From & Food Status */}
//                     <div className="d-flex gap-3 mt-3">

//                         <Form.Group style={{ width: "50%" }}>
//                             <Form.Label>Duration of stay</Form.Label>
//                             <Form.Control type="text" name="duration" onChange={handleChange} placeholder="Enter duration of stay" />
//                         </Form.Group>
//                         <Form.Group style={{ width: "50%" }}>
//                             <Form.Label>Stay From</Form.Label>
//                             <Form.Control
//                                 type="date"
//                                 name="stayFrom"
//                                 onChange={handleChange} />
//                         </Form.Group>

//                         <Form.Group style={{ width: "50%" }}>
//                             <Form.Label>Food status</Form.Label>
//                             <Form.Select name="foodStatus" onChange={handleChange}>
//                                 <option value="included">Included</option>
//                                 <option value="not_included">Not Included</option>
//                             </Form.Select>
//                         </Form.Group>
//                     </div>

//                     {/* Course & Fee */}
//                     <div className="d-flex gap-3 mt-3">
//                         <Form.Group >
//                             <Form.Label>Fees ($)</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="Fees"
//                                 value={formData.first_name}
//                                 onChange={handleChange}
//                                 placeholder="Enter fees" />
//                         </Form.Group>
//                     </div>

//                     <h5 className="mb-3 mt-3">Personal Information</h5>

//                     {/* Full Name */}
//                     <div className="d-flex gap-3 mt-3">
//                         <Form.Group style={{ width: "33%" }}>
//                             <Form.Label>First Name</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="firstName"
//                                 value={formData.first_name}
//                                 onChange={handleChange}
//                                 placeholder="Enter your first name" />
//                         </Form.Group>
//                         <Form.Group style={{ width: "33%" }}>
//                             <Form.Label>Last Name</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="lastName"
//                                 value={formData.last_name}
//                                 onChange={handleChange}
//                                 placeholder="Enter your last name" />
//                         </Form.Group>
//                     </div>
//                     {/* Gender, Contact, Email */}
//                     <div className="d-flex gap-3 mt-3">
//                         <Form.Group style={{ width: "33%" }}>
//                             <Form.Label>Gender</Form.Label>
//                             <Form.Select name="gender" onChange={handleChange}>
//                                 <option value="">Select Gender</option>
//                                 <option value="Male">Male</option>
//                                 <option value="Female">Female</option>
//                                 <option value="Other">Other</option>
//                             </Form.Select>
//                         </Form.Group>

//                         <Form.Group style={{ width: "33%" }}>
//                             <Form.Label>Contact Number</Form.Label>
//                             <Form.Control type="tel" name="contact" onChange={handleChange} placeholder="Enter your contact number" />
//                         </Form.Group>

//                         <Form.Group style={{ width: "33%" }}>
//                             <Form.Label>Email Address</Form.Label>
//                             <Form.Control type="email" name="email" onChange={handleChange} placeholder="Enter your email address" />
//                         </Form.Group>
//                     </div>
//                     <div className="d-flex gap-3 mt-3">
//                         <Form.Group style={{ width: "33%" }}>
//                             <Form.Label>Gardain Name</Form.Label>
//                             <Form.Control type="text" name="firstName" onChange={handleChange} placeholder="Enter gardain name" />
//                         </Form.Group>

//                         <Form.Group style={{ width: "33%" }}>
//                             <Form.Label>Gardain Number </Form.Label>
//                             <Form.Control type="text" name="middleName" onChange={handleChange} placeholder="Enter gardain number" />
//                         </Form.Group>

//                         <Form.Group style={{ width: "33%" }}>
//                             <Form.Label>gardain relation</Form.Label>
//                             <Form.Control type="text" name="lastName" onChange={handleChange} placeholder="Enter gardain relation" />
//                         </Form.Group>
//                     </div>



//                     <h5 className="mb-3 mt-3">Address Information</h5>

//                     {/* Address */}
//                     <div className="d-flex gap-3 mt-3">
//                         <Form.Group style={{ width: "50%" }}>
//                             <Form.Label>Street Address</Form.Label>
//                             <Form.Control type="text" name="street" onChange={handleChange} placeholder="Enter your street address" />
//                         </Form.Group>

//                         <Form.Group style={{ width: "50%" }}>
//                             <Form.Label>City</Form.Label>
//                             <Form.Control type="text" name="city" onChange={handleChange} placeholder="Enter your city" />
//                         </Form.Group>

//                         <Form.Group style={{ width: "50%" }}>
//                             <Form.Label>State/Province</Form.Label>
//                             <Form.Control type="text" name="state" onChange={handleChange} placeholder="Enter your state or province" />
//                         </Form.Group>
//                     </div>


//                     {/* Buttons */}
//                     <div className="text-center mt-4">
//                         <Button type="submit" variant="success">
//                             Save
//                         </Button>
//                         <Button variant="danger" className="ms-3">
//                             Cancel
//                         </Button>
//                     </div>
//                 </Form>
//             </Container>
//         </>
//     );
// };







// import React, { useState } from "react";
// import { Button, Container, Form, Row, Col } from "react-bootstrap";

// export default function HostelBookingForm() {
//     const [formData, setFormData] = useState({
//         roomNo: "",
//         roomType: "",
//         seaters: "",
//         duration: "",
//         stayFrom: "",
//         foodStatus: "",
//         dailyFee: "",
//         weeklyFee: "",
//         monthlyFee: "",
//         firstName: "",
//         middleName: "",
//         lastName: "",
//         gender: "",
//         contact: "",
//         email: "",
//         guardianName: "",
//         guardianNumber: "",
//         guardianRelation: "",
//         street: "",
//         city: "",
//         state: ""
//     });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         alert("Form Submitted ✅\n\n" + JSON.stringify(formData, null, 2));
//     };

//     return (
//         <Container className="bookhostel">
//             <h2 className="text-center mb-4">Hostel Booking Form</h2>
//             <Form onSubmit={handleSubmit}>
//                 <h5 className="mb-3">Room Details</h5>
//                 <Row className="mb-3">
//                     <Col md={4}>
//                         <Form.Group>
//                             <Form.Label>Room Number</Form.Label>
//                             <Form.Control type="text" name="roomNo" onChange={handleChange} required placeholder="Enter room number" />
//                         </Form.Group>
//                     </Col>
//                     <Col md={4}>
//                         <Form.Group>
//                             <Form.Label>Room Type</Form.Label>
//                             <Form.Select name="roomType" onChange={handleChange} required>
//                                 <option value="">Select Room Type</option>
//                                 <option value="single">Single</option>
//                                 <option value="double">Double</option>
//                                 <option value="suite">Suite</option>
//                             </Form.Select>
//                         </Form.Group>
//                     </Col>
//                     <Col md={4}>
//                         <Form.Group>
//                             <Form.Label>Number of Seats</Form.Label>
//                             <Form.Control type="text" name="seaters" onChange={handleChange} required placeholder="Enter number of seats" />
//                         </Form.Group>
//                     </Col>
//                 </Row>

//                 <h5 className="mb-3">Stay & Fees</h5>
//                 <Row className="mb-3">
//                     <Col md={4}>
//                         <Form.Group>
//                             <Form.Label>Duration of Stay</Form.Label>
//                             <Form.Control type="text" name="duration" onChange={handleChange} required placeholder="Enter duration (e.g., 6 months)" />
//                         </Form.Group>
//                     </Col>
//                     <Col md={4}>
//                         <Form.Group>
//                             <Form.Label>Stay From</Form.Label>
//                             <Form.Control type="date" name="stayFrom" onChange={handleChange} required />
//                         </Form.Group>
//                     </Col>
//                     <Col md={4}>
//                         <Form.Group>
//                             <Form.Label>Food Status</Form.Label>
//                             <Form.Select name="foodStatus" onChange={handleChange} required>
//                                 <option value="">Select</option>
//                                 <option value="included">Included</option>
//                                 <option value="not_included">Not Included</option>
//                             </Form.Select>
//                         </Form.Group>
//                     </Col>
//                 </Row>

//                 <Row className="mb-3">
//                     <Col md={4}>
//                         <Form.Group>
//                             <Form.Label>Daily Fee ($)</Form.Label>
//                             <Form.Control type="text" name="dailyFee" onChange={handleChange} required placeholder="Enter daily fee" />
//                         </Form.Group>
//                     </Col>
//                     <Col md={4}>
//                         <Form.Group>
//                             <Form.Label>Weekly Fee ($)</Form.Label>
//                             <Form.Control type="text" name="weeklyFee" onChange={handleChange} required placeholder="Enter weekly fee" />
//                         </Form.Group>
//                     </Col>
//                     <Col md={4}>
//                         <Form.Group>
//                             <Form.Label>Monthly Fee ($)</Form.Label>
//                             <Form.Control type="text" name="monthlyFee" onChange={handleChange} required placeholder="Enter monthly fee" />
//                         </Form.Group>
//                     </Col>
//                 </Row>

//                 <h5 className="mb-3">Personal Information</h5>
//                 <Row className="mb-3">
//                     <Col md={4}>
//                         <Form.Group>
//                             <Form.Label>First Name</Form.Label>
//                             <Form.Control type="text" name="firstName" onChange={handleChange} required placeholder="Enter first name" />
//                         </Form.Group>
//                     </Col>
//                     <Col md={4}>
//                         <Form.Group>
//                             <Form.Label>Middle Name (Optional)</Form.Label>
//                             <Form.Control type="text" name="middleName" onChange={handleChange} placeholder="Enter middle name" />
//                         </Form.Group>
//                     </Col>
//                     <Col md={4}>
//                         <Form.Group>
//                             <Form.Label>Last Name</Form.Label>
//                             <Form.Control type="text" name="lastName" onChange={handleChange} required placeholder="Enter last name" />
//                         </Form.Group>
//                     </Col>
//                 </Row>

//                 <Row className="mb-3">
//                     <Col md={4}>
//                         <Form.Group>
//                             <Form.Label>Contact Number</Form.Label>
//                             <Form.Control type="tel" name="contact" onChange={handleChange} required placeholder="Enter contact number" />
//                         </Form.Group>
//                     </Col>
//                     <Col md={4}>
//                         <Form.Group>
//                             <Form.Label>Email Address</Form.Label>
//                             <Form.Control type="email" name="email" onChange={handleChange} required placeholder="Enter email address" />
//                         </Form.Group>
//                     </Col>
//                 </Row>

//                 <h5 className="mb-3">Address</h5>
//                 <Row className="mb-3">
//                     <Col md={4}>
//                         <Form.Group>
//                             <Form.Label>Street Address</Form.Label>
//                             <Form.Control type="text" name="street" onChange={handleChange} required placeholder="Enter street address" />
//                         </Form.Group>
//                     </Col>
//                     <Col md={4}>
//                         <Form.Group>
//                             <Form.Label>City</Form.Label>
//                             <Form.Control type="text" name="city" onChange={handleChange} required placeholder="Enter city" />
//                         </Form.Group>
//                     </Col>
//                 </Row>
//                 <div className="text-center mt-4">
//                     <Button type="submit" variant="primary">Submit</Button>
//                 </div>
//             </Form>
//         </Container>
//     );
// }
