import React, { useState, ChangeEvent, FormEvent } from 'react';
import { NewChannelInfo } from '@/app/hooks/useChannels';
import collapseImg from "../../../../../public/collapse-left-svgrepo-com.svg"
import Image from 'next/image';
import { ChatBarState, useChatBarContext } from "@/app/context/ChatBarContextProvider";
// import useChatConnection from "../../../hooks/useChatConnection";
import { io, Socket } from "socket.io-client"


interface CreateChannelProps {
  userId: string;
  createNewChannel: (newChannel: NewChannelInfo) => void;
  socket: Socket;
}

const CreateChannel = ({ userId, createNewChannel, socket }: CreateChannelProps) => {
  const { updateChatBarState } = useChatBarContext();
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState('public');
  const [password, setPassword] = useState('');
  // const socket = useChatConnection();
  
  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    setChannelType(selectedType);
    setShowPasswordInput(selectedType === 'private');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (channelName === '') return;
    if( channelType === 'private' && password === '') return;

    createNewChannel({
      name: channelName,
      type: channelType,
      password: channelType === 'private' ? password : undefined,
      owner: Number(userId),
      admins: [Number(userId)],
    });
    // emit joinRoom event to server
    if (socket) {
      socket.emit("joinRoom", channelName);
    }
    // Reset fields after creation.
    setChannelName('');
    setPassword('');
    // Todo: close the form
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
      </div>
    </div>
  );
};

export default CreateChannel;
