import './ManageAssesment.css';
import { getAuth,onAuthStateChanged} from "firebase/auth";
import { getDatabase , ref, child, get,set } from "firebase/database";
import {app} from "../../../Firebase/firebase";
import { useEffect } from 'react'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BackButton } from "../../BackButton/BackButton";
import { activateloadingscreen, deactivateloadingscreen } from "../../Loadingscreen/Loadingscreen";
import { showModal } from '../../MainModal/MainModal';

const auth = getAuth();
let db=ref(getDatabase(app));
let db1=getDatabase(app);

function ManageAssesment(){
    let navigate=useNavigate();
    const [role, setRole] = useState(undefined);
    useEffect(() => {
        activateloadingscreen(`Loading your Page...`);
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const uid = user.uid;
            get(child(db, `users/${uid}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    setRole(snapshot.val().role);
                    deactivateloadingscreen();
                } else {
                console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
            get(child(db, `Assesments`)).then((snapshot) => {
                if (snapshot.exists()) {
                    if(snapshot.val().CA.ca1===true)
                        document.getElementById("ca1").checked="true";
                    else if (snapshot.val().CA.ca2===true)
                        document.getElementById("ca2").checked="true";
                    else if (snapshot.val().CA.ca3===true)
                        document.getElementById("ca3").checked="true";
                    else
                        document.getElementById("ca4").checked="true";      
                        
                    if(snapshot.val().PA.pa1===true)
                        document.getElementById("pa1").checked="true";
                    else if (snapshot.val().PA.pa2===true)
                        document.getElementById("pa2").checked="true";
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
                   <em> Manage Assesment</em>
                </div>
            </div>
            <div className="container-fluid p-3 px-5">
                <div className="accordion accordion-flush" id="accordionFlushExample">
                    <div className="accordion-item mb-5">
                        <h2 className="accordion-header" id="flush-headingOne">
                            <button id="manageca"className="accordion-button rounded-3 collapsed text-white fs-3 " type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                Manage CA
                            </button>
                        </h2>
                        <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                            <div className="accordion-body">
                                <div className="form-check my-2">
                                    <input className="form-check-input" type="radio" name="ca" id="ca1"></input>
                                    <label className="form-check-label" htmlFor="ca1">
                                     Start Continuous Assessment 1
                                    </label>
                                </div>
                                <div className="form-check my-2">
                                    <input className="form-check-input" type="radio" name="ca" id="ca2" ></input>
                                    <label className="form-check-label" htmlFor="ca2">
                                        Start Continuous Assessment 2
                                    </label>
                                </div>
                                <div className="form-check my-2">
                                    <input className="form-check-input" type="radio" name="ca" id="ca3" ></input>
                                    <label className="form-check-label" htmlFor="ca3">
                                        Start Continuous Assessment 3
                                    </label>
                                </div>
                                <div className="form-check my-2">
                                    <input className="form-check-input" type="radio" name="ca" id="ca4" ></input>
                                    <label className="form-check-label" htmlFor="ca4">
                                        Start Continuous Assessment 4
                                    </label>
                                </div>
                                <div className='container-fluid text-center mt-4'>
                                    <button   type="button" onClick={() =>submitcapa(0)} className="btn btn-primary btn-lg ">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="flush-headingTwo">
                        <button id="managepa" className="accordion-button collapsed rounded-3 text-white fs-3 " type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                            Manage PA
                        </button>
                        </h2>
                        <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            <div className="form-check my-2">
                                    <input className="form-check-input" type="radio" name="pa" id="pa1"></input>
                                    <label className="form-check-label" htmlFor="pa1">
                                     Start Practical Continuous Assessment 1
                                    </label>
                                </div>
                                <div className="form-check my-2">
                                    <input className="form-check-input" type="radio" name="pa" id="pa2" ></input>
                                    <label className="form-check-label" htmlFor="pa2">
                                        Start Practical Continuous Assessment 2
                                    </label>
                                </div>
                                <div className='container text-center mt-4'>
                                    <button   type="button"  onClick={() =>submitcapa(1)} className="btn btn-primary btn-lg">Submit</button>
                                </div>
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

function submitcapa(cp){
    activateloadingscreen(`Submitting your Request...`);
    let ca1=false,ca2=false,ca3=false,ca4=false,pa1=false,pa2=false;
    if(document.getElementById("ca1").checked===true)
        ca1=true;
    else if(document.getElementById("ca2").checked===true)
        ca2=true;
    else if(document.getElementById("ca3").checked===true)
        ca3=true;
    else
        ca4=true;
    if(document.getElementById("pa1").checked===true)
        pa1=true;
    else
        pa2=true;
    
    if(cp===0){
        set(ref(db1, 'Assesments/CA'), {
            ca1:ca1,
            ca2:ca2,
            ca3:ca3,
            ca4:ca4
        });  
    }
    else{
        set(ref(db1, 'Assesments/PA'), {
            pa1:pa1,
            pa2:pa2,
        });
    }
    deactivateloadingscreen();
    showModal(`Chages have been made.`,`Assesment period changed successfully.`);
 
}

export { ManageAssesment };