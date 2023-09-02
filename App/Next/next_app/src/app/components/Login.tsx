function LoginComponent() {
	const url: string = `${process.env.BACK_URL}/auth/login` as string;
	
	return (
		<form action={url}>
			<button type="submit" className="bg-mauve rounded-md p-4 drop-shadow-md
			text-base font-bold text-lg hover:bg-pink">
				Sigin in with 42
			</button>
		</form>
	)
}

export default LoginComponent;