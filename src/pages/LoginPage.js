import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import '../css/Login.css'
import Farmatics from '../assets/F2.png'
import firebaseConfig from '../config/firebase';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  
  const auth = getAuth(); 
  const naviget = useNavigate();  

  const [name, setName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("");


  const handleSubmit = () => {
    if(!name && !email && !password){
      setErr('fill the all details!')
    } else if (!email){
      setErr("Enter your email")
    } else if (!password){
      setErr("Enter your password")
    } else if (password.length < 7){
      setErr("Password need minimum 8 character")
    } else {
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        setErr("")
        naviget("/","/obat","/pengeluaran")
        // ...
      })
      .catch((error) => {
        console.log(error.code)
        if(error.code === "auth/wrong-password"){
          setErr("Wrong password")
        } else if(error.code === "auth/user-not-found") {
          setErr("Wrong email")
        } else if(error.code === "auth/invalid-email"){
          setErr("invalid email")
        } else {
          setErr("")
        }
      });
    }
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      naviget("/","/obat","/pengeluaran")
    }
  });

  return (
    <>
    <section className="h-200 gradient-form" style={{fontFamily: "Poppins"}}>
    <div classNameName="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-xl-10 my-5">
        <div className="card rounded-3 text-black">
          <div className="row g-0">
            <div className="col-lg-6">
              <div className="card-body p-md-5 mx-md-4">

                <div className="text-center">
                  <h4 className="mt-1 mb-5 pb-1">Sign In</h4>
                </div>

                <form>
                  <p>Please login to your account</p>

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
                  <p className='text-danger'>{err}</p>

                  <div className="text-center pt-1 mb-5 pb-1">
                    <button onClick={handleSubmit} className="btn btn-primary btn-block w-5 h-5" type="button" style={{width:"100%"}}>Sign In</button>
                  </div>

                  <div className="d-flex align-items-center justify-content-center pb-4">
                    <p className="mb-0 me-2">Don't have an account?</p>
                    <Link to="/register" className='text-decoration-none btn-outline-primary'><button type="button" className="btn btn-outline-primary">Create new</button></Link>
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
