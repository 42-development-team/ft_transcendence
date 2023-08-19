"use client";

function LoginComponent() {

	const url: string = `${process.env.BACK_URL}/auth/login` as string;
	
	return (
		<div className="bg-mauve rounded-md p-4 drop-shadow-md
			text-base font-bold text-lg
			hover:bg-pink cursor-pointer">
			<a href={url}>Sign With 42</a>
		</div>
	)
}

export default LoginComponent;