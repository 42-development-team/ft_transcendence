"use client";
import CustomBtn from "@/components/CustomBtn";
// import { useRouter } from 'next/router';

async function SignIn() {
	try {
		console.log("Try to Sign");
		
		const data = await fetch("http://127.0.0.1:4000/auth/42/");
		// , {
			// method: 'GET',
			// credentials: "include",
		// });
			// {
			// 	method: 'GET',
			// 	headers: myHeaders,
			// 	mode: 'cors',
			// 	cache: 'default',
			// }
		// );
		// const dataJson = await data.json();
		// console.log(dataJson);
		// const router = useRouter();
 		// router.push('http://localhost:4000/auth/42/callback');
	}
	catch (error: any) {
		console.error(error.message);
	}
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