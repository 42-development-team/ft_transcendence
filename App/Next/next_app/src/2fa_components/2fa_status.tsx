"use client";
import React, {useState, useEffect} from "react";
import { json } from "stream/consumers";
import axios from "axios";

// async function toFetch() {
//     const canva = await fetch("http://localhost:4000/2fa/turn-on/1");
//     const dataFormat = await canva.json();
//     console.log(dataFormat);
//     return (dataFormat);
// }

function enable2FA() {
	console.log("Enable 2FA");
}

const Enable2FAComponent = () => {

	const [imageUrl, setImageUrl] = useState<string>('');

	const handleClick = async () => {
	  try {
		const res = await fetch('http://localhost:4000/2fa/turn-on/emacron', { method: 'POST' });
		const data = await res.json();
		setImageUrl((await data).imageUrl);
	  } catch (error) {
		console.error('Error retrieving image URL:', error);
	  }
	};

	return (
		<div>
			<button onClick={handleClick}>Enable 2FA</button>
			{imageUrl && <img src={imageUrl} alt="QR Code" />}
		</div>
	)
}

export default Enable2FAComponent;