import { ChannelModel, ChannelType } from "@/app/utils/models";
import { useChatBarContext, ChatBarState } from "@/app/context/ChatBarContextProvider";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Alert } from '@material-tailwind/react';
import { AlertSuccessIcon } from '../../alert/AlertSuccessIcon';
import { AlertErrorIcon } from "../../alert/AlertErrorIcon";
import PasswordInputField from "../PasswordInputField";
import { delay } from "@/app/utils/delay";
import ChatHeader from "../chatbox/ChatHeader";
import { NewChannelInfo } from "@/app/hooks/useChannels";
import bcrypt from 'bcryptjs';

type ChannelSettingsProps = {
    channel: ChannelModel
}

const ChannelSettings = ({ channel }: ChannelSettingsProps) => {
    const { updateChatBarState } = useChatBarContext();
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [password, setPassword] = useState('');
    const [newChannelType, setNewChannelType] = useState<ChannelType>(channel.type);
    const [openAlert, setOpenAlert] = useState(false);
    const [error, setError] = useState(false);

    const updateChannel = async (channelId: string, updatedChannel: NewChannelInfo) => {
        // Note: return value?
        try {
            let response = await fetch(`${process.env.BACK_URL}/chatroom/${channelId}/update`, {
                credentials: "include",
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: updatedChannel.name,
                    type: updatedChannel.type,
                    hashedPassword: updatedChannel.hashedPassword == '' ? null : updatedChannel.hashedPassword,
                }),
            });
            return response;
        }
        catch (err) {
            // Todo: manage errors
            console.log(err);
        }
    }

    // Todo: lock submit button if nothing changed
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const CLOSE_DELAY = 1250;
        e.preventDefault();
        setError(false);

        let updatedChannel : NewChannelInfo = {
            name: channel.name,
            type: channel.type,
            hashedPassword: '',
        }
        
        // Change channel Password
        if (channel.type === ChannelType.Protected || newChannelType === ChannelType.Protected) {
            if (password === '') {
                setError(true);
                setOpenAlert(true);
                await delay(CLOSE_DELAY);
                setOpenAlert(false);
                return;
            }
            console.log("Change password to:", password)
            updatedChannel.hashedPassword = await bcrypt.hash(password, 10);
        }
        // Change channel Type
        if (newChannelType != channel.type) {
            console.log("Change channel type to:", newChannelType);
            updatedChannel.type = newChannelType;
        }

        if (updatedChannel.hashedPassword != '' || updatedChannel.type != channel.type) {
            await updateChannel(channel.id, updatedChannel);
        }
        // Todo: only if success
        setOpenAlert(true);
        await delay(CLOSE_DELAY);
        updateChatBarState(ChatBarState.ChatOpen);
    }

    useEffect(() => {
        setShowPasswordInput(newChannelType == ChannelType.Protected || (channel.type == ChannelType.Protected && newChannelType == channel.type.toString()));
    }, [newChannelType])

    return (
        <div className='w-full min-w-[400px] max-w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
            <ChatHeader title={`${channel.name} Settings`} onCollapse={() => updateChatBarState(ChatBarState.ChatOpen)} />
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
                icon={error ? <AlertErrorIcon /> : <AlertSuccessIcon />}
                animate={{
                    mount: { y: 0 },
                    unmount: { y: 100 },
                }}>
                {error && <p>Password can not be empty</p>}
                {!error && <p>{channel.name} has been updated</p>}
            </Alert>
        </div>
    )
}

const ChangeChannelTypeButtons = ({ newChannelType, setChannelType }: { newChannelType: string, setChannelType: Dispatch<SetStateAction<ChannelType>> }) => {
    return (
        <div className="flex flex-col my-4">
            <span className='text-sm font-bold'>
                Change Channel Type
            </span>
            <ChannelTypeButton onClick={() => setChannelType(ChannelType.Public)} disable={newChannelType == ChannelType.Public}>
                Set as Public
            </ChannelTypeButton>
            <ChannelTypeButton onClick={() => setChannelType(ChannelType.Protected)} disable={newChannelType == ChannelType.Protected}>
                Set as Protected
            </ChannelTypeButton>
            <ChannelTypeButton onClick={() => setChannelType(ChannelType.Private)} disable={newChannelType == ChannelType.Private}>
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