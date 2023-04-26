import React from 'react'
import gbLogin from '../assets/login.png'

export default function LoginPage() {
  return (
    <>
    <section className="vh-100">
        <div className="container py-5 h-100">
            <div className="row d-flex align-items-center justify-content-center h-100">
            <div className="col-md-8 col-lg-7 col-xl-6">
                <img
                src={gbLogin}
                className="img-fluid"
                style={{width: "500px"}}
                alt="Log image"
                />
            </div>
            <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <h2>Login</h2>
                <form>
                {/* Email input */}
                <div className="form-outline mb-4">
                    <input
                    type="email"
                    id="form1Example13"
                    className="form-control form-control-lg"
                    />
                    <label className="form-label" htmlFor="form1Example13">
                    Email
                    </label>
                </div>
                {/* Password input */}
                <div className="form-outline mb-4">
                    <input
                    type="password"
                    id="form1Example23"
                    className="form-control form-control-lg"
                    />
                    <label className="form-label" htmlFor="form1Example23">
                    Password
                    </label>
                </div>
                {/* Submit button */}
                <button type="submit" className="btn btn-outline-primary btn-lg btn-block col-xl-12">
                    Log In
                </button>
                <a href="#">don't have accounts?</a>
                </form>
            </div>
            </div>
        </div>
    </section>

    </>
  )
}
