"use client";
import { useEffect, useState } from "react";
import CustomBtn from "@/components/CustomBtn";

function LoginComponent() {

	return (
		<div>
			<a href="http://localhost:4000/auth/login">Sign With 42</a>
			{/* <CustomBtn id="" disable={false} onClick={SignIn}>
			  Sign With 42
			</CustomBtn> */}
		</div>
	  );;
}

export default LoginComponent;
