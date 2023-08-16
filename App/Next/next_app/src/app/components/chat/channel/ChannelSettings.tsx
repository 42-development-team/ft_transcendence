import { ChannelModel } from "@/app/utils/models";
import collapseImg from "../../../../../public/collapse-left-svgrepo-com.svg"
import Image from 'next/image';
import { useChatBarContext, ChatBarState } from "@/app/context/ChatBarContextProvider";
import { useState } from "react";

type ChannelSettingsProps = {
    channel: ChannelModel
}

const ChannelSettings = ({ channel }: ChannelSettingsProps) => {
    const { updateChatBarState } = useChatBarContext();

    return (
        <div className='w-full min-w-[400px] max-w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
            <div className='flex flex-row justify-between border-b-2 pb-2 border-mantle'>
                <span className='font-semibold align-middle pl-2 pt-2'>
                    Channel Settings
                </span>
                <button onClick={() => updateChatBarState(ChatBarState.Closed)} >
                    <Image src={collapseImg} height={32} width={32} alt="Collapse" className='transition-all' />
                </button>
            </div>
            <div className="p-4 mb-4">
                <ChangeChannelTypeButtons ChannelType={channel.type} />
                {channel.type === 'protected' &&
                    <ChangePasswordForm />
                }
            </div>
        </div>
    )
}

const ChangeChannelTypeButtons = ({ ChannelType }: { ChannelType: string }) => {
    // Todo: request back to change channelType
    return (
        <div className="flex flex-col my-4">
            <span className='text-sm font-bold'>
                Change Channel Type
            </span>
            {ChannelType !== 'public' &&
                <button className={`button-mauve mt-4 p-2`} onClick={() => console.log("Set Channel type as public")} >
                    Set as Public
                </button>
            }
            {ChannelType !== 'protected' &&
                <button className={`button-mauve mt-4 p-2`} onClick={() => console.log("Set Channel type as protected")} >
                    Set as Protected (pasword)
                </button>
            }
            {ChannelType !== 'private' &&
                <button className={`button-mauve mt-4 p-2`} onClick={() => console.log("Set Channel type as private")} >
                    Set as Private (invisible)
                </button>
            }
        </div>
    )
}

const ChangePasswordForm = () => {
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password === '') return;
        // Todo: Fetch backend to update channel password
    }

    return (
        <form onSubmit={handleSubmit} className="mt-8" >
            <label htmlFor="password" className="block text-text text-sm font-bold mb-2">
                Change Channel Password
            </label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded bg-crust text-sm focus:outline-none focus:ring-1 focus:ring-mauve leading-tight"
            />
            <button type="submit" className={`button-mauve mt-4 w-fit`} >
                Update Password
            </button>
        </form>
    )
}

export default ChannelSettings;