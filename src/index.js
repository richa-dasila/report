import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Navbar} from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import {Login } from './components/Login/Login';
import { ProfileCard } from './components/ProfileCard/ProfileCard';
import { HashRouter, Route , Routes} from 'react-router-dom';
import { Loadingscreen } from './components/Loadingscreen/Loadingscreen';
import { ProfileContent } from './components/ProfileContent/ProfileContent'
import { ManageCourses } from './components/AdminWorkPlace/ManageCourses/ManageCourses';
import { ManageBatches } from './components/AdminWorkPlace/ManageBatches/ManageBatches';
import { ManageStudents } from './components/AdminWorkPlace/ManageStudents/ManageStudents';
import { ManageTeachers } from './components/AdminWorkPlace/ManageTeachers/ManageTeachers';
import { ManageAssesment } from './components/AdminWorkPlace/ManageAssesment/ManageAssesment';
import { MainModal } from './components/MainModal/MainModal';

ReactDOM.render(
  <HashRouter >
    <Loadingscreen/>
    <Navbar/>
    <MainModal/>
      <Routes basename='academic-report'>
        <Route path="/" element={<Login/>} />
        <Route path="Profile" element={<><ProfileCard/> <ProfileContent/></>} />
        <Route path="Profile/ManageCourses" element={<><ProfileCard/> <ManageCourses/></>} />
        <Route path="Profile/ManageBatches" element={<><ProfileCard/> <ManageBatches/></>} />
        <Route path="Profile/ManageStudents" element={<><ProfileCard/> <ManageStudents/></>} />
        <Route path="Profile/ManageTeachers" element={<><ProfileCard/> <ManageTeachers/></>} />
        <Route path="Profile/ManageAssesment" element={<><ProfileCard/> <ManageAssesment/></>} />
      </Routes>
    <Footer/>
  </HashRouter>
  ,
  document.getElementById('root')
);


