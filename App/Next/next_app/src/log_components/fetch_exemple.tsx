"use client";
import React from 'react'

interface userList {
	username: string,
    email?: string,
    password?: string,
    avatar?: string,
}[]


async function FetchingData() {
	try {
		const listUser = await fetch("http://localhost:4000/users", {
			// credentials: "include"
		});
		const dataReturn = listUser.json();
		console.log(dataReturn);
	}
	catch (err) {
		console.error(err);
	}

}

function FetchUserList() {
	return (
			<div>
				<button onClick={FetchingData}>Click Me</button>
			</div>
	)
}

export default FetchUserList;