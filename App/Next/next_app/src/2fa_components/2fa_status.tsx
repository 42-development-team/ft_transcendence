"use client";
import React, {useState, useEffect} from "react";

async function toFetch() {
    const canva = await fetch("http://localhost:4000/2fa/turn-on/1");
    const dataFormat = await canva.json();
    console.log(dataFormat);
    return (dataFormat);
}

function enable2FA() {
	console.log("Enable 2FA");
}

const Enable2FAComponent = () => {

	const [click, setClick] = useState(0);

    useEffect(() => {
        toFetch();
    }, [click]);

	return (
		<div>
			<button onClick={() => setClick(click + 1)}>Enable 2FA</button>
		</div>
	)
}

export default Enable2FAComponent;