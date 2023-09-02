import * as bcrypt from 'bcryptjs';

export function comparePassword(rawPassword: string, hashedPassword: string ) {
	return bcrypt.compare(rawPassword, hashedPassword);
}
