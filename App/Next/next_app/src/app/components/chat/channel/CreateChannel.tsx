// import useChannels from '@/app/hooks/useChannels';
// import style from '../Chat.module.css';

// const CreateChannel = ({userId}) => {
//     const {createNewChannel} = useChannels();
//     return (
//         <li className={style.channelItem}>
//             <button onClick={createNewChannel} className='rounded-[inherit] w-[inherit] h-[inherit]'>
//                 <svg viewBox="0 0 24 24" aria-hidden="false" width={"48"} height={"48"} className={style.channelIcon}>
//                     <path fill="currentColor" d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z"></path>
//                 </svg>
//                 <h4 className={style.channelName}>Create a new channel</h4>
//             </button>
//         </li>
//     );
// }

// export default CreateChannel;

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import useChannels from '@/app/hooks/useChannels';
import style from '../Chat.module.css';


interface CreateChannelProps {
    userId: string;
}

const CreateChannel = ({userId}: CreateChannelProps) => {
  const { createNewChannel } = useChannels();
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState('public');
  const [password, setPassword] = useState('');
//   const [ownerId, setOwnerId] = useState<string | null>(null);

 

  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    setChannelType(selectedType);
    setShowPasswordInput(selectedType === 'private');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Call the createNewChannel function with the form data.
    createNewChannel({
      name: channelName,
      type: channelType,
      password: channelType === 'private' ? password : undefined,
      owner: userId,
      admins: [userId],
    });
    // Reset form fields after submission.
    setChannelName('');
    setPassword('');
  };

  return (
    <li className={style.channelItem}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="channelName">Channel Name:</label>
        <input
          type="text"
          id="channelName"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />

        <label htmlFor="channelType">Channel Type:</label>
        <select
          id="channelType"
          value={channelType}
          onChange={handleTypeChange}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="protected">Protected</option>
        </select>

        {showPasswordInput && (
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        <button type="submit" className='rounded-[inherit] w-[inherit] h-[inherit]'>
          <svg viewBox="0 0 24 24" aria-hidden="false" width={"48"} height={"48"} className={style.channelIcon}>
            <path fill="currentColor" d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z"></path>
          </svg>
          <h4 className={style.channelName}>Create a new channel</h4>
        </button>
      </form>
    </li>
  );
};

export default CreateChannel;
