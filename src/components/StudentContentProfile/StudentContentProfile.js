import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getAuth,onAuthStateChanged} from "firebase/auth";
import { getDatabase , ref, child, get} from "firebase/database";
import {app} from "../../Firebase/firebase";

//Add disabling
function StudentContentProfile(){
    
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

    if(role===`student`)
    return(
        <>
        <div className="contaner-fluid">
            <div className="container">
                <StudentBatch/>
            </div>
        </div>
        </>
    );
    else if(role===`teacher` || role===`admin`)
        navigate('/',{replace:true});
    else
    return(
        <>
        </>
    );
}



function StudentBatch(){
    let [batches,setBatches]=useState([]);
    let [batchdata,setBatchData]=useState([]);
    let [studentroll,setStudentroll]=useState();
    useEffect(() => {
   
        fetchdata();
    },
    []);
    async function fetchdata(){
        const auth=getAuth();
        let uid=auth.currentUser.uid;
        let db=ref(getDatabase(app));
        let temp=[];
        await get(child(db, `users/${uid}`)).then((snapshot) => {
            setStudentroll(snapshot.val().roll);
            get(child(db, `students/${snapshot.val().roll}`)).then((snapshot) => {
              getbatchdata(snapshot.val().batches);
                for (const key in snapshot.val().batches) {
                        temp.push(key)
                }
            }).catch((error) => {
                console.error(error);
            });  
        }).catch((error) => {
            console.error(error);
        });
        setBatches(temp);
    }
    async function getbatchdata(batches){
        let db=ref(getDatabase(app));
        let tempbatchdata=[] 
        for (const key in batches) {
            await get(child(db, `batches/${key}`)).then((snapshot) => {
                tempbatchdata.push(snapshot.val());
            }).catch((error) => {
                console.error(error);
            }); 
        } 
        setBatchData(tempbatchdata);
    }


    function populatetabletheory(semdata){
        let sublist=[]
        if(semdata && semdata!==null && semdata!==undefined){
            for (const key in semdata) {
                if(semdata[key].type===`Theory`){
                    let subcode=key;
                    let subname=semdata[key].name;
                    let subcredits=semdata[key].credits;
                    let marks=semdata[key].students[studentroll];
                    sublist.push(
                                    <tr key={subcode} >
                                    <td className="text-center">{subcode}</td>
                                    <td className="text-center">{subname}</td>
                                    <td className="text-center">{marks.ca1}</td>
                                    <td className="text-center">{marks.ca2}</td>
                                    <td className="text-center">{marks.ca3}</td>
                                    <td className="text-center">{marks.ca4}</td>
                                    <td className="text-center">{subcredits}</td>
                                    </tr>
                    )
                }
                
            }
            return sublist;
        }
        else{
            return (<>
            </>
            );
        }
    }

    function populatetableprcatical(semdata){
        let sublist=[]
        if(semdata && semdata!==null && semdata!==undefined){
            for (const key in semdata) {
                if(semdata[key].type===`Practical`){
                    let subcode=key;
                    let subname=semdata[key].name;
                    let subcredits=semdata[key].credits;
                    let marks=semdata[key].students[studentroll];
                    sublist.push(
                                    <tr key={subcode} >
                                    <td className="text-center">{subcode}</td>
                                    <td className="text-center">{subname}</td>
                                    <td className="text-center">{marks.pa1}</td>
                                    <td className="text-center">{marks.pa2}</td>
                                    <td className="text-center">{subcredits}</td>
                                    </tr>
                    )
                }
                
            }
            return sublist;
        }
        else{
            return (<>
            </>
            );
        }
    }

    function particularbatch(batch,batchdata){
        let semlist=[];
        let totalsem=batchdata.totalsem;
        for (let index = 1; index <= totalsem; index++) {
            let semdata=batchdata.sems[`sem${index}`].subs
            semlist.push(
                <div key={index} className="accordion-item mb-5">
                <h2 className="accordion-header" id={`StudentSemHeader${index}`}>
                <button id={`StudentSemHeaderbutton${index}`} className="accordion-button bg-light bg-gradient teacherbut collapsed text-secondary rounded-3 fs-5 " type="button" data-bs-toggle="collapse" data-bs-target={`#StudentSemBody${index}`} aria-expanded="false" aria-controls={`StudentSemBody${index}`}>
                <div className='col-md-10'>
                    Semester{index}
                </div>
                </button>
                </h2>
                <div id={`StudentSemBody${index}`} className="accordion-collapse collapse" aria-labelledby={`StudentSemHeader${index}`} data-bs-parent="#batchacc">
                    <div className="accordion-body">
                        <div className="container">
                            <div className="h5 text-success">
                                Theory
                            </div>
                            <div className='table-responsive'>
                                <table className="table">
                                    <thead>
                                        <tr>
                                        <th className="text-center" scope="col">Subject Code</th>
                                        <th className="col-3 text-center" scope="col">Subject Name</th>
                                        <th  className="text-center" scope="col">C.A. 1</th>
                                        <th className="text-center" scope="col">C.A. 2</th>
                                        <th className="text-center" scope="col">C.A. 3</th>
                                        <th className="text-center" scope="col">C.A. 4</th>
                                        <th className="text-center" scope="col">Credits</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {populatetabletheory(semdata)}
                                    </tbody>
                                </table> 
                            </div>
                        </div>
                        <div className="container">
                            <div className="h5 mt-3 text-success">
                                Practical
                            </div>
                            <div className='table-responsive'>
                                <table className="table">
                                    <thead>
                                        <tr>
                                        <th className="text-center" scope="col">Subject Code</th>
                                        <th className="col-3 text-center" scope="col">Subject Name</th>
                                        <th  className="text-center" scope="col">P.A. 1</th>
                                        <th className="text-center" scope="col">P.A. 2</th>
                                        <th className="text-center" scope="col">Credits</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {populatetableprcatical(semdata)}
                                    </tbody>
                                </table> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )
            
        }

        return semlist;
    }

    function populatestudentbatch(batches,batchdata){
        let batchlist=[];
        for (let index = 0; index < batches.length; index++) {
            batchlist.push(
                <div key={index} className="accordion-item mb-5">
                <h2 className="accordion-header" id={`StudentBatchHeader${index}`}>
                <button className="accordion-button bg-light bg-gradient teacherbut collapsed text-secondary rounded-3 fs-5 " type="button" data-bs-toggle="collapse" data-bs-target={`#StudentBatchBody${index}`} aria-expanded="false" aria-controls={`StudentBatchBody${index}`}>
                <div className='col-md-10'>
                    <div className='row mb-1 ms-3 h5'><span><em>Batch Id:</em> &nbsp;<span id="user-name">{batches[index]}</span></span></div>
                    <div className='row mb-1 ms-3 h5'><span><em>Batch Name:</em> &nbsp;<span id="user-dep"></span>{batchdata[index].name}</span></div>
                    <div className='row mb-1 ms-3 h5'><span><em>Current Semester:</em> &nbsp;<span id="user-role">{batchdata[index].curr}</span></span></div>
                    <div className='row mb-1 ms-3 h5'><span><em>Total Semester:</em> &nbsp;<span id="user-id"></span>{batchdata[index].totalsem}</span></div>
                </div>
                </button>
                </h2>
                <div id={`StudentBatchBody${index}`} className="accordion-collapse collapse" aria-labelledby={`StudentBatchHeader${index}`} data-bs-parent="#studentacc">
                    <div className="accordion-body">
                        <div className="accordion accordion-flush my-3" id="batchacc">
                            {particularbatch(batches[index],batchdata[index])}
                            {/* {particularbatch(batches[index],batchdata[index])} */}
                        </div>
                    </div>
                </div>
            </div>
            );
        }
        return (batchlist);
    }

    if(batches && batches!==null && batches!==undefined){
        return(
            <>
            <div className="accordion accordion-flush my-5" id="studentacc">
            {populatestudentbatch(batches,batchdata)}   
            </div>
            </>
        );
    }
    else{
        return(
            <>
            <div className="text-center h5">
            You are not enrolled to any Batch yet.
            </div>
            </>
        );
    }


}


export { StudentContentProfile };
