import Navbar from "../components/navbar"

export default function Profile() {
    return (
        <body className="bg-mantle text-text">
            <Navbar displayNavLinks={true}/>
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <a> Welcome to the profile page! </a>
            </div>
        </body>
    )
  }