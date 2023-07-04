"use client";
import React, {useState, useEffect} from "react";

function enable2FA() {
	console.log("Enable 2FA");
}

const enable2FAComponent = () => {
	return (
		<div>
			<button onClick={enable2FA}>Enable 2FA</button>
		</div>
	)
}

export default enable2FAComponent;