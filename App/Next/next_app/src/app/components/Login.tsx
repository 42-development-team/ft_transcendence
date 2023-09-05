"use client";
import { useState } from "react";

function LoginComponent() {
	const [lock, setLock] = useState<boolean>(false);
	const url: string = `${process.env.BACK_URL}/auth/login` as string;

	return (
		<form action={url} onSubmit={() => setLock(true)}>
			<button type="submit" disabled={lock}
				className="bg-mauve rounded-md p-4 drop-shadow-md text-base font-bold text-lg 
					hover:bg-pink disabled:opacity-50 disabled:pointer-events-none">
				Sign in with 42
			</button>
		</form>
	)
}

export default LoginComponent;