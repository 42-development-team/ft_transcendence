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
			<button onClick={SignIn}>Sign With 42</button>
		</div>
	)
}

export default LoginComponent;