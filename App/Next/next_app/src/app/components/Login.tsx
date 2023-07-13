"use client";
import CustomBtn from "@/components/CustomBtn";
// import { useRouter } from 'next/router';

function SignIn() {
	window.open("http://127.0.0.1:4000/auth/42");
}

const LoginComponent = () => {
	return (
		<div>
			<CustomBtn id='' disable={false} onClick={SignIn} >
				Sign With 42
			</CustomBtn>
		</div>
	)
}

export default LoginComponent;