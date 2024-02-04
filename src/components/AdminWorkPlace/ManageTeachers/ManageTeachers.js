import './ManageTeacher.css';
import { getAuth,onAuthStateChanged} from "firebase/auth";
import { getDatabase , ref, child, get,set,remove,update} from "firebase/database";
import {app} from "../../../Firebase/firebase";
import { useEffect } from 'react'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BackButton } from "../../BackButton/BackButton";
import { showModal } from "../../MainModal/MainModal";


function ManageTeachers(){
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
                    console.log(snapshot.val().role);
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
                   <em id="heading"> Manage Teachers</em>
                </div>
            </div>
            <div className="container-fluid p-3 px-5">
                <div className="accordion accordion-flush" id="ManageTeacherAccordion">
                    <div className="accordion-item mb-5">
                        <h2 className="accordion-header" id="NewTeacherHeader">
                            <button className="accordion-button rounded-3 collapsed text-white fs-3 " type="button" data-bs-toggle="collapse" data-bs-target="#NewTeacherBody" aria-expanded="false" aria-controls="NewTeacherBody">
                                Add New Teacher
                            </button>
                        </h2>
                        <div id="NewTeacherBody" className="accordion-collapse collapse" aria-labelledby="NewTeacherHeader" data-bs-parent="#ManageTeacherAccordion">
                            <div className="accordion-body">
                            <form className="container">
                                <div className="my-3 mx-3 h5 text-success">
                                    Add Teacher Details
                                </div>
                                    <div className="row">
                                        <div className="col-md-6  p-2">
                                            <div className="input-group  ">
                                            <input id="teacheremail" type="email" className="form-control" placeholder="Registered Teacher Email" aria-label="Teacher Email"></input>

                                            </div>
                                        </div>
                                        <div className="col-md-6 p-2">
                                        <div className="input-group ">
                                        <input id="Teacherid" type="text" className="form-control" placeholder="Teacher ID" aria-label="Teacher ID"></input>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6  p-2">
                                            <div className="input-group  ">
                                            <input id="teachername" type="text" className="form-control" placeholder="Teacher Name" aria-label="Teacher Name"></input>
                                            </div>
                                        </div>
                                        <div className="col-md-6 p-2">
                                        <div className="input-group ">
                                                <label className="input-group-text" htmlFor="teacherdept">Student Department</label>
                                                <select defaultValue={"Information Technology"} className="form-select" id="teacherdept">
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
                                            addTeacher(document.getElementById("Teacherid").value,document.getElementById("teacheremail").value,document.getElementById("teachername").value,document.getElementById("teacherdept").value)
                                        }} className="btn btn-primary btn-lg">Add Teacher</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item mb-5">
                        <h2 className="accordion-header" id="TeacherDetailsHeader">
                        <button className="accordion-button collapsed rounded-3 text-white fs-3 " type="button" data-bs-toggle="collapse" data-bs-target="#TeacherDetailsBody" aria-expanded="false" aria-controls="TeacherDetailsBody">
                            Teacher Details
                        </button>
                        </h2>
                        <div id="TeacherDetailsBody" className="accordion-collapse collapse" aria-labelledby="TeacherDetailsHeader" data-bs-parent="#ManageTeacherAccordion">
                            <div className="accordion-body">
                            <form className="container">
                                <div className="my-3 mx-3 h5 text-success">
                                    Enter Teacher Id
                                </div>
                                <div className="row">
                                    <div className="col-md-6  p-2">
                                        <div className="input-group  ">
                                            <input id="teachersearchroll" type="text" className="form-control" placeholder="Teacher unique Id" aria-label="Teacher unique Id"></input>

                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-center">
                                                <button onClick={()=>{
                                                    teacherdetails(document.getElementById("teachersearchroll").value);
                                                }} className="btn btn-primary btn-lg"> Show Details</button>
                                        </div>                                
                                    </div>
                                </div>

                            </form>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item mb-5">
                        <h2 className="accordion-header" id="ModifyTeacherHeader">
                        <button className="accordion-button collapsed rounded-3 text-white fs-3 " type="button" data-bs-toggle="collapse" data-bs-target="#ModifyTeacherBody" aria-expanded="false" aria-controls="ModifyTeacherBody">
                            Modify Teacher Details
                        </button>
                        </h2>
                        <div id="ModifyTeacherBody" className="accordion-collapse collapse" aria-labelledby="ModifyTeacherHeader" data-bs-parent="#ManageTeacherAccordion">
                            <div className="accordion-body">
                            <form className="container">
                                <div className="my-3 mx-3 h5 text-success">
                                    Enter Teacher Id:
                                </div>
                                <div className="row">
                                    <div className="col-md-6  p-2">
                                        <div className="input-group  ">
                                            <input id="teachermodifyid" type="text" className="form-control" placeholder="Teacher unique Id" aria-label="Teacher unique Id"></input>

                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-center">
                                                <button onClick={()=>{
                                                    ModifyTeacherform(document.getElementById("teachermodifyid").value)
                                                }} className="btn btn-primary btn-lg"> Show Details</button>

                                        </div>                                
                                    </div>
                                </div>
                            </form>
                            <form className="container" id='modifyteachercontainer'>
                                <div className="my-3 mx-3 h5 text-success">
                                    Modify Teacher Details
                                </div>
                                    <div className="row">
                                        <div className="col-md-6  p-2">
                                            <div className="input-group  ">
                                            <label className="input-group-text" htmlFor="modifyteacheremail">Student Email</label>
                                            <input id="modifyteacheremail" disabled={true} type="email" className="form-control" placeholder="Registered Teacher Email" aria-label="Teacher Email"></input>

                                            </div>
                                        </div>
                                        <div className="col-md-6 p-2">
                                        <div className="input-group ">
                                        <label className="input-group-text" htmlFor="modifyteacherid">Student Roll</label>
                                        <input id="modifyteacherid" type="text" disabled={true} className="form-control" placeholder="Id" aria-label="Id"></input>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6  p-2">
                                            <div className="input-group  ">
                                            <label className="input-group-text" htmlFor="modifyteachername">Student Name</label>
                                            <input id="modifyteachername" type="text" className="form-control" placeholder="Teacher Name" aria-label="Teacher Name"></input>
                                            </div>
                                        </div>
                                        <div className="col-md-6 p-2">
                                        <div className="input-group ">
                                                <label className="input-group-text" htmlFor="modifyteacherdept">Student Department</label>
                                                <select defaultValue={"Computer Science"} className="form-select" id="modifyteacherdept">
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
                                            // modifydetails();
                                            modifyteacherdetails();
                                        }} className="btn btn-primary btn-lg">Modify</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item mb-5">
                        <h2 className="accordion-header" id="RemoveTeacherHeader">
                        <button className="accordion-button collapsed rounded-3 text-white fs-3 " type="button" data-bs-toggle="collapse" data-bs-target="#RemoveTeacherBody" aria-expanded="false" aria-controls="RemoveTeacherBody">
                            Remove Teacher
                        </button>
                        </h2>
                        <div id="RemoveTeacherBody" className="accordion-collapse collapse" aria-labelledby="RemoveTeacherHeader" data-bs-parent="#ManageTeacherAccordion">
                            <div className="accordion-body">
                            <form className="container">
                                <div className="my-3 mx-3 h5 text-success">
                                    Enter Teacher Id:
                                </div>
                                <div className="row">
                                    <div className="col-md-6  p-2">
                                        <div className="input-group  ">
                                            <input id="teacherdeleteid" type="text" className="form-control" placeholder="Teacher unique Id" aria-label="Teacher unique Id"></input>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-center">
                                                <button onClick={()=>{
                                                    DeleteTeacherform(document.getElementById("teacherdeleteid").value);
                                                }} className="btn btn-primary btn-lg"> Show Details</button>
                                        </div>                                
                                    </div>
                                </div>
                            </form>
                            <form className="container" id='deleteteachercontainer'>
                                <div className="my-3 mx-3 h5 text-success">
                                    Teacher Details:
                                </div>
                                    <div className="row">
                                        <div className="col-md-6  p-2">
                                            <div className="input-group  ">
                                            <label className="input-group-text" htmlFor="deleteteacheremail">Teachers Email</label>
                                            <input id="deleteteacheremail" disabled={true} type="email" className="form-control" placeholder="Registered Teacher Email" aria-label="Teacher Email"></input>

                                            </div>
                                        </div>
                                        <div className="col-md-6 p-2">
                                        <div className="input-group ">
                                        <label className="input-group-text" htmlFor="deleteteacherid">Teacher Id</label>
                                        <input id="deleteteacherid" type="text" disabled={true} className="form-control" placeholder="Id" aria-label="Id"></input>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6  p-2">
                                            <div className="input-group  ">
                                            <label className="input-group-text" htmlFor="deleteteachername">Teacher Name</label>
                                            <input id="deleteteachername" disabled={true} type="text" className="form-control" placeholder="Teacher Name" aria-label="Teacher Name"></input>
                                            </div>
                                        </div>
                                        <div className="col-md-6 p-2">
                                        <div className="input-group ">
                                            <label className="input-group-text" htmlFor="deleteteacherdept">Teacher Dapartment</label>
                                            <input id="deleteteacherdept" disabled={true} type="text" className="form-control" placeholder="Teacher Department" aria-label="Teacher Department"></input>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="container text-center mt-3">
                                        <button onClick={()=>{
                                            Deleteteacher();
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



function Deleteteacher(){
    let roll=document.getElementById("deleteteacherid").value;
    let db=ref(getDatabase(app));
    get(child(db, `teachers/${roll}/`)).then((snapshot) => {
        let classes=snapshot.val().classes;
        const db1 = getDatabase();
        const updates = {};
        for (const key in classes) {
            let temp=key.split("\\")
            let clas=`${temp[0]}\\${temp[1]}\\${temp[2]}\\${temp[3]}/${temp[4]}/${temp[5]}/${temp[6]}/${temp[7]}`
            updates[`/batches/${clas}/teacher`] = "";
        }
        update(ref(db1), updates);
        remove(ref(db1,`users/${snapshot.val().uid}`));
        remove(ref(db1,`teachers/${roll}`));
        document.getElementById("deleteteachercontainer").style.display = "none";
        showModal(``,`Teacher removed Successfully`);

    }).catch((error) => {
        console.error(error);
    });
}

function DeleteTeacherform(roll){
    let db=ref(getDatabase(app));
    get(child(db, `teachers/${roll}/`)).then((snapshot) => {

        if(snapshot.val()===null){
            showModal(`Teacher not found`,`No Teacher with roll: ${roll} exists`)
        }
        else{
            get(child(db, `users/${snapshot.val().uid}/`)).then((snapshot) => {

                document.getElementById("deleteteacheremail").value=snapshot.val().email;
                document.getElementById("deleteteacherid").value=snapshot.val().roll;
                document.getElementById("deleteteachername").value=snapshot.val().name;
                document.getElementById("deleteteacherdept").value=snapshot.val().dept;
                document.getElementById("deleteteachercontainer").style.display = "block";
            }).catch((error) => {
                console.error(error);
            });
        }
    }).catch((error) => {
        console.error(error);
    });
}

function teacherdetails(roll){
    let db=ref(getDatabase(app));
    get(child(db, `teachers/${roll}/`)).then((snapshot) => {
        if(snapshot.val()===null){
            showModal(`Teacher not found`,`No Teacher with Id: ${roll} exists`)
        }
        else{
            get(child(db, `users/${snapshot.val().uid}/`)).then((snapshot) => {
                showModal(`Teacher Details`,`
                <div className='row mb-1 ms-3'><span><em>Name:</em> &nbsp;&nbsp;<span >${snapshot.val().name} </span></span></div>
                <div className='row mb-1 ms-3'><span><em>Department:</em> &nbsp;&nbsp;<span > ${snapshot.val().dept}</span></span></div>
                <div className='row mb-1 ms-3'><span><em>Id:</em> &nbsp;&nbsp;<span >${snapshot.val().roll} </span></span></div>
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


function modifyteacherdetails(){
    let newemail=document.getElementById("modifyteacheremail").value;
    let newroll=document.getElementById("modifyteacherid").value;
    let newname=document.getElementById("modifyteachername").value;
    let newdept=document.getElementById("modifyteacherdept").value;
    let db=ref(getDatabase(app));
    get(child(db, `teachers/${newroll}/`)).then((snapshot) => {
        console.log(snapshot.val().uid)
        let db1=(getDatabase(app));
        set(ref(db1, `users/${snapshot.val().uid}/`), {
            uid:snapshot.val().uid,
            role:`teacher`,
            name:newname,
            dept:newdept,
            roll:newroll,
            email:newemail
            
        });
        document.getElementById("modifyteachercontainer").style.display = "none";
        showModal(`Modify Teacher`,`Changed Teacher details succesfully`);
    }).catch((error) => {
        console.error(error);
    });
}

function ModifyTeacherform(roll){
    let db=ref(getDatabase(app));
    get(child(db, `teachers/${roll}/`)).then((snapshot) => {
        console.log(snapshot.val())
        if(snapshot.val()===null){
            showModal(`Teacher not found`,`No Teacher with Id: ${roll} exists`)
        }
        else{
            get(child(db, `users/${snapshot.val().uid}/`)).then((snapshot) => {
                console.log(snapshot.val())
                document.getElementById("modifyteacheremail").value=snapshot.val().email;
                document.getElementById("modifyteacherid").value=snapshot.val().roll;
                document.getElementById("modifyteachername").value=snapshot.val().name;
                document.getElementById("modifyteacherdept").value=snapshot.val().dept;
                document.getElementById("modifyteachercontainer").style.display = "block";
            }).catch((error) => {
                console.error(error);
            });
        }
    }).catch((error) => {
        console.error(error);
    });
}


function addTeacher(sid,semail,sname,sdept){
    console.log(`${sid} ${semail} ${sname} ${sdept}`)
    let email=semail.split ("@");
    let db=ref(getDatabase(app));
    get(child(db, `teachers/`)).then((snapshot) => {
        console.log(snapshot.val());
        let flag=0;
        for (const key in snapshot.val()) {
            // console.log(key)
            if(sid===key){
                flag=1;
            }
        }
        if(flag===1){
            showModal(`Teacher Cannot Be Added`,`Teacher with Id: ${sid} already exists`);
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
                    showModal(`Teacher Cannot Be Added`,`${semail} is not linked to any PENDING account`);
                }
                else{
                    

                    get(child(db, `unassingedusers/${email[0]}`)).then((snapshot) => {
                        console.log(snapshot.val().uid)
                        let db=(getDatabase(app));
                        set(ref(db, `users/${snapshot.val().uid}/`), {
                            role:`teacher`,
                            uid:snapshot.val().uid,
                            name:sname,
                            dept:sdept,
                            roll:sid,
                            email:semail

                        });
                        set(ref(db, `teachers/${sid}/`), {
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

export { ManageTeachers };