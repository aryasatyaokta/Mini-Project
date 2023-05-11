import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import '../css/Login.css'
import Farmatics from '../assets/F2.png'
import firebaseConfig from '../config/firebase';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    
    const auth = getAuth(); 
    const naviget = useNavigate();  

    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [err, setErr] = useState("");
    
    // const signUp = (e) => {
    //   e.preventDefault();
    //   createUserWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //       console.log(userCredential)
    //   }).catch((error) => {
    //       console.log(error);
    //   })
    // }

    const handleSubmit = () => {
      if(!name && !email && !password){
        setErr('fill the all details!')
      } else if (!name){
        setErr("Enter your name")
      } else if (!email){
        setErr("Enter your email")
      } else if (!password){
        setErr("Enter your password")
      } else if (password.length < 7){
        setErr("Password need minimum 8 character")
      } else {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            updateProfile(auth.currentUser, {
              displayName: name, 
              // photoURL: "https://example.com/jane-q-user/profile.jpg"
            }).then(() => {
              // Profile updated!
              // ...
              setErr("");
              naviget("/")
            })
            // ...
          })
          .catch((error) => {
            console.log(error.code)
            if(error.code === 'auth/email-already-in-use'){
              setErr("Email already to use")
            } else {
              setErr("")
            }
        });
        setErr("")
      }
    }

    
  return (
    <>
    <section className="h-200 gradient-form" style={{fontFamily: "Poppins"}}>
    <div classNameName="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-xl-10 my-4">
        <div className="card rounded-3 text-black">
          <div className="row g-0">
            <div className="col-lg-6">
              <div className="card-body p-md-5 mx-md-4">

                <div className="text-center">
                  <h4 className="mt-1 mb-5 pb-1">Sign Up</h4>
                </div>

                <form>
                  <p>Please login to your account</p>

                  <div className="form-outline mb-4">
                    <input 
                    type="text" 
                    id="form2Example11" 
                    className="form-control"
                    placeholder="Nama Lengkap" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}/>
                  </div>

                  <div className="form-outline mb-4">
                    <input 
                    type="email" 
                    id="form2Example11" 
                    className="form-control"
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}/>
                  </div>

                  <div className="form-outline mb-4">
                    <input 
                    type="password" 
                    id="form2Example22" 
                    className="form-control"  
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                  </div>
                  <p className='text text-danger'>{err}</p>

                  <div className="text-center pt-1 mb-5 pb-1">
                    <button onClick={handleSubmit} className="btn btn-primary btn-block w-5 h-5" type="button" style={{width:"100%"}}>Sign Up</button>
                  </div>

                  <div className="d-flex align-items-center justify-content-center pb-4">
                    <p className="mb-0 me-2">You have already account?</p>
                    <Link to="/login">
                      <button type="button" className="btn btn-outline-primary">Sign In</button>
                    </Link>
                  </div>

                </form>

              </div>
            </div>
            <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
              <div className="text-white px-5 py-5 p-md-5 mx-md-5 text-center">
                <img src={Farmatics} style={{marginLeft:"100px", width:"30%"}} alt="" />
                <h4 className="mb-4" style={{marginLeft:"100px", marginTop:"50px", fontSize:"30px"}}>FARMATICS</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
     </div>
    </div>
    </section>
    </>
  )
}
