"use client";
import React, { useState, useEffect } from 'react'


interface userList {
	username: string,
    email?: string,
    password?: string,
    avatar?: string,
}[]

const getUserList = async (): Promise<userList> => {
	const listUser = await fetch("http://localhost:4000/users/", {
		// credentials: "include"
	});
	return (await listUser.json());
}

async function fetchingData() {
	try {
		const list: userList = await getUserList();

		console.log(list);
	}
	catch (err) {
		console.error(err);
	}

}

async function FetchUserList() {
	// const userList = await getUserList();

	// error cause fetchingData return a promise!
	return (
		<div>
			<button onClick={fetchingData}>Click me get users on console.log</button>
		</div>
	)
}

export default FetchUserList;