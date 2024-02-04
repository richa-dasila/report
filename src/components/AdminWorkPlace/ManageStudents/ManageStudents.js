import './ManageStudents.css';
import { BackButton } from "../../BackButton/BackButton";
import { getAuth,onAuthStateChanged} from "firebase/auth";
import { getDatabase , ref, child, get,set, remove} from "firebase/database";
import {app} from "../../../Firebase/firebase";
import { useEffect } from 'react'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { showModal } from '../../MainModal/MainModal';







function ManageStudents(){

    let navigate=useNavigate();
    const [role, setRole] = useState(undefined);
    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const uid = user.uid;
            let db=ref(getDatabase(app));
            get(child(db, `users/${uid}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    setRole(snapshot.val().role);

                } else {
                console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });

          } else {
          }
        });
    },
    []);

    if(role===`admin`)
    return(
        <>
            <BackButton/>
            <div className='container-fluid'>
                <div className='container d-inline-block h1 ms-4 text-primary my-3 mb-4'>
                   <em id="heading"> Manage Students</em>
                </div>
            </div>
            <div className="container-fluid p-3 px-5">
                <div className="accordion accordion-flush" id="ManageStudentAccordion">
                    <div className="accordion-item mb-5">
                        <h2 className="accordion-header" id="NewStudentHeader">
                            <button className="accordion-button rounded-3 collapsed text-white fs-3 " type="button" data-bs-toggle="collapse" data-bs-target="#NewStudentBody" aria-expanded="false" aria-controls="NewStudentBody">
                                Add New Student
                            </button>
                        </h2>
                        <div id="NewStudentBody" className="accordion-collapse collapse" aria-labelledby="NewStudentHeader" data-bs-parent="#ManageStudentAccordion">
                            <div className="accordion-body">
                            <form className="container">
                                <div className="my-3 mx-3 h5 text-success">
                                    Add Student Details
                                </div>
                                    <div className="row">
                                        <div className="col-md-6  p-2">
                                            <div className="input-group  ">
                                            <input id="studentemail" type="email" className="form-control" placeholder="Registered Student Email" aria-label="Student Email"></input>

                                            </div>
                                        </div>
                                        <div className="col-md-6 p-2">
                                        <div className="input-group ">
                                        <input id="studentroll" type="number" className="form-control" placeholder="Roll Number" aria-label="Roll Number"></input>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6  p-2">
                                            <div className="input-group  ">
                                            <input id="studentname" type="text" className="form-control" placeholder="Student Name" aria-label="Student Name"></input>
                                            </div>
                                        </div>
                                        <div className="col-md-6 p-2">
                                        <div className="input-group ">
                                                <label className="input-group-text" htmlFor="studentdept">Student Department</label>
                                                <select defaultValue={"Information Technology"} className="form-select" id="studentdept">
                                                <option value="Information Technology">Information Technology</option>
                                                    <option value="Computer Science">Computer Science</option>
                                                    <option value="Electrical Engineering">Electrical Engineering</option>
                                                    <option value="Electrical & Communication Engineering">Electrical & Communication Engineering</option>
                                                    <option value="Applied Electronics">Applied Electronics</option>
                                                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="container text-center mt-3">
                                        <button onClick={()=>{
                                            addStudent(document.getElementById("studentroll").value,document.getElementById("studentemail").value,document.getElementById("studentname").value,document.getElementById("studentdept").value)
                                        }} className="btn btn-primary btn-lg">Add Student</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* <div className="accordion-item mb-5">
                        <h2 className="accordion-header" id="MigrateStudentHeader">
                        <button className="accordion-button collapsed rounded-3 text-white fs-3 " type="button" data-bs-toggle="collapse" data-bs-target="#MigrateStudentBody" aria-expanded="false" aria-controls="MigrateStudentBody">
                            Migrate Student
                        </button>
                        </h2>
                        <div id="MigrateStudentBody" className="accordion-collapse collapse" aria-labelledby="MigrateStudentHeader" data-bs-parent="#ManageStudentAccordion">
                            <div className="accordion-body">

                            </div>
                        </div>
                    </div> */}
                    <div className="accordion-item mb-5">
                        <h2 className="accordion-header" id="StudentDetailsHeader">
                        <button className="accordion-button collapsed rounded-3 text-white fs-3 " type="button" data-bs-toggle="collapse" data-bs-target="#StudentDetailsBody" aria-expanded="false" aria-controls="StudentDetailsBody">
                            Student Details
                        </button>
                        </h2>
                        <div id="StudentDetailsBody" className="accordion-collapse collapse" aria-labelledby="StudentDetailsHeader" data-bs-parent="#ManageStudentAccordion">
                            <div className="accordion-body">
                            <form className="container">
                                <div className="my-3 mx-3 h5 text-success">
                                    Enter Student Roll Number
                                </div>
                                <div className="row">
                                    <div className="col-md-6  p-2">
                                        <div className="input-group  ">
                                            <input id="studentsearchroll" type="number" className="form-control" placeholder="Student unique Rollno" aria-label="Student unique Rollno"></input>

                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-center">
                                                <button onClick={()=>{
                                                    studentdetails(document.getElementById("studentsearchroll").value);
                                                }} className="btn btn-primary btn-lg"> Show Details</button>
                                        </div>                                
                                    </div>
                                </div>

                            </form>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item mb-5">
                        <h2 className="accordion-header" id="ModifyStudentHeader">
                        <button className="accordion-button collapsed rounded-3 text-white fs-3 " type="button" data-bs-toggle="collapse" data-bs-target="#ModifyStudentBody" aria-expanded="false" aria-controls="ModifyStudentBody">
                            Modify Student Details
                        </button>
                        </h2>
                        <div id="ModifyStudentBody" className="accordion-collapse collapse" aria-labelledby="ModifyStudentHeader" data-bs-parent="#ManageStudentAccordion">
                            <div className="accordion-body">
                            <form className="container">
                                <div className="my-3 mx-3 h5 text-success">
                                    Enter Student Roll Number
                                </div>
                                <div className="row">
                                    <div className="col-md-6  p-2">
                                        <div className="input-group  ">
                                            <input id="studentmodifyroll" type="number" className="form-control" placeholder="Student unique Rollno" aria-label="Student unique Rollno"></input>

                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-center">
                                                <button onClick={()=>{
                                                    Modifyform(document.getElementById("studentmodifyroll").value);
                                                }} className="btn btn-primary btn-lg"> Show Details</button>
                                        </div>                                
                                    </div>
                                </div>
                            </form>
                            <form className="container" id='modifycontainer'>
                                <div className="my-3 mx-3 h5 text-success">
                                    Modify Student Details
                                </div>
                                    <div className="row">
                                        <div className="col-md-6  p-2">
                                            <div className="input-group  ">
                                            <label className="input-group-text" htmlFor="modifystudentemail">Student Email</label>
                                            <input id="modifystudentemail" disabled={true} type="email" className="form-control" placeholder="Registered Student Email" aria-label="Student Email"></input>

                                            </div>
                                        </div>
                                        <div className="col-md-6 p-2">
                                        <div className="input-group ">
                                        <label className="input-group-text" htmlFor="modifystudentroll">Student Roll</label>
                                        <input id="modifystudentroll" type="number" disabled={true} className="form-control" placeholder="Roll Number" aria-label="Roll Number"></input>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6  p-2">
                                            <div className="input-group  ">
                                            <label className="input-group-text" htmlFor="modifystudentname">Student Name</label>
                                            <input id="modifystudentname" type="text" className="form-control" placeholder="Student Name" aria-label="Student Name"></input>
                                            </div>
                                        </div>
                                        <div className="col-md-6 p-2">
                                        <div className="input-group ">
                                                <label className="input-group-text" htmlFor="modifystudentdept">Student Department</label>
                                                <select defaultValue={"Computer Science"} className="form-select" id="modifystudentdept">
                                                <option value="Information Technology">Information Technology</option>
                                                    <option value="Computer Science">Computer Science</option>
                                                    <option value="Electrical Engineering">Electrical Engineering</option>
                                                    <option value="Electrical & Communication Engineering">Electrical & Communication Engineering</option>
                                                    <option value="Applied Electronics">Applied Electronics</option>
                                                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="container text-center mt-3">
                                        <button onClick={()=>{
                                            modifydetails();
                                        }} className="btn btn-primary btn-lg">Modify</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item mb-5">
                        <h2 className="accordion-header" id="RemoveStudentHeader">
                        <button className="accordion-button collapsed rounded-3 text-white fs-3 " type="button" data-bs-toggle="collapse" data-bs-target="#RemoveStudentBody" aria-expanded="false" aria-controls="RemoveStudentBody">
                            Remove Student
                        </button>
                        </h2>
                        <div id="RemoveStudentBody" className="accordion-collapse collapse" aria-labelledby="RemoveStudentHeader" data-bs-parent="#ManageStudentAccordion">
                            <div className="accordion-body">
                            <form className="container">
                                <div className="my-3 mx-3 h5 text-success">
                                    Enter Student Roll Number
                                </div>
                                <div className="row">
                                    <div className="col-md-6  p-2">
                                        <div className="input-group  ">
                                            <input id="studentdeleteroll" type="number" className="form-control" placeholder="Student unique Rollno" aria-label="Student unique Rollno"></input>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-center">
                                                <button onClick={()=>{
                                                    Deleteform(document.getElementById("studentdeleteroll").value);
                                                }} className="btn btn-primary btn-lg"> Show Details</button>
                                        </div>                                
                                    </div>
                                </div>
                            </form>
                            <form className="container" id='deletecontainer'>
                                <div className="my-3 mx-3 h5 text-success">
                                    Student Details
                                </div>
                                    <div className="row">
                                        <div className="col-md-6  p-2">
                                            <div className="input-group  ">
                                            <label className="input-group-text" htmlFor="deletestudentemail">Student Email</label>
                                            <input id="deletestudentemail" disabled={true} type="email" className="form-control" placeholder="Registered Student Email" aria-label="Student Email"></input>

                                            </div>
                                        </div>
                                        <div className="col-md-6 p-2">
                                        <div className="input-group ">
                                        <label className="input-group-text" htmlFor="deletestudentroll">Student Roll</label>
                                        <input id="deletestudentroll" type="number" disabled={true} className="form-control" placeholder="Roll Number" aria-label="Roll Number"></input>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6  p-2">
                                            <div className="input-group  ">
                                            <label className="input-group-text" htmlFor="deletestudentname">Student Name</label>
                                            <input id="deletestudentname" disabled={true} type="text" className="form-control" placeholder="Student Name" aria-label="Student Name"></input>
                                            </div>
                                        </div>
                                        <div className="col-md-6 p-2">
                                        <div className="input-group ">
                                            <label className="input-group-text" htmlFor="deletestudentdept">Student Department</label>
                                            <input id="deletestudentdept" disabled={true} type="text" className="form-control" placeholder="Student Department" aria-label="Student Department"></input>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="container text-center mt-3">
                                        <button onClick={()=>{
                                            Deletestudent();
                                        }} className="btn btn-primary btn-lg">Remove</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
    else if(role===`student` || role===`teacher`)
        navigate('/',{replace:true});
    else
    return(
        <>
        </>
    );
}


function Deleteform(roll){
    let db=ref(getDatabase(app));
    get(child(db, `students/${roll}/`)).then((snapshot) => {

        if(snapshot.val()===null){
            showModal(`Student not found`,`No Student with roll: ${roll} exists`)
        }
        else{
            get(child(db, `users/${snapshot.val().uid}/`)).then((snapshot) => {

                document.getElementById("deletestudentemail").value=snapshot.val().email;
                document.getElementById("deletestudentroll").value=snapshot.val().roll;
                document.getElementById("deletestudentname").value=snapshot.val().name;
                document.getElementById("deletestudentdept").value=snapshot.val().dept;
                document.getElementById("deletecontainer").style.display = "block";
            }).catch((error) => {
                console.error(error);
            });
        }
    }).catch((error) => {
        console.error(error);
    });
}

function Deletestudent(){
    let roll=document.getElementById("deletestudentroll").value;
    let db=ref(getDatabase(app));
    get(child(db, `students/${roll}/`)).then((snapshot) => {
        console.log(snapshot.val().uid)
        let db1=(getDatabase(app));
        remove(ref(db1,`users/${snapshot.val().uid}`));
        document.getElementById("deletecontainer").style.display = "none";
        showModal(``,`Student removed Successfully`);

    }).catch((error) => {
        console.error(error);
    });
}

function modifydetails(){
    let newemail=document.getElementById("modifystudentemail").value;
    let newroll=document.getElementById("modifystudentroll").value;
    let newname=document.getElementById("modifystudentname").value;
    let newdept=document.getElementById("modifystudentdept").value;
    let db=ref(getDatabase(app));
    get(child(db, `students/${newroll}/`)).then((snapshot) => {
        console.log(snapshot.val().uid)
        let db1=(getDatabase(app));
        set(ref(db1, `users/${snapshot.val().uid}/`), {
            uid:snapshot.val().uid,
            role:`student`,
            name:newname,
            dept:newdept,
            roll:newroll,
            email:newemail
            
        });
        document.getElementById("modifycontainer").style.display = "none";
        showModal(`Modify Student`,`Changed Student details succesfully`);
    }).catch((error) => {
        console.error(error);
    });
}

function Modifyform(roll){
    let db=ref(getDatabase(app));
    get(child(db, `students/${roll}/`)).then((snapshot) => {
        console.log(snapshot.val())
        if(snapshot.val()===null){
            showModal(`Student not found`,`No Student with roll: ${roll} exists`)
        }
        else{
            get(child(db, `users/${snapshot.val().uid}/`)).then((snapshot) => {
                console.log(snapshot.val())
                document.getElementById("modifystudentemail").value=snapshot.val().email;
                document.getElementById("modifystudentroll").value=snapshot.val().roll;
                document.getElementById("modifystudentname").value=snapshot.val().name;
                document.getElementById("modifystudentdept").value=snapshot.val().dept;
                document.getElementById("modifycontainer").style.display = "block";
            }).catch((error) => {
                console.error(error);
            });
        }
    }).catch((error) => {
        console.error(error);
    });
}


function studentdetails(roll){
    let db=ref(getDatabase(app));
    get(child(db, `students/${roll}/`)).then((snapshot) => {
        if(snapshot.val()===null){
            showModal(`Student not found`,`No Student with roll: ${roll} exists`)
        }
        else{
            get(child(db, `users/${snapshot.val().uid}/`)).then((snapshot) => {
                showModal(`Student Details`,`
                <div className='row mb-1 ms-3'><span><em>Name:</em> &nbsp;&nbsp;<span >${snapshot.val().name} </span></span></div>
                <div className='row mb-1 ms-3'><span><em>Department:</em> &nbsp;&nbsp;<span > ${snapshot.val().dept}</span></span></div>
                <div className='row mb-1 ms-3'><span><em>Roll no.:</em> &nbsp;&nbsp;<span >${snapshot.val().roll} </span></span></div>
                <div className='row mb-1 ms-3'><span><em>Email:</em> &nbsp;&nbsp;<span > ${snapshot.val().email}</span></span></div>
                `)

            }).catch((error) => {
                console.error(error);
            });
        }
    }).catch((error) => {
        console.error(error);
    });
}

function addStudent(sroll,semail,sname,sdept){
    console.log(`${sroll} ${semail} ${sname} ${sdept}`)
    let email=semail.split ("@");
    let db=ref(getDatabase(app));
    get(child(db, `students/`)).then((snapshot) => {
        let flag=0;
        for (const key in snapshot.val()) {
            console.log(key)
            if(sroll===key){
                flag=1;
            }
        }
        if(flag===1){
            showModal(`Student Cannot Be Added`,`Student with roll: ${sroll} already exists`);
        }
        else{
            get(child(db, `unassingedusers/`)).then((snapshot) => {
                for (const key in snapshot.val()) {
                    console.log(key)
                    if(email[0]===key){
                        flag=1;
                    }
                }
                if(flag===0){
                    showModal(`Student Cannot Be Added`,`${semail} is not linked to any PENDING account`);
                }
                else{
                    

                    get(child(db, `unassingedusers/${email[0]}`)).then((snapshot) => {
                        console.log(snapshot.val().uid)
                        let db=(getDatabase(app));
                        set(ref(db, `users/${snapshot.val().uid}/`), {
                            role:`student`,
                            uid:snapshot.val().uid,
                            name:sname,
                            dept:sdept,
                            roll:sroll,
                            email:semail

                        });
                        set(ref(db, `students/${sroll}/`), {
                            uid:snapshot.val().uid,
                        });
                        remove(ref(db,`unassingedusers/${email[0]}`));

                    }).catch((error) => {
                        console.error(error);
                    });


                    console.log(`hello`)
                }

            }).catch((error) => {
                console.error(error);
            });
        }
    }).catch((error) => {
        console.error(error);
    });
}

export { ManageStudents };