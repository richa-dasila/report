import './TeacherContentProfile.css'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getAuth,onAuthStateChanged} from "firebase/auth";
import { getDatabase , ref, child, get,onValue,update} from "firebase/database";
import {app} from "../../Firebase/firebase";
import { showModal } from "../MainModal/MainModal";


function TeacherContentProfile(){
    
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
    
        if(role===`teacher`)


        return(
            <>   <div className='container-fluid'>
                    <div className='container d-inline-block h1 ms-4 text-primary my-3 mb-4'>
                    <em> Allocate Marks</em>
                    </div>
                </div>
                <div className="container-fluid p-3 px-5">
                    <div className="container-fluid">
                        <div className="accordion accordion-flush" id="marksaccordion">
                            <BatchMarks/>
                        </div>
                    </div>      
                </div>
            
            </>
        );
        else if(role===`student` || role===`admin`)
            navigate('/',{replace:true});
        else
        return(
            <>
            </>
        );
}
    

function BatchMarks(){
    let[classes,setClasses]=useState(undefined);
    let[subdata,setSubData]=useState([]);

    useEffect(() => {
        fetchalldata();
    },
    []);

    function fetchalldata(){
        let db = getDatabase();
        const auth = getAuth();
        let db1=ref(getDatabase(app));
        get(child(db1, `users/${auth.currentUser.uid}`)).then((snapshot) => {
            const dbRef = ref(db, `teachers/${snapshot.val().roll}/classes`);
            onValue(dbRef, (snapshot) => {
                getclassdata(snapshot.val());
                setClasses(snapshot.val());
            });
        }).catch((error) => {
            console.error(error);
        });
    }
    async function getclassdata(classes){
        var classdata = Object.keys(classes).map((key) => [key]);
        let datat=[];
        for (let index = 0; index < classdata.length; index++) {
            let tempobj={};
            let temparr='';
            temparr=temparr+classdata[index]
            let temp=temparr.split("\\")
            let batchid=`${temp[0]}\\${temp[1]}\\${temp[2]}\\${temp[3]}`
            let sem=('Semester'+temp[5].split("sem")).split(",").join(" ");
            let subcode=`${temp[7]}`
            let clas=`${temp[0]}\\${temp[1]}\\${temp[2]}\\${temp[3]}/${temp[4]}/${temp[5]}/${temp[6]}/${temp[7]}`
            let db1=ref(getDatabase(app));
            await get(child(db1, `batches/${clas}`)).then((snapshot) => {
                let subdata=snapshot.val();
                let subcredits=subdata.credits;
                let subname=subdata.name;
                let subtype=subdata.type;
                tempobj={
                    batchid:batchid,
                    sem:sem,
                    subcode:subcode,
                    subdata:subdata,
                    subcredits:subcredits,
                    subname:subname,
                    subtype:subtype
                }
            }).catch((error) => {
                console.error(error);
            });
            datat.push(tempobj);
        }
            setSubData(datat);
    }

    if(classes && classes !== "null" && classes !== "undefined"){
        
        function insertbatch(){
            let batchlist=[];
            for (let index = 0; index < subdata.length; index++) {
                let data=(subdata[index]);
                let batchid=data.batchid;
                let sem=data.sem;
                let subcode=data.subcode;
                let subdataa=data.subdata;
                let subcredits=data.subcredits;
                let subname=data.subname;
                let subtype=data.subtype;
                let subsubdata=subdataa.students;
                let studentmarks=Object.keys(subsubdata).map((key) => [key, subsubdata[key]]);
                    batchlist.push(
                        <div key={index} className="accordion-item mb-5">
                        <h2 className="accordion-header" id={`BatchHeader${index}`}>
                        <button className="accordion-button bg-light bg-gradient teacherbut collapsed text-secondary rounded-3 fs-5 " type="button" data-bs-toggle="collapse" data-bs-target={`#BatchBody${index}`} aria-expanded="false" aria-controls={`BatchBody${index}`}>
                        <div className='col-md-10'>
                            <div className='row mb-1 ms-3 h5'><span><em>Batch Id:</em> &nbsp;<span id="user-name">{batchid}</span></span></div>
                            <div className='row mb-1 ms-3 h5'><span><em>Sem:</em> &nbsp;<span id="user-dep"></span>{sem}</span></div>
                            <div className='row mb-1 ms-3 h5'><span><em>Subject Code:</em> &nbsp;<span id="user-role">{subcode}</span></span></div>
                            <div className='row mb-1 ms-3 h5'><span><em>Name:</em> &nbsp;<span id="user-id"></span>{subname}</span></div>
                            <div className='row mb-1 ms-3 h5'><span><em>Type:</em> &nbsp;<span id="user-id"></span>{subtype}</span></div>
                            <div className='row mb-1 ms-3 h5'><span><em>Credits:</em> &nbsp;<span id="user-email">{subcredits}</span></span></div>
                        </div>
                        </button>
                        </h2>
                        <div id={`BatchBody${index}`} className="accordion-collapse collapse" aria-labelledby={`BatchHeader${index}`} data-bs-parent="#marksaccordion">
                            <div className="accordion-body">
                                <AccordionContent studentmarks={studentmarks} subtype={subtype} data={data}/>
                            </div>
                        </div>
                    </div>
                    )
            }
            
            return(batchlist);
        }
        return(
            <>
            {
                insertbatch()
            }

            </>
        );
    }
    else{
        return(
            <div className="h6 mt-3">
                No Classes are assigned to you.
            </div>
        );
    }
}


