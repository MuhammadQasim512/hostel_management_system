import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// Accept link and custom color
const DashboardCard = ({ title, items, link, color }) => {
  return (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <div
        style={{
          backgroundColor: '#ffffff',
          height: '220px',
          width: '100%',
          padding: '16px',
          borderRadius: '16px',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease',
          borderLeft: `6px solid ${color}`,
          cursor: 'pointer'
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f4f7fa')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
      >
        <h4
          style={{
            textAlign: 'center',
            marginBottom: '10px',
            color: '#333',
            fontSize: '18px'
          }}
        >
          {title}
        </h4>
        <div style={{ lineHeight: '1.8', paddingLeft: '10px' }}>
          {items.map((item, index) => (
            <div key={index} style={{ fontWeight: '500', color: '#444' }}>
              • {item}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default function AdminDashboard() {
  const [feedbackCount, setFeedbackCount] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/feedback", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = Array.isArray(response.data) ? response.data : response.data.data;
        setFeedbackCount(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setFeedbackCount();
      }
    };

    fetchFeedbacks();
  }, [token]);

  const [complaintCount, setComplaintCount] = useState()
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/complaints", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = Array.isArray(response.data) ? response.data : response.data.data;
        setComplaintCount(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error("Error fetching complaint:", error);
        setComplaintCount();
      }
    };

    fetchComplaints();
  }, [token]);

  const [UsersCount, setUsersCount] = useState()
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/user_management", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = Array.isArray(response.data) ? response.data : response.data.data;
        setUsersCount(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error("Error fetching complaint:", error);
        setUsersCount();
      }
    };

    fetchUsers();
  }, [token]);

  const [studentsCount, setStudentsCount] = useState(0)
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/get_students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = Array.isArray(response.data) ? response.data : response.data.data;
        setStudentsCount(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error("Error fetching coustomer:", error);
        setStudentsCount();
      }
    };

    fetchStudents();
  }, [token]);

  const [roomsSummary, setRoomsSummary] = useState({
    total: 0,
    available: 0,
    booked: 0,
    maintenance: 0,
    accupied: 0
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/room", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const rooms = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        const summary = {
          total: rooms.length,
          available: rooms.filter(r => r.status === 'available').length,
          booked: rooms.filter(r => r.status === 'booked').length,
          maintenance: rooms.filter(r => r.status === 'maintenance').length,
          accupied: rooms.filter(r => r.status === 'accupied').length,
        };

        setRoomsSummary(summary);
      } catch (error) {
        console.error("Error fetching room:", error);
        setRoomsSummary({ total: 0, available: 0, booked: 0, maintenance: 0, accupied:0 });
      }
    };

    fetchRooms();
  }, [token]);


  const cards = [
    {
      title: "Room Status",
      items: [
        `Total Rooms: ${roomsSummary.total}`,
        `Available: ${roomsSummary.available}`,
        `Booked: ${roomsSummary.booked}`,
        `Maintenance: ${roomsSummary.maintenance}`,
        `accupied: ${roomsSummary.accupied}`
      ],
      link: "/manage-room",
      color: "#4CAF50"
    },

    {
      title: "Customer Management",
      items: [`Total Customers: ${studentsCount}`],
      link: "/manage-students",
      color: "#2196F3" // blue
    },
    {
      title: "Complaints",
      items: [`Total Complaints: ${complaintCount}`],
      link: "/complaints",
      color: "#f44336" // red
    },
    {
      title: "Feedback",
      items: [`Total Feedbacks: ${feedbackCount}`],
      link: "/feedback",
      color: "#FF9800" // orange
    },
    {
      title: "User Management",
      items: [`Total Users: ${UsersCount}`],
      link: "/user-management",
      color: "#9C27B0" // purple
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '24px',
        padding: '30px',
        backgroundColor: '#f0f2f5',
        minHeight: '100vh'
      }}
    >
      {cards.map((card, index) => (
        <DashboardCard
          key={index}
          title={card.title}
          items={card.items}
          link={card.link}
          color={card.color}
        />
      ))}
    </div>
  );
}
