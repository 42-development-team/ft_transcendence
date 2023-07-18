import ChatBar from "@/components/chat/ChatBar"

// const isLoggedIn = async () => {
//     await fetch('http://localhost:4000/auth/profile', { method: 'GET', credentials: "include" })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error("Not logged in");
//             }
//             console.log(response);
//         })
//         .catch(error => {

//             console.log(`error fetching profile : ${error}`)
//         });
//     // // if (!response.ok) {
//     // //     // logout();
//     // //     return;
//     // // }
//     // // const data = await response.json();
//     // // console.log(`login : ${data.login}`)
//     // // console.log(`id : ${data.sub}`)
//     // login(data.login);
//     // }
// }


export default function Home() {

    // useEffect(() => {
    //     isLoggedIn();
    // }, []);
    return (
        <div className="flex flex-auto w-full h-full">
            <ChatBar />
            <div className="w-full p-4 h-full">
                <a > You should land here after successful login </a>
            </div>
        </div>
    )
}