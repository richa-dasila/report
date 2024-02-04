import { getAuth,onAuthStateChanged} from "firebase/auth";
import { getDatabase , ref , child, get, set,onValue, remove,update} from "firebase/database";
import {app} from "../../../Firebase/firebase";
import { useEffect } from 'react'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BackButton } from "../../BackButton/BackButton";
import { showModal } from "../../MainModal/MainModal";



function ManageCourses(){

    let navigate=useNavigate();
    const [role, setRole] = useState(undefined);
    useEffect(() => {
        let db=ref(getDatabase(app));
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const uid = user.uid;

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
                   <em id="heading"> Manage Courses</em>
                </div>
            </div>
            <div className="container-fluid p-3 px-5">
                <div className="accordion accordion-flush" id="ManageCoursesAccordion">
                    <div className="accordion-item mb-5">
                        <h2 className="accordion-header" id="AddNewCourseHeader">
                            <button className="accordion-button rounded-3 collapsed text-white fs-3 " type="button" data-bs-toggle="collapse" data-bs-target="#AddNewCourseBody" aria-expanded="false" aria-controls="AddNewCourseBody">
                                Add New Course
                            </button>
                        </h2>
                        <div id="AddNewCourseBody" className="accordion-collapse collapse" aria-labelledby="AddNewCourseHeader" data-bs-parent="#ManageCoursesAccordion">
                            <div className="accordion-body">
                                <form className="container">
                                    <div className="row">
                                        <div className="col-md-6  p-2">
                                            <div className="input-group  ">
                                                <label className="input-group-text" htmlFor="degreetype">Degree Type</label>
                                                <select defaultValue={'Bachelors'} className="form-select" id="degreetype">
                                                    <option  value="Bachelors">Bachelors</option>
                                                    <option value="Masters">Masters</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6 p-2">
                                        <div className="input-group ">
                                                <label className="input-group-text" htmlFor="degreedomain">Degree Domain</label>
                                                <select  defaultValue={'Technology'} className="form-select" id="degreedomain">
                                                    <option value="Technology">Technology</option>
                                                    <option value="Science">Science</option>
                                                    <option value="Computer Application">Computer Application</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6  p-2">
                                            <div className="input-group  ">
                                                <label className="input-group-text" htmlFor="major">Major</label>
                                                <select defaultValue={'Informationa Technology'} className="form-select" id="major">
                                                    <option value="Information Technology">Information Technology</option>
                                                    <option value="Computer Science">Computer Science</option>
                                                    <option value="Electrical Engineering">Electrical Engineering</option>
                                                    <option value="Electrical & Communication Engineering">Electrical & Communication Engineering</option>
                                                    <option value="Applied Electronics">Applied Electronics</option>
                                                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6 p-2">
                                        <div className="input-group ">
                                                <label className="input-group-text" htmlFor="semesters">Number Of Semesters</label>
                                                <select defaultValue={'8'} className="form-select" id="semesters">
                                                    <option value="2">2</option>
                                                    <option value="4">4</option>
                                                    <option value="6">6</option>
                                                    <option value="8">8</option>
                                                    <option value="10">10</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="container text-center mt-3">
                                        <button onClick={addCourse} className="btn btn-primary btn-lg">Add Course</button>
                                    </div>
                                </form>
                                <CurrentCoursesTable/>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item mb-5">
                        <h2 className="accordion-header" id="ModifyCoursesHeader">
                        <button className="accordion-button collapsed rounded-3 text-white fs-3 " type="button" data-bs-toggle="collapse" data-bs-target="#ModifyCoursesBody" aria-expanded="false" aria-controls="ModifyCoursesBody">
                            Modify Courses
                        </button>
                        </h2>
                        <div id="ModifyCoursesBody" className="accordion-collapse collapse" aria-labelledby="ModifyCoursesHeader" data-bs-parent="#ManageCoursesAccordion">
                            <div className="accordion-body">
                            <ModifyCourse/>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item mb-5">
                        <h2 className="accordion-header" id="DeleteCoursesHeader">
                        <button className="accordion-button collapsed rounded-3 text-white fs-3 " type="button" data-bs-toggle="collapse" data-bs-target="#DeleteCoursesBody" aria-expanded="false" aria-controls="DeleteCoursesBody">
                            Delete Courses
                        </button>
                        </h2>
                        <div id="DeleteCoursesBody" className="accordion-collapse collapse" aria-labelledby="DeleteCoursesHeader" data-bs-parent="#ManageCoursesAccordion">
                            <div className="accordion-body">
                            <DeleteCoursesTable/>
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



function ManageSems({courseid}){

    let name,sems,totalsem;


    if(courseid && courseid !== "null" && courseid !== "undefined" && courseid!==""){

        let db = getDatabase();
        const dbRef = ref(db, 'courses/active/'+courseid);
        onValue(dbRef, (snapshot) => {    
            name=snapshot.val().name;
            sems=snapshot.val().sems;
            totalsem=snapshot.val().totalsem;
        });


        function returnsems(totalsem,sems){
            let semlist=[]
            for (let index = 1; index <= totalsem; index++) {
                let semname=`sem`+index;
                semlist.push(sems[semname])
            }
            return semlist;
        }

        function addsubject(courseid,semname,subjectcode,subjectname,subjecttype,subjectcredit){
            let subjects=[];
            let db=ref(getDatabase(app));


            get(child(db, `courses/active/`+courseid+`/sems/`+semname+`/subs`)).then((snapshot) => {

                    if(snapshot.val()===null){
                        let db=(getDatabase(app));
                            set(ref(db, `courses/active/`+courseid+`/sems/`+semname+`/subs/`+subjectcode+`/`), {
                                name:subjectname,
                                type:subjecttype,
                                credits:subjectcredit,
                                teacher:''
                            });
                            showModal(`New Subject is Added`, `${subjectname} Added`);
                    }
                    else{
                        subjects=Object.keys(snapshot.val());
                        let flag=0;
                        subjects.forEach(element => {
                            if(element===subjectcode)
                                flag=1;
                        });
                        if(flag===0){
                            let db=(getDatabase(app));
                            set(ref(db, `courses/active/`+courseid+`/sems/`+semname+`/subs/`+subjectcode+`/`), {
                                name:subjectname,
                                type:subjecttype,
                                credits:subjectcredit,
                                teacher:''
                            });
                            showModal(`New Subject is Added`, `${subjectname} Added`);
                        }
                        else{
                            showModal(`Subject can not be Added `, `Delete the Subject with Id: ${subjectcode} and then try`);
                        }

                    }
            
            }).catch((error) => {
                console.error(error);
                showModal(`Error Occured`, `Subject Code And Subjact Name should contain alphanumerals only`);
            });
        }

        function deletesubject(courseid,semname,subcode){
                const db = getDatabase();
                remove(ref(db, 'courses/active/'+courseid+`/sems/`+semname+`/subs/`+subcode), )
                .then(() => {
                showModal(`Subject Deleted Succesfully`, `Subject Deleted Succesfully`);
                })
                .catch((error) => {
                });
        }

        function semaccordion(semlist,name,totalsem){

            let semaccordionlist=[]
            
            for(let index=0;index<totalsem;index++){
                if(semlist[index].subs && semlist[index].subs !== "null" && semlist[index].subs !== "undefined")
                    var subdata = Object.keys(semlist[index].subs).map((key) => [key, semlist[index].subs[key]]);
                else
                    var subdata=[];
                semaccordionlist.push(
                <div key={`sem`+(index+1)}className="accordion-item">
                    <h2 className="accordion-header" id={"accheadingsem"+(index+1)}>
                        <button className="accordion-button collapsed rounded-3 collapsed text-white fs-5 my-2" type="button" data-bs-toggle="collapse" data-bs-target={"#accbodysem"+(index+1)} aria-expanded="false" aria-controls={"accbodysem"+(index+1)}>
                            Semester {index+1}
                        </button>
                    </h2>
                    <div id={"accbodysem"+(index+1)} className="accordion-collapse collapse" aria-labelledby={"accheadingsem"+(index+1)} data-bs-parent="#semaccordion" >
                        <div className="accordion-body">
                            <div className="container">
                                <div className="container fs-5 text-primary">
                                <strong>Add New Subject</strong>
                                </div>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-6  p-2">
                                            <div className="input-group  ">
                                                <input id={"subjectcodesem"+(index+1)} type="text" className="form-control" patter="[a-zA-Z0-9\s]+" placeholder="Subject Code (Alphanumerals)" aria-label="Subject Code"></input>
                                            </div>
                                        </div>
                                        <div className="col-md-6 p-2">
                                        <div className="input-group ">
                                            <input id={"subjectnamesem"+(index+1)} type="text" className="form-control" placeholder="Subject Name (Alphanumerals)" aria-label="Subject Name"></input>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6  p-2">
                                            <div className="input-group  ">
                                                <label className="input-group-text" htmlFor="degreetype">Subject Type</label>
                                                <select id={"subjecttypesem"+(index+1)} defaultValue={'Theory'} className="form-select" >
                                                    <option  value="Theory">Theory</option>
                                                    <option value="Practical">Practical</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6 p-2">
                                        <div className="input-group ">
                                            <input id={"subjectcreditssem"+(index+1)} type="number" className="form-control" placeholder="Subject Credits (Numerals)" aria-label="Subject Credits"></input>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="container text-center my-3">
                                        <button  onClick={
                                            
                                            ()=>{
                                                addsubject(courseid,`sem`+ (index+1),document.getElementById("subjectcodesem"+(index+1)).value,document.getElementById("subjectnamesem"+(index+1)).value,document.getElementById("subjecttypesem"+(index+1)).value,document.getElementById("subjectcreditssem"+(index+1)).value)
                                            }
                                            }className="btn btn-primary btn-lg">Add Subject</button>
                                </div>
                            </div>
                            <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                    <th scope="col">Subject Code</th>
                                    <th scope="col">Subject Name</th>
                                    <th scope="col">Subject Type</th>
                                    <th scope="col">Subject Credits</th>
                                    <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {

                                    subdata.map((item)=>(
                                                    <tr key={item[0]} >
                                                    <td>
                                                        <div>
                                                            {item[0]}
                                                        </div>
                                                    </td>
                                                    <td>
                                                    <div>{item[1].name}</div>
                                                    </td>
                                                    <td>{item[1].type}</td>
                                                    <td>{item[1].credits}</td>
                                                    <td>
                                                    <button onClick={()=>{deletesubject(
                                                        courseid,`sem`+ (index+1),item[0]
                                                    )}} className="btn btn-sm btn-danger">
                                                        Delete
                                                    </button>
                                                    </td>
                                                    </tr>
    
                                            ))
                                }
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                </div>
                );
            }
            return(
                semaccordionlist
            );

        }

        return(
            
            <div className="container">
                <div className="my-3 mx-3 h5 text-success">
                    {name}
                </div>

            <div className="container">
            <div className="accordion accordion-flush" id="semaccordion">
                {
                   semaccordion( returnsems(totalsem,sems),name,totalsem)
                }
            </div>
            </div>
            </div>
        );
    }
    else{

        return(
            <>
            </>
        );
    }

}

function ModifyCourse(){

    let[data,setData]=useState(undefined);
    let[courseid,setcourseid]=useState("");

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
            <div className="container" id="courseselector">
            <div className="row">
                <div className="col-md-8 p-2">
                    <div className="input-group  ">
                        <label className="input-group-text" htmlFor="degreetype">Select Course</label>
                        <select defaultValue={''} className="form-select" id="coursetomodify">
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
                            setcourseid(document.getElementById("coursetomodify").value)
                        }} id="courseselectorbtn" className="btn btn-primary btn">Modify Course</button>
                    </div>
                </div>
                
            </div>
            </div>
            <ManageSems courseid={courseid}/>
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

function addCourse(){
    var degreetype=(document.getElementById("degreetype").value);
    var degreedomain=(document.getElementById("degreedomain").value);
    var major=(document.getElementById("major").value);
    var semesters=(document.getElementById("semesters").value);
    let courseid;

    if(degreetype==='Bachelors')
        courseid=`B`;
    else
        courseid=`M`;


    switch(degreedomain) {
        case "Technology":
            courseid=courseid+`tech`;
            break;
        case "Science":
            courseid=courseid+`Sc`;
            break;
        case "Computer Application":
            courseid=courseid+`CA`;
            break;
        default:
            courseid=courseid+``;
    }

    switch(major) {
        case "Information Technology":
            courseid=courseid+"\\IT";
            break;
        case "Computer Science":
            courseid=courseid+`\\CS`;
            break;
        case "Electrical Engineering":
            courseid=courseid+`\\EE`;
            break;
        case "Electrical & Communication Engineering":
                courseid=courseid+`\\ECE`;
                break;
        case "Applied Electronics":
            courseid=courseid+`\\AE`;
            break;
        case "Mechanical Engineering":
                courseid=courseid+`\\ME`;
                break;
        default:
            courseid=courseid+``;
    }

    courseid=courseid+`\\`+new Date().getFullYear();
    let coursename= degreetype + ` in ` + degreedomain + ` (`  + major + `)`; 

    function generatesems(semesters){
        let sems={};
        for(let i=0; i<semesters;i++){
            sems[`sem`+(i+1)]={
                subjects:true,

            };
        }
        return sems;
    }

    let currentcourses=[];
    let db=ref(getDatabase(app));
    get(child(db, `courses/active`)).then((snapshot) => {
        console.log(snapshot.val())
        if(snapshot.val()===null){
            let db=(getDatabase(app));
            let sems=generatesems(semesters);
            set(ref(db, 'courses/active/'+courseid), {
                name:coursename,
                totalsem:semesters,
                sems
            });
            showModal(`New Course is created `, `Add Details to the course by Modifying the course`);

        }else{
                currentcourses=Object.keys(snapshot.val());
                let flag=0;
                currentcourses.forEach(element => {
                    if(element===courseid)
                        flag=1;
    
                });
                if(flag===0){
                    let db=(getDatabase(app));
                    let sems=generatesems(semesters);
                    set(ref(db, 'courses/active/'+courseid), {
                        name:coursename,
                        totalsem:semesters,
                        sems
                    });
                    showModal(`New Course is created `, `Add Details to the course by Modifying the course`);
                }
                else{
                    showModal(`Course can not be created `, `Delete the course with Id: ${courseid} and then try`);
                }
        }
    
    }).catch((error) => {
        console.error(error);
    });
    
}




function CurrentCoursesTable(){

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
        
        var formdata = Object.keys(data).map((key) => [key, data[key]]);
        return(
            <>
`                <div className="h4 text-info">
                    Current Courses
                </div>
                <div className="table-responsive">
                <table className="table">
                <thead>
                    <tr>
                    <th scope="col">Course Id</th>
                    <th scope="col">Course Name</th>
                    <th scope="col">Total Semesters</th>
                    </tr>
                </thead>
                <tbody>
                    {

                        formdata.map((item)=>(
                                <tr key={item[0]} >
                                <td>{item[0]}</td>
                                <td>{item[1].name}</td>
                                <td>{item[1].totalsem}</td>
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
            No Courses are currently available
            </div>
        );
    }
}



function DeleteCoursesTable(){
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
        var formdata = Object.keys(data).map((key) => [key, data[key]]);
        return(
            <>
`                <div className="h2 text-info">
                    Current Courses
                </div>
                <div className="table-responsive">
                <table className="table">
                <thead>
                    <tr>
                    <th scope="col">Course Id</th>
                    <th scope="col">Course Name</th>
                    <th scope="col">Total Semesters</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        formdata.map((item)=>(
                                <tr  key={item[0]} >
                                <td>{item[0]}</td>
                                <td>{item[1].name}</td>
                                <td>{item[1].totalsem}</td>
                                <td>
                                    <button onClick={()=>{deleteCourse(item[0]);}} className="btn btn-sm btn-danger">
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
    else{
        return(
            <div className="h6 mt-3">
                No Current Courses
            </div>
        );
    }
}

function deleteCourse(courseid){
    const db = getDatabase();
    remove(ref(db, 'courses/active/' + courseid), )
    .then(() => {
    showModal(`Course Deleted Succesfully`, `Course Deleted Succesfully`);
    })
    .catch((error) => {
    });
}

export { ManageCourses};
