"use client";
import React, {useState, useEffect} from "react";

//
// must be async ?
function SignIn() {
	console.log("Try to Sign");
}

const LoginComponent = () => {
	return (
		<div>
			<button 
				onClick={SignIn} 
				className="font-bold text-2xl rounded-lg text-base bg-mauve hover:bg-pink drop-shadow-xl p-3">
				Sign With 42
			</button>
		</div>
	)
}

export default LoginComponent;