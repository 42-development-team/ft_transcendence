"use client";
import React, { useRef, useState, useEffect } from 'react'
import { FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';
import FetchUserList from './fetch_exemple'


const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {

	// declare an object persistant when re-rendering with useRef()
	const userRef = useRef<HTMLInputElement>(null);
	const errRef = useRef<HTMLParagraphElement>(null);

	// get user input
	const [user, setUser] = useState<string>('')
	const [validName, setValidName] = useState<boolean>(false);
	const [userFocus, setUserFocus] = useState<boolean>(false);

	const [pwd, setPwd] = useState<string>('')
	const [validPwd, setValidPwd] = useState<boolean>(false);
	const [pwdFocus, setPwdFocus] = useState<boolean>(false);

	const [matchPwd, setMatchPwd] = useState<string>('')
	const [validMatch, setValidMatch] = useState<boolean>(false);
	const [matchFocus, setMatchFocus] = useState<boolean>(false);

	const [errMsg, setErrMsg] = useState<string>('');
	const [success, setSuccess] = useState<boolean>(false);

	// useEffect is used to relaunch function parameter if the dependencie array value is modified by client

	// .focus() to set the current object "userRef" ready to interact with the client interface
	useEffect(() => {
		if (userRef.current) {
			userRef.current.focus();
		}
	}, [])

	// check if userName is valid
	useEffect(() => {
		const result = USER_REGEX.test(user);
		console.log(result);
		console.log(user);
		setValidName(result);
	}, [user])
	
	// check if pwd is correct
	useEffect(() => {
		const result = PWD_REGEX.test(pwd);
		console.log(result);
		console.log(pwd);
		setValidPwd(result);
		const match = pwd === matchPwd;
		setValidMatch(match);
	}, [pwd, matchPwd])

	// if user chane "userName", "password" or "matchPwd", it will re-adapt the error message
	useEffect(() => {
		setErrMsg('');
	}, [user, pwd, matchPwd])

	return (
		<section>
			<p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
			<h1>Register</h1>
			<form>
				<label htmlFor="username">
					Username:
					<span className={validName ? "valid" : "hide"}>

					</span><br />
					<span className={validName || !user ? "hide" : "invalid"}>

					</span>
				</label>
				<input 
					type="text"
					id="username" // id should match label htmlFor
					ref={userRef} // allow to set focus on the input
					autoComplete="off" // "off" cause we don't want to see previous values print in the field
					onChange={(e) => setUser(e.target.value)} // the event 'e' will set the "user" variable to the current changes in the field
					required
					aria-invalid={validPwd ? "false" : "true"} // 
					aria-describedby="uidnote" //
					onFocus={() => setUserFocus(true)}
					onBlur={() => setUserFocus(false)}
				/>
				<p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
					4 to 24 characters.<br />
					Must begin with a letter.<br />
					Letters, numbers, underscores, hyphens allowed.
				</p>

				<label htmlFor="password">
					Password:
					<span className={validPwd ? "valid" : "hide"}>

					</span>
					<span className={validPwd || !pwd ? "hide" : "invalid"}>

					</span><br />
				</label>
				<input
					type="password"
					id="password"
					onChange={(e) => setPwd(e.target.value)}
					required
					aria-invalid={validPwd ? "false" : "true"}
					aria-describedby="uidnote"
					onFocus={() => setPwdFocus(true)}
					onBlur={() => setPwdFocus(false)}
				/>
				<p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
					8 to 24 characters.<br />
					Must include uppercase and lowercase letters, a number and a special charater.<br />
					Allowed special characters: 
					<span aria-label="exclamation mark">!</span>
					<span aria-label="at symbol">@</span>
					<span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span>
					<span aria-label="percent">%</span>
				</p>

				<label htmlFor="password">
					Confirm Password:
					<span className={validMatch && matchPwd ? "valid" : "hide"}>

					</span>
					<span className={validMatch || !matchPwd ? "hide" : "invalid"}>

					</span><br />
				</label>
				<input
					type="password"
					id="confirm_pwd"
					onChange={(e) => setMatchPwd(e.target.value)}
					required
					aria-invalid={validMatch ? "false" : "true"}
					aria-describedby="confirmnote"
					onFocus={() => setMatchFocus(true)}
					onBlur={() => setMatchFocus(false)}
				/>
				<p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
					Must match the first password input field.
				</p>
			</form>
		</section>
	)
}

export default Register;