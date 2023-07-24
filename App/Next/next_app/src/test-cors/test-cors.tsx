"use client";
import React, {useState, useEffect} from 'react';

async function toFetch() {
    const data = await fetch(`${process.env.BACK_URL}/users`);
    const dataFormat = await data.json();
    console.log(dataFormat);
    return (dataFormat);
}

// fetch("http://localhost:4000/users") // return pormise

function Component() {

    const [click, setClick] = useState(0);

    useEffect(() => {
        toFetch();
    }, [click]);

    return (
        <div>
            <button onClick={() => setClick(click + 1)}>Coucou</button>
        </div>
    )
}
