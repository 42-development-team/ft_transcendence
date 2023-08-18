import { ChannelModel } from "@/app/utils/models";
import { useChatBarContext, ChatBarState } from "@/app/context/ChatBarContextProvider";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Alert } from '@material-tailwind/react';
import { AlertSuccessIcon } from '../../alert/AlertSuccessIcon';
import collapseImg from "../../../../../public/collapse-left-svgrepo-com.svg"
import Image from 'next/image';
import PasswordInputField from "../PasswordInputField";
import { delay } from "@/app/utils/delay";
import { AlertErrorIcon } from "../../alert/AlertErrorIcon";

type ChannelSettingsProps = {
    channel: ChannelModel
}

const ChannelSettings = ({ channel }: ChannelSettingsProps) => {
    const { openChannel, updateChatBarState } = useChatBarContext();
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [password, setPassword] = useState('');
    const [newChannelType, setNewChannelType] = useState(channel.type);
	const [openAlert, setOpenAlert] = useState(false);
    const [error, setError] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const CLOSE_DELAY = 1250;
        e.preventDefault();
        setError(false);
        // Change channel Type
        if (newChannelType != channel.type) {
            console.log("Change channel type to:", newChannelType);
            // Todo: update channel Type
        }

        // Change channel password
        // Todo: add alert if password is empty
        if (channel.type === 'protected' || newChannelType === 'protected') {
            if (password === '') {
                setError(true);
                setOpenAlert(true);
                await delay(CLOSE_DELAY);
                setOpenAlert(false);
                return;
            }
            console.log("Change password to:", password)
            // Todo: update password
        }

        // Todo: Fetch backend to update channel
  
		setOpenAlert(true);
		await delay(CLOSE_DELAY);
        updateChatBarState(ChatBarState.ChatOpen);
    }

    useEffect(() => {
        setShowPasswordInput(newChannelType == "protected" || (channel.type == "protected" && newChannelType == channel.type));
    }, [newChannelType])

    return (
        <div className='w-full min-w-[400px] max-w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
            <ChannelSettingsHeader channelName={channel.name} updateChatBarState={updateChatBarState} />
            <div className="p-4 mb-4 flex-col">
                <ChangeChannelTypeButtons newChannelType={newChannelType} setChannelType={setNewChannelType} />
                <form onSubmit={handleSubmit} >
                    {(channel.type === 'protected' || showPasswordInput) &&
                        <PasswordInputField value={password} setValue={setPassword} />
                    }
                    <button type="submit" className={`button-mauve p-4`} >
                        Submit
                    </button>
                </form>
            </div>
            <Alert 
                className="mb-4 mt-4 p-2 text-text border-mauve border-[1px] break-all"
                variant='gradient'
                open={openAlert}
                icon={error ? <AlertErrorIcon />: <AlertSuccessIcon />}
                animate={{
                    mount: { y: 0 },
                    unmount: { y: 100 },
                }}>
                    {error && <p>Password can not be empty</p>}
                    {!error && <p>{channel.name} has been updated</p>
                    }
                </Alert>
        </div>
    )
}

const ChannelSettingsHeader = ({ channelName, updateChatBarState }: { channelName: string, updateChatBarState: (state: ChatBarState) => void }) => {
    return (
        <div className='flex flex-row justify-between border-b-2 pb-2 border-mantle'>
            <span className='font-semibold align-middle pl-2 pt-2'>
                {channelName} Settings
            </span>
            <button onClick={() => updateChatBarState(ChatBarState.ChatOpen)} >
                <Image src={collapseImg} height={32} width={32} alt="Collapse" className='transition-all' />
            </button>
        </div>
    )
}

const ChangeChannelTypeButtons = ({ newChannelType, setChannelType }: { newChannelType: string, setChannelType: Dispatch<SetStateAction<string>> }) => {
    return (
        <div className="flex flex-col my-4">
            <span className='text-sm font-bold'>
                Change Channel Type
            </span>
            <ChannelTypeButton onClick={() => setChannelType("public")} disable={newChannelType == "public"}>
                Set as Public
            </ChannelTypeButton>
            <ChannelTypeButton onClick={() => setChannelType("protected")} disable={newChannelType == "protected"}>
                Set as Protected
            </ChannelTypeButton>
            <ChannelTypeButton onClick={() => setChannelType("private")} disable={newChannelType == "private"}>
                Set as Private (invisible)
            </ChannelTypeButton>
        </div>
    )
}

const ChannelTypeButton = ({ children, onClick, disable }: { children: any, onClick: () => void, disable: boolean }) => {
    return (
        <button
            type="button"
            disabled={disable}
            style={{ opacity: disable ? 0.5 : 1 }}
            className={`font-bold text-sm rounded-lg text-base bg-mauve hover:bg-pink drop-shadow-xl m-1 py-2`}
            onClick={onClick}>
            {children}
        </button>
    );
}

export default ChannelSettings;