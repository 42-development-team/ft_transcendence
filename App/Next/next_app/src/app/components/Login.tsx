"use client";
import { useEffect, useState } from "react";
import CustomBtn from "@/components/CustomBtn";

function LoginComponent() {

	const baseUrl: string = `http://${process.env.IP}:${process.env.BACK_PORT}` as string;
	const url: string = baseUrl + '/auth/login';

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
