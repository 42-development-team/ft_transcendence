export const config = () => ({
	frontPort: process.env.FRONT_PORT || 3000,
	backPort: process.env.BACK_PORT || 4000,
	ip: process.env.IP,
	jwtSecret: process.env.JWT_SECRET,
	jwtRefrehSecret: process.env.JWT_REFREH_SECRET,
	transcendenceToken: process.env.TRANSCENDENCE_TOKEN,
	transcendenceSecret: process.env.TRANSCENDENCE_SECRET,
	redirectUri: process.env.REDIRECT_URL,
});