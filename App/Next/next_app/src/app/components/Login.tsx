"use client";
import CustomBtn from "@/components/CustomBtn";

//
// must be async ?
function SignIn() {
	console.log("Try to Sign");
}

const LoginComponent = () => {
	return (
		<div>
			<CustomBtn onClick={SignIn} >
				Sign With 42
			</CustomBtn>
		</div>
	)
}

export default LoginComponent;