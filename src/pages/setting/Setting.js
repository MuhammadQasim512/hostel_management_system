import React from "react";

export default function Setting() {
    return (
        <>
            <header>
                <div>
                    <h4>Courses</h4>
                </div>
                <div className="d-flex justify-content-end mb-2">
                    <input className="form-control w-25 " style={{ marginRight: '5px' }} type="text" placeholder="Search course by name" />
                    <button className="btn btn-success">Add Room</button>
                </div>
            </header>
            <table class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Code</th>
                        <th scope="col">Duration</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                        <td>
                            <button className="btn btn-primary m-1" ><i className="fas fa-edit"></i></button>
                            <button className="btn btn-danger"><i className="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                        <td>
                            <button className="btn btn-primary m-1" ><i className="fas fa-edit"></i></button>
                            <button className="btn btn-danger"><i className="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                        <td>
                            <button className="btn btn-primary m-1" ><i className="fas fa-edit"></i></button>
                            <button className="btn btn-danger"><i className="fas fa-trash"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <nav aria-label="Page navigation example " style={{ float: 'right' }} >
                <ul class="pagination">
                    <li class="page-item"><a class="page-link" href="#"> <i className="fas fa-chevron-left"></i></a></li>
                    <li class="page-item"><a class="page-link" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                    <li class="page-item"><a class="page-link" href="#"><i className="fas fa-chevron-right"></i></a></li>
                </ul>
            </nav>
        </>
    )
}