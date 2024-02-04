import { getAuth,onAuthStateChanged} from "firebase/auth";
import { getDatabase , ref, child, get,onValue,set,update,remove} from "firebase/database";
import {app} from "../../../Firebase/firebase";
import { useEffect } from 'react'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BackButton } from "../../BackButton/BackButton";
import { showModal } from "../../MainModal/MainModal";



function ManageBatches(){

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
                   <em id="heading"> Manage Batches</em>
                </div>
            </div>
            <div className="container-fluid p-3 px-5">
                <div className="accordion accordion-flush" id="ManageBatchesAccordion">
                    <div className="accordion-item mb-5">
                        <h2 className="accordion-header" id="AddNewBatchHeader">
                            <button className="accordion-button rounded-3 collapsed text-white fs-3 " type="button" data-bs-toggle="collapse" data-bs-target="#AddNewBatchBody" aria-expanded="false" aria-controls="AddNewBatchBody">
                                Add New Batch
                            </button>
                        </h2>
                        <div id="AddNewBatchBody" className="accordion-collapse collapse" aria-labelledby="AddNewBatchHeader" data-bs-parent="#ManageBatchesAccordion">
                            <div className="accordion-body">

                            <AddBatch/>
                            <CurrentBatchesTable/>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item mb-5">
                        <h2 className="accordion-header" id="ChangeSemHeader">
                        <button className="accordion-button collapsed rounded-3 text-white fs-3 " type="button" data-bs-toggle="collapse" data-bs-target="#ChangeSemBody" aria-expanded="false" aria-controls="ChangeSemBody">
                            Change Semesters
                        </button>
                        </h2>
                        <div id="ChangeSemBody" className="accordion-collapse collapse" aria-labelledby="ChangeSemHeader" data-bs-parent="#ManageBatchesAccordion">
                            <div className="accordion-body">
                            <div className="col-md-12 p-2">
                            <div className="container text-center">
                                <div className="my-3 fs-4 text-danger">
                                <em>Changed Semesters can not be  brought back to its intial state</em>
                                </div>
                                <button onClick={()=>{
                                        incrementsem();
                                    }} className="btn btn-danger btn-lg btn">Increment Semester</button>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item mb-5">
                        <h2 className="accordion-header" id="AssignStudentsHeader">
                        <button className="accordion-button collapsed rounded-3 text-white fs-3 " type="button" data-bs-toggle="collapse" data-bs-target="#AssignStudentsBody" aria-expanded="false" aria-controls="AssignStudentsBody">
                            Assign Students
                        </button>
                        </h2>
                        <div id="AssignStudentsBody" className="accordion-collapse collapse" aria-labelledby="AssignStudentsHeader" data-bs-parent="#ManageBatchesAccordion">
                            <div className="accordion-body">
                                <AssignStudents/>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item mb-5">
                        <h2 className="accordion-header" id="AssignTeachersHeader">
                        <button className="accordion-button collapsed rounded-3 text-white fs-3 " type="button" data-bs-toggle="collapse" data-bs-target="#AssignTeachersBody" aria-expanded="false" aria-controls="AssignTeachersBody">
                            Assign Teachers (Current Semester)
                        </button>
                        </h2>
                        <div id="AssignTeachersBody" className="accordion-collapse collapse" aria-labelledby="AssignTeachersHeader" data-bs-parent="#ManageBatchesAccordion">
                            <div className="accordion-body">
                                <AssignTeachers/>
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


function AssignTeachers(){
    let[data,setData]=useState(undefined);
    let[batchid,setbatchid]=useState(null);

    useEffect(() => {
        fetchallcourses();
    },
    []);

    function fetchallcourses(){
        let db = getDatabase();
        const dbRef = ref(db, 'batches');

        onValue(dbRef, (snapshot) => {
            let data=snapshot.val();
            console.log(data)
            for (const key in data) {
                if(data[key].curr===`Batch Over`)
                    delete data[key];
            }
            setData(data);

        });
    }
 
    if(data && data !== "null" && data !== "undefined" && Object.entries(data).length !== 0){

        var coursedata = Object.keys(data).map((key) => [key, data[key]]);
        console.log(coursedata);
        return(
        <>
            <div className="container" id="courseselector">
            <div className="row">
                <div className="col-md-8 p-2">
                    <div className="input-group  ">
                        <label className="input-group-text" htmlFor="selectbatchteacher">Select Batch</label>
                        <select defaultValue={''} className="form-select" id="selectbatchteacher">
                        {
                            coursedata.map((item)=>(
                                    <option  key= {item[0]} value={item[0]}>{item[0]+` : `+ item[1].name}</option>
                            ))
                        }
                        </select>
                    </div>
                </div>
                <div className="col-md-4 p-2">
                    <div className="container text-center">
                        <button onClick={()=>{
                            setbatchid(document.getElementById("selectbatchteacher").value)
                        }} id="courseselectorbtn" className="btn btn-primary btn">Select Batch</button>
                    </div>
                </div>
            </div>
            </div>
            <AddTeacher batchid={batchid}/>
        </>
        );
    }
    else
    return(
        <div className="h6 mt-3">
        No Active Batches Present
        </div>
    );
}



function AddTeacher({batchid}){
    console.log(batchid)
    let[data,setData]=useState(undefined);

    useEffect(() => {
        fetchallcourses();
    },
    [batchid]);

    function fetchallcourses(){
        let db = getDatabase();
        const dbRef = ref(db, 'batches/'+batchid);
        onValue(dbRef, (snapshot) => {
            if(snapshot.val()!==null)
            setData(snapshot.val());
        });
    }
    if(data && data !== "null" && data !== "undefined"){
        let currentsem=`sem`+data.curr;
        // console.log(currentsem)
        let currentsemdata1=data[`sems`];
        let currentsemdata2=currentsemdata1[currentsem]
        let currentsemdata=currentsemdata2[`subs`]
        console.log(currentsemdata)
        if (currentsemdata && currentsemdata !== "null" && currentsemdata !== "undefined" && Object.entries(currentsemdata).length !== 0) {
            var semsubs = Object.keys(currentsemdata).map((key) => [key, currentsemdata[key]]);
            // console.log(semsubs)
            return(
                <>
                    <div className="conatianer">
                        <div className="fs-3 text-success my-2">
                            {data.name}/{currentsem} (Currently Active Semester):
                        </div>
                        <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">Subject Code</th>
                                <th scope="col">Subject Name</th>
                                <th scope="col">Subject Type</th>
                                <th scope="col">Subject Teacher Id</th>
                                <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
    
                                    semsubs.map((item)=>(
                                            <tr key={item[0]} >
                                            <td className="col-2">{item[0]}</td>
                                            <td className="col-2">{item[1].name}</td>
                                            <td className="col-2">{item[1].type}</td>
                                            <td className="col-3">
                                            <input id={'teacherid'+item[0]} type="text" defaultValue={item[1].teacher}className="form-control" placeholder="Teacher Id" aria-label="Teacher Id"></input>
                                            </td>
                                            <td className="col-2">
                                            <button onClick={()=>{assignteacher(batchid,currentsem,item[0],document.getElementById('teacherid'+item[0]).value)}} className="btn btn-sm btn-success">
                                            Change
                                            </button>
                                            </td>
                                            </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        </div>
                    </div>
                </>
            );
        } else {
            showModal(`Could not perform operation....`,`No subjects present in this sem.`);
            return(                
                <>
                </>
            );
        }


    }
    else
    return(
        <div className="h6 mt-3">
        </div>
    );
}





function assignteacher(batchid,currentsem,subjectid,teacherid){
    console.log(`${batchid} ${currentsem} ${subjectid} ${teacherid}` )
    let db=ref(getDatabase(app));
    get(child(db, `teachers`)).then((snapshot) => {
        if(snapshot.val()!==null){
            let flag=0;
            for (const key in snapshot.val()) {
                if(key===teacherid)
                    flag=1;
            }
            if(flag===0)
                showModal(`Cannot Add Teacher`,`Teacher with Id: ${teacherid} does not exist.`);
            else{
                const db1 = getDatabase();
                const updates = {};
                let addr=`${batchid}\\sems\\${currentsem}\\subs\\${subjectid}`
                updates[`/teachers/${teacherid}/classes/${addr}`] = true;
                updates[`batches/${batchid}/sems/${currentsem}/subs/${subjectid}/teacher`] = teacherid;
                update(ref(db1), updates);
                showModal(`Teacher Assigned`,`Teacher with Id: ${teacherid} assigned to the batch.`);
            }
        }
        else{
            showModal(`Cannot Add Teacher`,`Teacher with Id: ${teacherid} does not exist.`);
        }
    }).catch((error) => {
        console.error(error);
    });

}





















function CurrentStudents({batchid}){
    let[data,setData]=useState(undefined);

    useEffect(() => {
        fetchallcourses();
    },
    [batchid]);

    function fetchallcourses(){
        let db = getDatabase();
        const dbRef = ref(db, 'batches/'+batchid);
        onValue(dbRef, (snapshot) => {
            setData(snapshot.val());
        });
    }
    if(data && data !== "null" && data !== "undefined"){



        return(
            <div className="h6 mt-3">
                <div className="container text-success">
                    Enter Student Roll Number to add in the Batch.
                </div>
                <div className="row my-3">
                <div className="col-md-8 p-2">
                        <div className="container text-center">
                        <input id="studentroll" type="number" className="form-control" placeholder="Student Unique Roll" aria-label="Student Unique Roll"></input>
                        </div>
                </div>
                <div className="col-md-4 text-center">
                <button  onClick={()=>{
                    addstudentinbatch(batchid,document.getElementById("studentroll").value);
                }}className="btn btn-primary btn-lg btn">Add</button>
                </div>
                </div>
                <StudentsInBatch batchid={batchid}/>
            </div>
        );

    }
    else
    return(
        <div className="h6 mt-3">
        </div>
    );
}

function addstudentinbatch(batchid,studentroll){

    let db=ref(getDatabase(app));
    get(child(db, `batches/`+batchid+`/sems/sem1/subs`)).then((snapshot) => {
        let initdata=snapshot.val();
        let sublist=[];
        for (const key in initdata) {
            sublist.push({name:key,type:initdata[key].type});
        }

        let firstsub=sublist[0].name;

        let studentlist=[];
        if(initdata[firstsub].students!==null && initdata[firstsub].students!==undefined)
            studentlist=Object.keys(initdata[firstsub].students);


        let flag=0;
        for (let index = 0; index < studentlist.length; index++) {
                if(studentlist[index]===studentroll)
                flag=1;
                        
        }
        if(flag===1)
            showModal(`Student Cannot be Added`,`${ studentroll} Student Already exists in the Batch`);
        else{
            let db=ref(getDatabase(app));
            get(child(db, `students/`+studentroll)).then((snapshot) => {
                if(snapshot.val()===null)
                    showModal(`Student Cannot be Added`,`Student with Roll: ${ studentroll} does not exist.`);
                else{
                    const db1 = getDatabase();
                    const updates = {};
                    updates['/students/' + studentroll+`/batches/${batchid}`] = true;
                    let db=ref(getDatabase(app));
                    get(child(db, `batches/`+batchid)).then((snapshot) => {
                        let batchdata=snapshot.val();
                        for(let i=1;i<=batchdata.totalsem;i++){
                            let semname=`sem`+i;
                            console.log(semname);
                            let semdataupper=batchdata[`sems`];
                            let semdatamiddle=semdataupper[semname];
                            let semdata=semdatamiddle[`subs`];
                            for (const key in semdata) {
                                console.log(key);
                                if(semdata[key].type===`Theory`)
                                    updates['/batches/' + batchid+`/sems/${semname}/subs/${key}/students/${studentroll}/`] = {ca1:0,ca2:0,ca3:0,ca4:0};
                                else{
                                    updates['/batches/' + batchid+`/sems/${semname}/subs/${key}/students/${studentroll}/`] = {pa1:0,pa2:0};
                                }
                            }
                        }
                        update(ref(db1), updates);
                    }).catch((error) => {
                        console.error(error);
                    });               
                }
            }).catch((error) => {
                console.error(error);
            });
        }
    }).catch((error) => {
        console.error(error);
    });
}


function StudentsInBatch({batchid}){
    let[data,setData]=useState(undefined);

    useEffect(() => {
        fetchallcourses();
    },
    [batchid]);

    function fetchallcourses(){
        let db = getDatabase();
        const dbRef = ref(db, 'batches/'+batchid+`/sems/sem1/subs`);
        let initdata;
        onValue(dbRef, (snapshot) => {
            initdata=snapshot.val();
            console.log(initdata);
            let subname;
            for (const key in initdata) {
                subname=key;
            }
            setData(initdata[subname].students);
        });

        
    }
    if(data && data !== "null" && data !== "undefined"){
        var formdata = Object.keys(data).map((key) => [key, data[key]]);
        return(
            <>
                <div className="container">
                    <div className="h5 text-info">
                         Students Currently in the Batch.
                    </div>
                </div>
                <div className="table-responsive">
                <table className="table">
                <thead>
                    <tr>
                    <th scope="col" className="col-8 text-center">Student Roll</th>
                    <th scope="col" className="col-4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {

                        formdata.map((item)=>(
                                <tr key={item[0]} >
                                <td className="col-8 text-center fs-5 justify-content">{item[0]}</td>
                                <td className="text-center">
                                    <button onClick={()=>{
                                        deleteStudentfromBatch(item[0],batchid);
                                    }} className="btn btn-sm btn-danger">
                                        Delete
                                    </button>
                                </td>
                                </tr>
                        ))
                    }
                </tbody>
            </table>
                </div>
            </>

        );

    }
    else
    return(
        <div className="h6 mt-3 text-center text-danger">
            There are No Students in the Batch Currently.
        </div>
    );

}


function deleteStudentfromBatch(roll,batchid){
    console.log(roll+` `+batchid);
    let db=ref(getDatabase(app));
    const db1 = getDatabase();
    get(child(db, `batches/`+batchid)).then((snapshot) => {
        let batchdata=snapshot.val();
        for(let i=1;i<=batchdata.totalsem;i++){
            let semname=`sem`+i;
            console.log(semname);
            let semdataupper=batchdata[`sems`];
            let semdatamiddle=semdataupper[semname];
            let semdata=semdatamiddle[`subs`];
            for (const key in semdata) {
                console.log(key);
                    remove(ref(db1, 'batches/' + batchid+`/sems/${semname}/subs/${key}/students/${roll}`), )
                    .then(() => {
                        remove(ref(db1, `students/${roll}/batches/${batchid}`), )
                        .then(() => {
                        showModal(`Student Removed from Batch`, ``);
                        })
                        .catch((error) => {
                        });
                    })
                    .catch((error) => {
                    });
            }
        }
    }).catch((error) => {
        console.error(error);
    });               

}



function AssignStudents(){

    let[data,setData]=useState(undefined);
    let[batchid,setbatchid]=useState(null);

    useEffect(() => {
        fetchallcourses();
    },
    []);

    function fetchallcourses(){
        let db = getDatabase();
        const dbRef = ref(db, 'batches');

        onValue(dbRef, (snapshot) => {
            let data=snapshot.val();
            for (const key in data) {
                if(data[key].curr===`Batch Over`)
                    delete data[key];
            }
            setData(data);

        });
    }
 
    if(data && data !== "null" && data !== "undefined" && Object.entries(data).length !== 0){
        console.log(data)
        var coursedata = Object.keys(data).map((key) => [key, data[key]]);

        return(
        <>
            <div className="container" id="courseselector">
            <div className="row">
                <div className="col-md-8 p-2">
                    <div className="input-group  ">
                        <label className="input-group-text" htmlFor="selectbatch">Select Batch</label>
                        <select defaultValue={''} className="form-select" id="selectbatch">
                        {
                            coursedata.map((item)=>(
                                    <option  key= {item[0]} value={item[0]}>{item[0]+` : `+ item[1].name}</option>
                            ))
                        }
                        </select>
                    </div>
                </div>
                <div className="col-md-4 p-2">
                    <div className="container text-center">
                        <button onClick={()=>{
                            setbatchid(document.getElementById("selectbatch").value)
                        }} id="courseselectorbtn" className="btn btn-primary btn">Select Batch</button>
                    </div>
                </div>
            </div>
            </div>
            <CurrentStudents batchid={batchid}/>
        </>
        );
    }
    else
    return(
        <div className="h6 mt-3">
        No Active Batches Present
        </div>
    );

}





function incrementsem(){
    let db1=getDatabase(app);
    let db=ref(getDatabase(app));
    set(ref(db1, 'Assesments/PA'), {
        pa1:true,
        pa2:false,
    });
    set(ref(db1, 'Assesments/CA'), {
        ca1:true,
        ca2:false,
        ca3:false,
        ca4:false
    });  
    get(child(db, `batches/`)).then((snapshot) => {
        console.log(snapshot.val())
        if(snapshot.val()!==null){
            for (const key in snapshot.val()) {
                console.log(key)
                get(child(db, `batches/${key}`)).then((snapshot) => {

                    console.log(snapshot.val().curr)
                    console.log(snapshot.val().totalsem)
                    let current=snapshot.val().curr
                    let total=snapshot.val().totalsem
                    if(current===`Batch Over`){

                    }
                    else if(current<total){
                        current++
                    }else{
                        current=`Batch Over`
                    }

                    const updates = {};
                    updates['/batches/' + key+`/curr`] = current;
                    update(ref(db1), updates);

                    console.log(snapshot.val())
                }).catch((error) => {
                    console.error(error);
                });
            }
        }

    }).catch((error) => {
        console.error(error);
    });


    get(child(db, `teachers/`)).then((snapshot) => {
        let teachers=snapshot.val();
        for (const key in teachers) {
            remove(ref(db1, `teachers/${key}/classes`), )
            .then(() => {
            })
            .catch((error) => {
            });
                }

    }).catch((error) => {
        console.error(error);
    });

}


function AddBatch(){

        let[data,setData]=useState(undefined);

    
        useEffect(() => {
            fetchallcourses();
        },
        []);
    
        function fetchallcourses(){
            let db = getDatabase();
            const dbRef = ref(db, 'courses/active');
    
            onValue(dbRef, (snapshot) => {
                setData(snapshot.val());
            });
        }
     
        if(data && data !== "null" && data !== "undefined"){
            var coursedata = Object.keys(data).map((key) => [key, data[key]]);
            return(
            <>
                <div className="container" id="courseselectorbatch">
                <div className="row">
                    <div className="col-md-6 p-2">
                        <div className="input-group  ">
                            <label className="input-group-text" htmlFor="coursetoselect">Select Course</label>
                            <select defaultValue={''} className="form-select" id="coursetoselect">
                            {
                                coursedata.map((item)=>(
                                        <option  key= {item[0]} value={item[0]}>{item[0]+` : `+ item[1].name}</option>
                                ))
                            }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6 p-2">
                        <div className="container text-center">
                        <input id="batchname" type="text" className="form-control" placeholder="Batch Name" aria-label="Batch Name"></input>
                        </div>
                    </div>
                    <div className="col-md-12 p-2">
                        <div className="container text-center">
                            <button onClick={()=>{
                                AddBatchUtility(document.getElementById("coursetoselect").value,document.getElementById("batchname").value)
                            }} id="courseselectorbtn" className="btn btn-primary btn">Add Batch</button>
                        </div>
                    </div>
                    
                </div>
                </div>
            </>
            );
        }
        else
        return(
            <div className="h6 mt-3">
            No Courses to Modify
            </div>
        );
}



function AddBatchUtility(courseid,batchname){
    console.log(courseid+` `+batchname)
    let batchid=courseid+`\\`+new  Date().getFullYear();
    let db=ref(getDatabase(app));
    get(child(db, `courses/active/${courseid}`)).then((snapshot) => {
        if (snapshot.exists()) {
            let coursedetails=snapshot.val();
            coursedetails[`curr`]=1;
            coursedetails[`courseid`]=courseid;
            coursedetails[`name`]=batchname;
            console.log(coursedetails);
            get(child(db, `batches/`)).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                    let flag=0;
                    for (const key in snapshot.val()) {
                        if(batchid===key)
                            flag=1;
                    }
                    if(flag===1){
                        showModal(`This Batch Already exists`,`This Batch was already created for current semester.`);
                    }
                    else{
                        console.log(batchid);
                        const db1 = getDatabase();
                        const updates = {};
                        updates['/batches/' + batchid] = coursedetails;
                        update(ref(db1), updates);

                    }

                } else {
                    console.log(batchid);
                    const db1 = getDatabase();
                    const updates = {};
                    updates['/batches/' + batchid] = coursedetails;
                    update(ref(db1), updates);
                }
            }).catch((error) => {
                console.error(error);
            });


        } else {
        console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });



}


