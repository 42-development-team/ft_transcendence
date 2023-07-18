"use client";
import { useEffect, useState } from "react";
import CustomBtn from "@/components/CustomBtn";

function LoginComponent() {

	const url: string = `${process.env.BACK_URL}/auth/login`;

	return (
		<div>
			<a href={url}>Sign With 42</a>
			{/* <CustomBtn id="" disable={false} onClick={SignIn}>
			  Sign With 42
			</CustomBtn> */}
		</div>
	  );;
}

export default LoginComponent;
