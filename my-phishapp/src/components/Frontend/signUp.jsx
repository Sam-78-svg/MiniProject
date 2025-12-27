import React, { useState } from "react";
import '../../Styling/Frontend/login.css';

function SignUp({ setView, setError, error }) {
    const [signUsername, setSignUsername] = useState("");
    const [signEmail, setSignEmail] = useState("");
    const [signPassword, setSignPassword] = useState("");
    const [signConfirmPassword, setSignConfirmPassword] = useState("");

    // Handle sign up form submit
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");
        if (signPassword !== signConfirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        try {
            const res = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: signUsername,
                    email: signEmail,
                    password: signPassword
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                alert("Sign up successful! Please login.");
                setView("login");
            } else {
                setError(data.message || "Sign up failed.");
            }
        } catch (err) {
            setError("Server error. Please try again.");
        }
    };

    return (
        <div className="card-body2">
            <h3 className="text-center mb-4">Sign Up</h3>
            <form onSubmit={handleSignUp}>
                <div className="mb-3">
                    <label htmlFor="signup-username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="signup-username"
                        value={signUsername}
                        onChange={e => setSignUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="signup-email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="signup-email"
                        value={signEmail}
                        onChange={e => setSignEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="signup-password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="signup-password"
                        value={signPassword}
                        onChange={e => setSignPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="signup-confirm-password" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="signup-confirm-password"
                        value={signConfirmPassword}
                        onChange={e => setSignConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger py-1">{error}</div>}
                <button type="submit" className="btn btn-primary w-100">Sign Up</button>
            </form>
            <div className="mt-3 text-center d-flex justify-content-between">
                <a href="#" className="forgetPass" onClick={e => { e.preventDefault(); setView("forget"); }}>Forgot Password?</a>
                <a href="#" className="ms-3" onClick={e => { e.preventDefault(); setView("login"); }}>Login</a>
            </div>
        </div>
    );
}

export default SignUp;
