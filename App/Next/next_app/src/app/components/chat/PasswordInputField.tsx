import { Dispatch, SetStateAction } from "react";

const PasswordInputField = ({value, setValue} : {value: string, setValue: Dispatch<SetStateAction<string>>} ) => {
	return (
		<div className="mb-4">
			<label htmlFor="password" className="block text-text text-sm font-bold mb-2">
				Password
			</label>
			<input
				type="password"
				id="password"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				className="w-full p-2 rounded bg-crust text-sm focus:outline-none focus:ring-1 focus:ring-mauve leading-tight"
			/>
		</div >
	)
}

export default PasswordInputField;