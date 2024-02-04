
import * as firebase from "firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyB9UE8YQxw5_PMtPE0wL3pmZlj4d-4h_mI",
  authDomain: "academic-report-b725f.firebaseapp.com",
  databaseURL: "https://academic-report-b725f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "academic-report-b725f",
  storageBucket: "academic-report-b725f.appspot.com",
  messagingSenderId: "966863011330",
  appId: "1:966863011330:web:2e8bf20c0190f8f804b11b"
};
// export const firebaseConfig = {
//   apiKey: "AIzaSyCVg3P0SvLOZK3zWObp3sZIg7vL_6mQp64",
//   authDomain: "finalyearproject22-6db2e.firebaseapp.com",
//   databaseURL: "https://finalyearproject22-6db2e-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "finalyearproject22-6db2e",
//   storageBucket: "finalyearproject22-6db2e.appspot.com",
//   messagingSenderId: "490591073638",
//   appId: "1:490591073638:web:0b093826a2deb2bdcf04a7"
// };

const app=firebase.initializeApp(firebaseConfig);
export {firebase,app};


