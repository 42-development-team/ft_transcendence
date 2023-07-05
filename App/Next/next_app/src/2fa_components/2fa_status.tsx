"use client";
import React, {useState, useEffect} from "react";
import { json } from "stream/consumers";

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
		const response = await fetch('http://localhost:4000/2fa/turn-on/dburain', { method: 'POST' });
		console.error('response brut:', JSON.stringify(response));
		const data = await response.json();
		const receivedImageUrl = data.imageUrl;
		setImageUrl(receivedImageUrl);
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