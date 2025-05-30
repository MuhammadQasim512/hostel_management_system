import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ManageCourse() {
    const API_URL = "http://127.0.0.1:5000/api/courses";

    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({ course_name: "", course_code: "", course_duration: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    // Handle Form Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };




    const handleDelete = async (courseId) => {
        if (!window.confirm("Are you sure you want to delete this course?")) {
            return;
        }
    
        try {
            await axios.delete(`${API_URL}/${courseId}`);
            setMessage("Course deleted successfully!");
            fetchCourses();  // Refresh course list
        } catch (error) {
            console.error("Error deleting course:", error);
            setMessage("Failed to delete course.");
        }
    };
    





    // Fetch courses on component mount
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(API_URL);
            const fetchedCourses = Array.isArray(response.data) ? response.data : response.data.data;
            setCourses(fetchedCourses);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    // 🔹 Edit Course
    const handleEdit = (course) => {
        setFormData({
            course_name: course.course_name,
            course_code: course.course_code,
            course_duration: course.course_duration,
        });
        setSelectedCourseId(course.id);
        setShow(true);
    };

    // 🔹 Update Course (PUT API)
    const handleUpdate = async () => {
        if (!selectedCourseId) {
            setMessage("No course selected for update.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            await axios.put(`${API_URL}/${selectedCourseId}`, formData);
            setMessage("Course updated successfully!");
            setFormData({ course_name: "", course_code: "", course_duration: "" });
            await fetchCourses();
            setShow(false);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to update course.");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Add Course (POST API)
    const handleSubmit = async () => {
        formData.course_duration = parseInt(formData.course_duration);
        setLoading(true);
        setMessage("");

        try {
            await axios.post(API_URL, formData);
            setMessage("Course added successfully!");
            setFormData({ course_name: "", course_code: "", course_duration: "" });
            await fetchCourses();
            setShow(false);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to add course.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div style={{ marginTop: '100px', marginLeft: '10px', marginRight: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                <header className="d-flex justify-content-between align-items-center mb-2">
                    <h4 className="m-1 mb-4">Course Management</h4>
                    <div className="d-flex justify-content-end mb-2">
                        <input className="form-control" style={{ marginRight: '5px', width: '300px' }} type="text" placeholder="Search course by name" />
                        <button className="modal-btn" onClick={() => { setSelectedCourseId(null); setShow(true); }}>Add Course</button>
                    </div>

                    {/* Modal for Adding / Editing Course */}
                    <Modal show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false}>
                        <Modal.Header style={{ backgroundColor: '#299d92', color: '#fff' }}>
                            <Modal.Title>{selectedCourseId ? "Edit Course" : "Add Course"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control type="text" name="course_name" value={formData.course_name} placeholder="Enter course name" onChange={handleChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Code</Form.Label>
                                    <Form.Control type="text" name="course_code" value={formData.course_code} placeholder="Enter course code" onChange={handleChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Duration (weeks)</Form.Label>
                                    <Form.Control type="number" name="course_duration" value={formData.course_duration} placeholder="Enter duration" onChange={handleChange} />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShow(false)} style={{ backgroundColor: '#ae0000', color: '#fff' }}>Cancel</Button>
                            <Button variant="primary" style={{ backgroundColor: '#299d92', color: '#fff' }} onClick={selectedCourseId ? handleUpdate : handleSubmit}>
                                {loading ? "Saving..." : selectedCourseId ? "Update" : "Save"}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </header>

                {/* Table to Show Courses */}
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>#</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Name</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Code</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Duration</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length > 0 ? (
                            courses.map((course, index) => (
                                <tr key={course.id}>
                                    <th>{index + 1}</th>
                                    <td>{course.course_name}</td>
                                    <td>{course.course_code}</td>
                                    <td>{course.course_duration} weeks</td>
                                    <td>
                                        <button className="btn btn-warning mx-1" onClick={() => handleEdit(course)}><i className="fas fa-edit"></i></button>
                                        <button className="btn btn-danger mx-1"   onClick={() => handleDelete(course.id)}><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No courses found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div>
                <div>
                         <label className="me-2">Rows per page:</label>
                         <select className="form-select" style={{ width: '80px', display: 'inline-block', cursor: 'pointer' }}>
                             <option>5</option>
                             <option>10</option>
                             <option>15</option>
                             <option>20</option>
                         </select>
                     </div>
                 </div>
                 <nav aria-label="Page navigation example " style={{ float: 'right', marginTop: '-35px' }} >
                     <ul class="pagination">
                         <li class="page-item"><a class="page-link" href="#"> <i className="fas fa-chevron-left"></i></a></li>
                         <li class="page-item"><a class="page-link" href="#">1</a></li>
                         <li class="page-item"><a class="page-link" href="#">2</a></li>
                         <li class="page-item"><a class="page-link" href="#">3</a></li>
                         <li class="page-item"><a class="page-link" href="#"><i className="fas fa-chevron-right"></i></a></li>
                     </ul>
                 </nav>
            </div>
        </>
    );
}








































// import React, { useState, useEffect } from "react";
// import { Modal, Button, Form } from "react-bootstrap";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function ManageCourse() {
//     const API_URL = "http://127.0.0.1:5000/api/courses";

//     const [show, setShow] = useState(false);
//     const [formData, setFormData] = useState({ course_name: "", course_code: "", course_duration: "" });
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");
//     const [courses, setCourses] = useState([]);
//     const [selectedCourseId, setSelectedCourseId] = useState(null);






//     const handleEdit = (course) => {
//         setFormData({
//             course_name: course.course_name,
//             course_code: course.course_code,
//             course_duration: course.course_duration,
//         });
//         setSelectedCourseId(course.id);  // Set course ID for update
//         setShow(true);  // Open modal
//     };
    




//     const handleUpdate = async () => {
//         if (!selectedCourseId) {
//             setMessage("No course selected for update.");
//             return;
//         }
    
//         setLoading(true);
//         setMessage("");
    
//         try {
//             const response = await axios.put(`${API_URL}/${selectedCourseId}`, formData);
//             console.log("API Response:", response);
    
//             setMessage("Course updated successfully!");
//             setFormData({ course_name: "", course_code: "", course_duration: "" });
//             await fetchCourses(); // Refresh course list
//             setShow(false); // Hide modal after success
    
//         } catch (error) {
//             setMessage(error.response?.data?.message || "Failed to update course.");
//         } finally {
//             setLoading(false);
//         }
//     };
    




//     // Handle Form Input Change
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     // 🔹 GET API Call (Fetch Data on Component Load)
//     useEffect(() => {
//         fetchCourses();
//     }, []);

//     const fetchCourses = async () => {
//         try {
//             const response = await axios.get(API_URL);
//             console.log("API Response Data:", response.data);

//             // Ensure correct data extraction
//             const fetchedCourses = Array.isArray(response.data) ? response.data : response.data.data;
//             setCourses(fetchedCourses);
//         } catch (error) {
//             console.error("Error fetching courses:", error);
//         }
//     };


//      const handleSubmit = async () => {
//          formData.course_duration =  parseInt(formData.course_duration)
//          setLoading(true);  
//          setMessage(""); 

//          try {
//              const response = await axios.post(API_URL, formData);
//              console.log("API Response:", response);

//              setMessage("Course added successfully!");
//              setFormData({ course_name: "", course_code: "", course_duration: null });
//              setTimeout(() => setShow(false), 2000); // Hide modal after success

//          } catch (error) {
//              setMessage(error.response?.data?.message || "Failed to add course.");
//          } finally {
//              setLoading(false); // Stop Loader
//          }
//      };

//     return (
//         <>
//             <div style={{ marginTop: '100px', marginLeft: '10px', marginRight: '10px',maxHeight:'250px', overflowY:'auto' }}>
//                 <header className="d-flex justify-content-between align-items-center mb-2">
//                     <div>
//                         <h4 className="m-1 mb-4">Course Management</h4>
//                     </div>
//                     <div className="d-flex justify-content-end mb-2">
//                         <input
//                             className="form-control"
//                             style={{ marginRight: '5px', width: '300px' }}
//                             type="text"
//                             placeholder="Search course by name"
//                         />
//                         <button className="modal-btn" onClick={() => setShow(true)}>Add Course</button>
//                     </div>

//                     {/* Modal for Adding Course */}
//                     <Modal show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false}>
//                         <Modal.Header style={{ backgroundColor: '#299d92', color: '#fff' }}>
//                             <Modal.Title>Add Course</Modal.Title>
//                         </Modal.Header>
//                         <Modal.Body>
//                             <Form>
//                                 <Form.Group>
//                                     <Form.Label>Full Name</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="course_name"
//                                         value={formData.course_name}
//                                         placeholder="Enter course name"
//                                         onChange={handleChange}
//                                     />
//                                 </Form.Group>
//                                 <Form.Group>
//                                     <Form.Label>Code</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="course_code"
//                                         value={formData.course_code}
//                                         placeholder="Enter course code"
//                                         onChange={handleChange}
//                                     />
//                                 </Form.Group>
//                                 <Form.Group>
//                                     <Form.Label>Duration (weeks)</Form.Label>
//                                     <Form.Control
//                                         type="number"
//                                         name="course_duration"
//                                         value={formData.course_duration}
//                                         placeholder="Enter duration"
//                                         onChange={handleChange}
//                                     />
//                                 </Form.Group>
//                             </Form>
//                         </Modal.Body>
//                         <Modal.Footer>
//                             <Button variant="secondary" onClick={() => setShow(false)} style={{ backgroundColor: '#ae0000', color: '#fff' }}>
//                                 Cancel
//                             </Button>
//                             <Button variant="primary" style={{ backgroundColor: '#299d92', color: '#fff' }} 
//                             onClick={selectedCourseId ? handleUpdate : handleSubmit}>
//                                {loading ? "Saving..." : selectedCourseId ? "Update" : "Save"}
//                             </Button>
//                         </Modal.Footer>
//                     </Modal>
//                 </header>

//                 {/* Table to Show Courses */}
//                 <table className="table table-striped table-bordered">
//                     <thead>
//                         <tr>
//                             <th style={{ backgroundColor: '#299d92', color: '#fff' }}>#</th>
//                             <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Name</th>
//                             <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Code</th>
//                             <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Duration</th>
//                             <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {courses.length > 0 ? (
//                             courses.map((course, index) => (
//                                 <tr key={course.id}>
//                                     <th>{index + 1}</th>
//                                     <td>{course.course_name}</td>
//                                     <td>{course.course_code}</td>
//                                     <td>{course.course_duration} weeks</td>
//                                     <td>
//                                         <button className="btn btn-warning mx-1"><i className="fas fa-edit"></i></button>
//                                         <button className="btn btn-danger mx-1"><i className="fas fa-trash"></i></button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="5" className="text-center">No courses found</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>

//                 {/* Pagination Controls */}
//                 <div>
//                     <label className="me-2">Rows per page:</label>
//                     <select className="form-select" style={{ width: '80px', display: 'inline-block', cursor: 'pointer' }}>
//                         <option>5</option>
//                         <option>10</option>
//                         <option>15</option>
//                         <option>20</option>
//                     </select>
//                 </div>
//                 <nav aria-label="Page navigation example" style={{ float: 'right', marginTop: '-35px' }}>
//                     <ul className="pagination">
//                         <li className="page-item"><a className="page-link" href="#"><i className="fas fa-chevron-left"></i></a></li>
//                         <li className="page-item"><a className="page-link" href="#">1</a></li>
//                         <li className="page-item"><a className="page-link" href="#">2</a></li>
//                         <li className="page-item"><a className="page-link" href="#">3</a></li>
//                         <li className="page-item"><a className="page-link" href="#"><i className="fas fa-chevron-right"></i></a></li>
//                     </ul>
//                 </nav>
//             </div>
//         </>
//     );
// }






















// import React, { useState, useEffect } from "react";
// import { Modal, Button, Form } from "react-bootstrap";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function ManageCourse() {
//     const API_URL = "http://127.0.0.1:5000/api/courses";

//     const [show, setShow] = useState(false);
//     const [formData, setFormData] = useState({ course_name: "", course_code: "", course_duration: null });
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");

//     // Handle Form Input Change
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };
    


//     const handleSubmit = async () => {
//         formData.course_duration = parseInt(formData.course_duration)
//         setLoading(true);
//         setMessage("");

//         try {
//             const response = await axios.post(API_URL, formData);
//             console.log("API Response:", response);

//             setMessage("Course added successfully!");
//             setFormData({ course_name: "", course_code: "", course_duration: null });
//             setTimeout(() => setShow(false), 2000); // Hide modal after success

//         } catch (error) {
//             setMessage(error.response?.data?.message || "Failed to add course.");
//         } finally {
//             setLoading(false); // Stop Loader
//         }
//     };

//     return (


//         <>
//             <div style={{ marginTop: '100px', marginLeft: '10px', marginRight: '10px' }}>
//                 <header className="d-flex justify-content-between align-items-center mb-2">
//                     <div>
//                         <h4 className=" m-1 mb-4">Course Management</h4>
//                     </div>
//                     <div className="d-flex justify-content-end mb-2">
//                         <input className="form-control  " style={{ marginRight: '5px', width: '300px' }} type="text" placeholder="Search course by name" />
//                         <button className="modal-btn" onClick={() => setShow(true)}>Add course</button>

//                     </div>

//                     <Modal show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false}>
//                         <Modal.Header style={{ backgroundColor: '#299d92', color: '#fff' }}>
//                             <Modal.Title>Add Course</Modal.Title>
//                         </Modal.Header>
//                         <Modal.Body>
//                             <Form>
//                                 <Form.Group>
//                                     <Form.Label>Full Name</Form.Label>
//                                     <Form.Control type="text"
//                                         name="course_name"
//                                         value={formData.course_name}
//                                         placeholder="Enter your name" onChange={handleChange} />
//                                 </Form.Group>
//                                 <Form.Group>
//                                     <Form.Label>Code</Form.Label>
//                                     <Form.Control type="text"
//                                         name="course_code"
//                                         value={formData.course_code}
//                                         placeholder="Enter cours code" onChange={handleChange} />
//                                 </Form.Group>
//                                 <Form.Group>
//                                     <Form.Label>Duration</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="course_duration"
//                                         value={formData.course_duration}
//                                         placeholder="Enter your duration" onChange={handleChange} />
//                                 </Form.Group>
//                             </Form>
//                         </Modal.Body>
//                         <Modal.Footer>
//                             <Button variant="secondary" onClick={() => setShow(false)} style={{ backgroundColor: '#ae0000', color: '#fff' }}>
//                                 Cancel
//                             </Button>
//                             <Button variant="primary" style={{ backgroundColor: '#299d92', color: '#fff' }} onClick={handleSubmit} >Save </Button>
//                         </Modal.Footer>
//                     </Modal>
//                 </header>
//                 <table className="table table-striped table-bordered">
//                     <thead>
//                         <tr>
//                             <th scope="col" style={{ backgroundColor: '#299d92', color: '#fff' }}>#</th>
//                             <th scope="col" style={{ backgroundColor: '#299d92', color: '#fff' }}>Name</th>
//                             <th scope="col" style={{ backgroundColor: '#299d92', color: '#fff' }}>Code</th>
//                             <th scope="col" style={{ backgroundColor: '#299d92', color: '#fff' }}>Duration</th>
//                             <th scope="col" style={{ backgroundColor: '#299d92', color: '#fff' }}>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                             <th scope="row">1</th>
//                             <td>Mark</td>
//                             <td>Otto</td>
//                             <td>@mdo</td>
//                             <td>
//                                 <button className="edit" ><i className="fas fa-edit"></i></button>
//                                 <button className="delete" ><i className="fas fa-trash"></i></button>
//                             </td>
//                         </tr>
//                         <tr>
//                             <th scope="row">1</th>
//                             <td>Mark</td>
//                             <td>Otto</td>
//                             <td>@mdo</td>
//                             <td>
//                                 <button className="edit" ><i className="fas fa-edit"></i></button>
//                                 <button className="delete"><i className="fas fa-trash"></i></button>
//                             </td>
//                         </tr>
//                         <tr>
//                             <th scope="row">1</th>
//                             <td>Mark</td>
//                             <td>Otto</td>
//                             <td>@mdo</td>
//                             <td>
//                                 <button className="edit" ><i className="fas fa-edit"></i></button>
//                                 <button className="delete"><i className="fas fa-trash"></i></button>
//                             </td>
//                         </tr>
//                     </tbody>
//                 </table>
//                 <div>
//                     <div>
//                         <label className="me-2">Rows per page:</label>
//                         <select className="form-select" style={{ width: '80px', display: 'inline-block', cursor: 'pointer' }}>
//                             <option>5</option>
//                             <option>10</option>
//                             <option>15</option>
//                             <option>20</option>
//                         </select>
//                     </div>
//                 </div>
//                 <nav aria-label="Page navigation example " style={{ float: 'right', marginTop: '-35px' }} >
//                     <ul class="pagination">
//                         <li class="page-item"><a class="page-link" href="#"> <i className="fas fa-chevron-left"></i></a></li>
//                         <li class="page-item"><a class="page-link" href="#">1</a></li>
//                         <li class="page-item"><a class="page-link" href="#">2</a></li>
//                         <li class="page-item"><a class="page-link" href="#">3</a></li>
//                         <li class="page-item"><a class="page-link" href="#"><i className="fas fa-chevron-right"></i></a></li>
//                     </ul>
//                 </nav>

//             </div>
//         </>

//     )
// }

