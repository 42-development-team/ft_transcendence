import { ChannelModel } from "@/app/utils/models";
import { FormEvent, useState } from "react";

type ChannelProps = {
    channel: ChannelModel
    joinChannel: (id: string, name: string, password?: string) => Promise<Response>
}

// Todo: Add channel icon
const JoinChannelItem = ({ channel: { id, name, icon, type, joined }, joinChannel }: ChannelProps) => {

    const [isJoined, setIsJoined] = useState<boolean>(joined);
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onJoin();
    }

    const onJoin = async () => {
        if (type === "protected" && !showPassword) {
            setShowPassword(!showPassword);
            setPassword("");
            return;
        }
        const response = await joinChannel(id, name, password);
        if (!response.ok) {
            const text = await response.text();
            if (text === "\"Wrong password\"") {
                setIsErrorVisible(true);
            }
            return;
        }
        setIsJoined(true);
        setShowPassword(false);
    }

    // Todo: protected channels
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
                            onClick={onJoin}>
                            Join</button>
                    }
                </div>
            </div>
            {/* Password input field */}
            {showPassword && type === "protected" &&
                <form className="px-2 items-end" onSubmit={onSubmit}>
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

export default JoinChannelItem;