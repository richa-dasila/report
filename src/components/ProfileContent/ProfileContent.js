
import { getAuth,onAuthStateChanged} from "firebase/auth";
import { getDatabase , ref, child, get,set} from "firebase/database";
import {app} from "../../Firebase/firebase";
import { useEffect } from 'react'
import { useState } from "react";
import { AdminContentProfile } from "../AdminContentProfile/AdminContentProfile"
import { StudentContentProfile } from "../StudentContentProfile/StudentContentProfile"
import { TeacherContentProfile } from "../TeacherContentProfile/TeacherContentProfile";



function ProfileContent(){


    const [role, setRole] = useState(undefined);
    useEffect(() => { 


        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const uid = user.uid;
            console.log(uid);
            let db=ref(getDatabase(app));
            get(child(db, `users/${uid}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    setRole(snapshot.val().role);
                } else {
                // console.log("No data available");
                // setRole(snapshot.val().role);
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
                <AdminContentProfile/>
            </>
        );
    else if(role===`student`)
        return(
            <>
                <StudentContentProfile/>
            </>
        );
    else if(role===`teacher`)
        return(
            <>
                <TeacherContentProfile/>
            </>
        ); 
    else {const auth = getAuth();
        const user = auth.currentUser;
        console.log(user.uid,user.email)
        let uid = user.uid;
        let email=user.email.split ("@");
        let db=ref(getDatabase(app));
        get(child(db, `users/${uid}/`)).then((snapshot) => {
            if(snapshot.val()===null){
             get(child(db, `unassingedusers/${email[0]}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                } else {
                console.log("No data available");
                let db=(getDatabase(app));
                set(ref(db, `unassingedusers/${email[0]}/`), {
                    domain:`@`+email[1],
                    uid:uid
                });
                }
            }).catch((error) => {
                console.error(error);
            });
            }else{

            }

        }).catch((error) => {
            console.error(error);
        });
        return(
            <div className="h3 my-5 text-center">
            Ask Admin to assign you a role
            </div>
        );
    }

}


export { ProfileContent };
