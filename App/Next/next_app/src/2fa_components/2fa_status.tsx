"use client";
import React, {useState, useEffect} from "react";

async function toFetch() {
    const canva = await fetch("http://localhost:4000/2fa/turn-on/:username");
    const dataFormat = await canva.json();
    console.log(dataFormat);
    return (dataFormat);
}

function enable2FA() {
	console.log("Enable 2FA");
}

const Enable2FAComponent = () => {
	return (
		<div>
			<button onClick={enable2FA}>Enable 2FA</button>
		</div>
	)
}

export default Enable2FAComponent;
