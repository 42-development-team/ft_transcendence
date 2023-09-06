import { ChannelModel } from "@/app/utils/models";
import { FormEvent, useEffect, useState } from "react";
import { Alert } from '@material-tailwind/react';
import { AlertSuccessIcon } from '../../alert/AlertSuccessIcon';
import { AlertErrorIcon } from "../../alert/AlertErrorIcon";
import { delay } from "@/app/utils/delay";

type ChannelProps = {
    channel: ChannelModel
    joinChannel: (id: string, name: string, password?: string) => Promise<string>
}

// Todo: Add channel icon
const JoinChannelItem = ({ channel: { id, name, icon, type, joined, banned }, joinChannel }: ChannelProps) => {
    const [isJoined, setIsJoined] = useState<boolean>(joined);
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [lockSubmit, setLockSubmit] = useState<boolean>(false);

    const [openAlert, setOpenAlert] = useState(false);
    const [error, setError] = useState(false)

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onJoin();
    }

    useEffect(() => {
        setIsJoined(joined);
    }, [joined])

    const onJoin = async () => {
        setError(false);
        if (type === "protected") {
            if (!showPassword) {
                setShowPassword(!showPassword);
                setPassword("");
                return;
            } else if (password === "") {
                setError(true);
                setOpenAlert(true);
                return;
            }
        }
        setLockSubmit(true);
        const response = await joinChannel(id, name, password);
        if (response === "Wrong password") {
            setError(true);
            setOpenAlert(true);
        } else {
            setIsJoined(true);
            setShowPassword(false);
            setOpenAlert(true);
        }
        await delay(1250);
        setLockSubmit(false);
        setOpenAlert(false);
    }

    return (
        <div className="flex flex-col flex-grow">
            <div className="flex flex-grow relative items-center justify-between mt-2 mb-2 hover:bg-surface1 rounded py-1 px-2 mr-2">
                <div className="flex items-center w-80">
                    <h1 className="font-medium text-md break-all">{name}</h1>
                </div>
                <div className="relative inline-block text-left">
                    {!banned && (isJoined
                        ? <div className="inline-flex justify-center w-full rounded-full px-3 py-2 font-semibold text-sm text-base bg-text">
                            Joined</div>
                        : <button
                            type="button"
                            className="inline-flex justify-center w-full rounded-full px-5 py-2 font-semibold text-sm bg-surface0 hover:bg-base"
                            onClick={onJoin}>
                            Join</button>
                    )}
                    {banned &&
                        <div className="inline-flex justify-center w-full rounded-full px-3 py-2 font-semibold text-sm text-base bg-red">
                            Banned</div>
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
            <Alert
                className="mb-4 mt-4 p-2 text-text border-mauve border-[1px] break-all"
                variant='gradient'
                open={openAlert}
                icon={error ? <AlertErrorIcon /> : <AlertSuccessIcon />}
                animate={{
                    mount: { y: 0 },
                    unmount: { y: 100 },
                }}>
                {error && password=="" && <p>Password can not be empty</p>}
                {error && password!="" && <p>Incorrect password</p>}
                {!error && <p>Joined {name}</p>}
            </Alert>
        </div>
    )
}

export default JoinChannelItem;
