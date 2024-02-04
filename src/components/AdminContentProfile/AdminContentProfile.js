import './AdminContentProfile.css';
import { Link } from 'react-router-dom';


function AdminContentProfile(){
    return(
        <>
            <div className="container-fluid my-5">
                <div className="container text-light">
                    <div className="row gy-4">
                       <div className="card border-0 col-lg-4 text-white">
                            <img className="card-img rounded-3 " src="https://firebasestorage.googleapis.com/v0/b/academic-report-b725f.appspot.com/o/Assets%2F3368024.jpg?alt=media&token=a422c12a-2b92-4ab9-b78f-21f56ffd75bf" alt="Card"></img>
                            <div className="card-img-overlay ">
                                <h5 className="card-title mx-2 h1">Manage Courses</h5>
                                <div className="card-text mx-2 my-3">
                                    <ul>
                                        <li className="h5">Add New Course</li>
                                        <li className="h5">Modify Courses</li>
                                        <li className="h5">Delete Course</li>
                                    </ul>                             
                                 </div>
                            </div>
                            <Link  to="ManageCourses" className="stretched-link"></Link>
                        </div>
                        <div className="card border-0 col-lg-4 text-white">
                            <img className="card-img img-fluid rounded-3 " src="https://firebasestorage.googleapis.com/v0/b/academic-report-b725f.appspot.com/o/Assets%2Ftechnology-abstract-background-with-particle-lines.jpg?alt=media&token=3056633f-f059-402c-a1a6-05a2fad38903" alt="Card"></img>
                            <div className="card-img-overlay ">
                                <h5 className="card-title mx-2 h1">Manage Batches</h5>
                                <div className="card-text mx-2 my-3">
                                    <ul>
                                        <li className="h5">Add New Batch</li>
                                        <li className="h5">Assign Teachers</li>
                                        <li className="h5">Change Sem</li>
                                        <li className="h5">Assign Students</li>

                                    </ul>                             
                                 </div>
                            </div>
                            <Link  to="ManageBatches" className="stretched-link"></Link>
                        </div>
                        <div className="card border-0 col-lg-4 text-white">
                            <img className="card-img img-fluid rounded-3 " src="https://firebasestorage.googleapis.com/v0/b/academic-report-b725f.appspot.com/o/Assets%2F3418448.jpg?alt=media&token=58676ddf-075f-42b4-b0bd-e5bc7b4fd9ec" alt="Card"></img>
                            <div className="card-img-overlay ">
                                <h5 className="card-title mx-2 h1">Manage Students</h5>
                                <div className="card-text mx-2 my-3">
                                    <ul>
                                        <li className="h5">Add New Student</li>
                                        {/* <li className="h5">Migrate Student</li> */}
                                        <li className="h5">Student Details</li>
                                        <li className="h5">Modify Student Details</li>
                                        <li className="h5">Remove Student</li>

                                    </ul>                             
                                 </div>
                            </div>
                            <Link  to="ManageStudents" className="stretched-link"></Link>
                        </div>
                        <div className="card border-0 col-lg-4 text-white">
                            <img className="card-img img-fluid rounded-3 " src="https://firebasestorage.googleapis.com/v0/b/finalyearproject22-6db2e.appspot.com/o/Assets%2FAdminbg4.jpg?alt=media&token=4b90db29-33a9-4998-8368-f9a4c5ddc8ae" alt="Card"></img>
                            <div className="card-img-overlay ">
                                <h5 className="card-title mx-2 h1">Manage Teachers</h5>
                                <div className="card-text mx-2 my-3">
                                    <ul>
                                        <li className="h5">Add New Teacher</li>
                                        <li className="h5">Teacher Details</li>
                                        <li className="h5">Modify Teacher Details</li>
                                        <li className="h5">Remove Teacher</li>
                                    </ul>                             
                                 </div>
                            </div>
                            <Link  to="ManageTeachers" className="stretched-link"></Link>
                        </div>
                        <div className="card border-0 col-lg-4 text-white">
                            <img className="card-img img-fluid rounded-3 " src="https://firebasestorage.googleapis.com/v0/b/finalyearproject22-6db2e.appspot.com/o/Assets%2FAdminbg5.jpg?alt=media&token=9ceb2a11-a3c2-4482-8a78-5bc4e36b6830" alt="Card"></img>
                            <div className="card-img-overlay ">
                                <h5 className="card-title mx-2 h1">Manage Assesment</h5>
                                <div className="card-text mx-2 my-3">
                                    <ul>
                                        <li className="h5">Manage CA</li>
                                        <li className="h5">Managa PA</li>
                                    </ul>                             
                                 </div>
                            </div>
                            <Link  to="ManageAssesment" className="stretched-link"></Link>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export { AdminContentProfile };