function AccordionContent({studentmarks,subtype,data}){

    let [asses,setAsses]=useState({});
    useEffect(() => {
        
        let db=ref(getDatabase(app));
        get(child(db, `Assesments`)).then((snapshot) => {
            let tempobjca=snapshot.val().CA;
            for (const key in tempobjca) {
                if(tempobjca[key]===true){
                    let inputlist=document.getElementsByClassName(key);
                    for (let index = 0; index < inputlist.length; index++) {
                        inputlist[index].disabled=false;
                    }
                }
            }
            let tempobjpa=snapshot.val().CA;
            for (const key in tempobjpa) {
                if(tempobjpa[key]===true){
                    let inputlist=document.getElementsByClassName(key);
                    for (let index = 0; index < inputlist.length; index++) {
                        inputlist[index].disabled=false;
                    }
                }
            }
            setAsses(snapshot.val());

        }).catch((error) => {
            console.error(error);
        });
    },
    []);

    if(studentmarks && studentmarks!==[] && subtype===`Theory`){
        return(
            <>
            <div className="container mt-3">
            <div className='container my-3 text-success h3'>
                Enter Marks
            </div>
            <div className='table-responsive'>
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col">Student Roll</th>
                    <th scope="col">Continous Assessment 1</th>
                    <th scope="col">Continous Assessment 2</th>
                    <th scope="col">Continous Assessment 3</th>
                    <th scope="col">Continous Assessment 4</th>
                    </tr>
                </thead>
                <tbody>
                    {

                        studentmarks.map((item)=>(
                                <tr key={item[0]} >
                                <td className="col-2">{item[0]}</td>
                                <td>
                                <input id={data.batchid+data.subcode+item[0]+`ca1`} type="number" disabled={true} min="0" max="25" defaultValue={item[1].ca1} className="form-control ca1" placeholder="Ca 1" aria-label="Ca 1"></input>
                                </td>
                                <td><input id={data.batchid+data.subcode+item[0]+`ca2`} type="number"  disabled={true} min="0" max="25"defaultValue={item[1].ca2} className="form-control ca2" placeholder="Ca 2" aria-label="Ca 2"></input></td>
                                <td><input id={data.batchid+data.subcode+item[0]+`ca3`} type="number" disabled={true} min="0" max="25"defaultValue={item[1].ca3} className="form-control ca3" placeholder="Ca 3" aria-label="Ca 3"></input></td>
                                <td><input id={data.batchid+data.subcode+item[0]+`ca4`} type="number" disabled={true} min="0" max="25"defaultValue={item[1].ca4} className="form-control ca4" placeholder="Ca 4" aria-label="Ca 4"></input></td>
                                </tr>
                        ))
                    }
                </tbody>
            </table> 
            </div>
            </div>
            <div className='container my-2 text-center'>
            <button onClick={()=>{
                savemarks(data,asses);
            }} className='btn btn-primary btn-lg'>Save All</button>
            </div>
            </>
        );
    }
    else if(studentmarks && studentmarks!==[] && subtype===`Practical`){
        return(
            <>
            <div className="container mt-2">
            <div className='container my-3 text-success h3'>
                Enter Marks
            </div>
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col">Student Roll</th>
                    <th scope="col">Practical Assessment 1</th>
                    <th scope="col">Practical Assessment 2</th>
                    </tr>
                </thead>
                <tbody>
                    {

                        studentmarks.map((item)=>(
                                <tr key={item[0]} >
                                <td className="col-2">{item[0]}</td>
                                <td>
                                <input id={data.batchid+data.subcode+item[0]+`pa1`} type="number" disabled={true} min="0" max="25" defaultValue={item[1].pa1} className="form-control ca1" placeholder="Ca 1" aria-label="Ca 1"></input>
                                </td>
                                <td><input id={data.batchid+data.subcode+item[0]+`pa2`} type="number"  disabled={true} min="0" max="25"defaultValue={item[1].pa2} className="form-control ca2" placeholder="Ca 2" aria-label="Ca 2"></input></td>
                                </tr>
                        ))
                    }
                </tbody>
            </table> 
            <div className='container my-2 text-center'>
            <button onClick={()=>{
                savemarks(data,asses);
            }} className='btn btn-primary btn-lg'>Save All</button>
            </div>
            </div>
            </>
        );
    }
    else{
        return(
            <div className="h6 mt-3">
                No students in the Batch
            </div>
        );
    }

}


function savemarks(subdata,asses){
    const updates = {};
    let batchid=subdata.batchid;
    let sem=`sem`+(subdata.sem.split("Semester")[1]);
    sem=`sem`+sem.split(" ")[1];
    let studentlist=subdata.subdata[`students`];
    let subcode=subdata.subcode;
    console.log(batchid)
    console.log(sem)
    console.log(studentlist)
    console.log(subcode)

    let ca,pa;
    for (const key in asses.CA) {
        if(asses.CA[key]===true)
            ca=key;
    }
    for (const key in asses.PA) {
        if(asses.PA[key]===true)
            pa=key;
    }
    if(subdata.subtype==='Theory'){
        for (const key in studentlist) {
            updates['/batches/' + `${batchid}/sems/${sem}/subs/${subcode}/students/${key}/${ca}`] = document.getElementById(`${batchid}${subcode}${key}${ca}`).value;
        }
    }
    else if(subdata.subtype==='Practical'){
        for (const key in studentlist) {
            updates['/batches/' + `${batchid}/sems/${sem}/subs/${subcode}/students/${key}/${pa}`] = document.getElementById(`${batchid}${subcode}${key}${pa}`).value;
        }
    }
    const db = getDatabase();
    update(ref(db), updates);
    showModal(`Changes made Successfully`,`Marks Updated`);

}






export { TeacherContentProfile };