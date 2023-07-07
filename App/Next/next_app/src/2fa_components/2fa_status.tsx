"use client";
import React, {useState, useEffect} from "react";
import { json } from "stream/consumers";
import axios from "axios";
import Image from "next/image";

// async function toFetch() {
//     const canva = await fetch("http://localhost:4000/2fa/turn-on/1");
//     const dataFormat = await canva.json();
//     console.log(dataFormat);
//     return (dataFormat);
// }

function enable2FA() {
	console.log("Enable 2FA");
}

async function handleClick() {
	try {
		fetch('http://localhost:4000/users/1')
		.then((res) => {
		  res.json(),
		  console.log(res)
		})
		.then((data) => {
		  console.log(data)
		})
	//   const rep = await fetch('http://localhost:4000/2fa/turn-on/emacron');
	// //   console.dir(rep.text);
	//   console.log(rep.text.toString);
	// //   setImageUrl(rep.json());
	} catch (error) {
	  console.error('Error retrieving image URL:', error);
	}
  };

const Enable2FAComponent = () => {

	const [imageUrl, setImageUrl] = useState<string>('');
	useEffect(() => {	handleClick  })
	return (
		<div>
			<button onClick={handleClick}>Enable 2FA</button>
			{imageUrl != '' && <Image src={imageUrl} height="300" width="300" alt="QR Code"/>}
		</div>
	)
}
export default Enable2FAComponent;