import Navbar from "../components/navbar"

export default function Profile() {
    return (
        <body className="flex flex-col flex-auto bg-mantle text-text min-h-screen">
            <Navbar displayNavLinks={true}/>
            <div className="flex flex-col flex-auto items-center justify-center py-2">
                <a className="align-baseline"> Welcome to the profile page! </a>
            </div>
        </body>
    )
  }