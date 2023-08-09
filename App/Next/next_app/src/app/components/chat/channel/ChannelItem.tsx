import { ChannelModel } from "@/app/utils/models";
import { useState } from "react";

type ChannelProps = {
    channel: ChannelModel
}

// Todo: Add channel icon
const ChannelItem = ({ channel: { id, name, icon, type, joined } }: ChannelProps) => {

    const [isJoined, setIsJoined] = useState<boolean>(joined);
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);

    const JoinChannel = async () => {
        console.log("Joining channel " + name);
        if (type === "public") {
            const response = await fetch(`${process.env.BACK_URL}/chatroom/${id + 5}/join`,
                { credentials: "include", method: "PATCH" });
            if (!response.ok) {
                console.log("Error joining channel: " + await response.text());
                return;
            }
            setIsJoined(true);
            // Todo : how to update channel list? - using socket?
        }
        else if (type === "private") {
            if (!showPassword) {
                setShowPassword(!showPassword);
                setPassword("");
                return;
            }
            const response = await fetch(`${process.env.BACK_URL}/chatroom/${id}/join`,
                {
                    credentials: "include", method: "PATCH",
                    body: JSON.stringify({ password: password }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            if (!response.ok) {
                if (await response.text() === "\"Wrong password\"") {
                    setIsErrorVisible(true);
                }
                return;
            }
            setIsJoined(true);
        }
    }
    // Todo: why hitting enter on form refreshes page?
    return (
        <div className="flex flex-col flex-grow">
            <div className="flex flex-grow relative items-center justify-between mt-2 mb-2 hover:bg-surface1 rounded py-1 px-2 mr-2">
                <div className="flex items-center w-80">
                    <h1 className="font-medium text-md">{name}</h1>
                </div>
                <div className="relative inline-block text-left">
                    {isJoined
                        ? <div className="inline-flex justify-center w-full rounded-full px-3 py-2 font-semibold text-sm text-surface1 bg-text">
                            Joined</div>
                        : <button
                            type="button"
                            className="inline-flex justify-center w-full rounded-full px-5 py-2 font-semibold text-sm bg-surface0 hover:bg-base"
                            onClick={JoinChannel}>
                            Join</button>
                    }
                </div>
            </div>
            {/* Password input field */}
            {showPassword && type === "private" &&

                <form className="px-2 items-end" onSubmit={JoinChannel}>
                    <input
                        type="password" value={password}
                        className="w-full p-2 rounded bg-crust text-sm focus:outline-none focus:ring-1 focus:ring-mauve"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        placeholder="password" />
                </form>
            }
            {isErrorVisible && 
                <p className="text-red text-center font-semibold">Wrong password</p>
            }
        </div>
    )
}

export default ChannelItem;