import { useState, ChangeEvent, FormEvent } from 'react';
import { NewChannelInfo } from '@/app/hooks/useChannels';
import collapseImg from "../../../../../public/collapse-left-svgrepo-com.svg"
import Image from 'next/image';
import { ChatBarState, useChatBarContext } from "@/app/context/ChatBarContextProvider";

import { delay } from '@/app/utils/delay';
import { Alert } from '@material-tailwind/react';
import { AlertSuccessIcon } from '../../alert/AlertSuccessIcon';

interface CreateChannelProps {
  userId: string;
  createNewChannel: (newChannel: NewChannelInfo) => Promise<string>;
}

const CreateChannel = ({ userId, createNewChannel }: CreateChannelProps) => {

  const CLOSE_DELAY = 1000;

  const { updateChatBarState, openChannel } = useChatBarContext();
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState('public');
  const [password, setPassword] = useState('');
  
  const [openAlert, setOpenAlert] = useState(false);

  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    setChannelType(selectedType);
    setShowPasswordInput(selectedType === 'private');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (channelName === '') return;
    if( channelType === 'private' && password === '') return;

    const newChannelInfo: NewChannelInfo = {
      name: channelName,
      type: channelType,
      password: channelType === 'private' ? password : undefined,
      owner: Number(userId),
      admins: [Number(userId)],
    };
    const createdChannelId = await createNewChannel(newChannelInfo);

    // Close the form after short delay
    setOpenAlert(true);
    await delay(CLOSE_DELAY);
    
    // Reset fields after creation.
    setChannelName('');
    setPassword('');
    openChannel(createdChannelId);
  };

  return (
    <div className='w-full min-w-[350px] max-w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
            <div className='flex flex-row justify-between border-b-2 pb-2 border-mantle'>
                <span className='font-semibold align-middle pl-2 pt-2'>
                    Create a channel
                </span>
                <button onClick={() => updateChatBarState(ChatBarState.Closed)} >
                    <Image src={collapseImg} height={32} width={32} alt="Collapse" className='transition-all' />
                </button>
            </div>
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="channelName" className="block text-text text-sm font-bold mb-2">
              Channel Name
            </label>
            <input
              type="text"
              id="channelName"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
                className="w-full p-2 rounded bg-crust text-sm focus:outline-none focus:ring-1 focus:ring-mauve leading-tight"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="channelType" className="block text-text text-sm font-bold mb-2">
              Channel Type
            </label>
            <select
              id="channelType"
              value={channelType}
              onChange={handleTypeChange}
                className=" w-full p-2 rounded bg-crust text-sm focus:outline-none focus:ring-1 focus:ring-mauve leading-tight"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="protected">Protected</option>
            </select>
          </div>

          {showPasswordInput && (
            <div className="mb-4">
              <label htmlFor="password" className="block text-text text-sm font-bold mb-2">
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded bg-crust text-sm focus:outline-none focus:ring-1 focus:ring-mauve leading-tight"
              />
            </div>
          )}
          <button
            type="submit"
            // onClick={handleSubmit}
            className={`bg-mauve font-bold text-sm rounded-lg text-base hover:bg-pink drop-shadow-xl mt-1 p-2`}
          >
            Create Channel
          </button>
        </form>
        <Alert color="green" className="mb-4 mt-4 p-2 text-text border-mauve border-[1px] break-all" variant='gradient'
          open={openAlert}
          icon={<AlertSuccessIcon />}
          animate={{
            mount: { y: 0 },
            unmount: { y: 100 },
          }}>{channelName} has been created</Alert>
      </div>
    </div>
  );
};

export default CreateChannel;
