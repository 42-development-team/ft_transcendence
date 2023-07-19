"use client";

function LoginComponent() {

	const url: string = `${process.env.BACK_URL}/auth/login`;

	return (
		<div>
			<a href={url}>Sign With 42</a>
		</div>
	)
}

export default LoginComponent;