function CurrentBatchesTable(){

    let[data,setData]=useState(undefined);

    useEffect(() => {
        fetchallcourses();
    },
    []);

    function fetchallcourses(){
        let db = getDatabase();
        const dbRef = ref(db, 'batches/');

        onValue(dbRef, (snapshot) => {
            setData(snapshot.val());
        });
    }


    if(data && data !== "null" && data !== "undefined"){
        
        var formdata = Object.keys(data).map((key) => [key, data[key]]);
        return(
            <>
`                <div className="h4 text-info">
                    Current Batches
                </div>
                <div className="table-responsive">
                <table className="table">
                <thead>
                    <tr>
                    <th scope="col">Batch Id</th>
                    <th scope="col">Batch Name</th>
                    <th scope="col">Course Id</th>
                    <th scope="col">Current Semester</th>
                    </tr>
                </thead>
                <tbody>
                    {

                        formdata.map((item)=>(
                                <tr key={item[0]} >
                                <td>{item[0]}</td>
                                <td className="col-6">{item[1].name}</td>
                                <td>{item[1].courseid}</td>
                                <td>{item[1].curr}</td>
                                </tr>
                        ))
                    }
                </tbody>
            </table>
            </div>
            </>
        );
    }
    else{
        return(
            <div className="h6 mt-3">
            No Batches are currently available
            </div>
        );
    }
}

export { ManageBatches };
