import React, { useState, ChangeEvent } from 'react';
import useChannels from '@/app/hooks/useChannels';

interface CreateChannelProps {
  userId: string;
  onClose: () => void;
}

const CreateChannel = ({ userId, onClose }: CreateChannelProps) => {
  const { createNewChannel } = useChannels();
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState('public');
  const [password, setPassword] = useState('');

  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    setChannelType(selectedType);
    setShowPasswordInput(selectedType === 'private');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createNewChannel({
      name: channelName,
      type: channelType,
      password: channelType === 'private' ? password : undefined,
      owner: Number(userId),
      admins: [Number(userId)],
    });

    // Reset fields after creation.
    setChannelName('');
    setPassword('');

    // Close the form after creation
    onClose();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="channelName" className="block text-gray-700 text-sm font-bold mb-2">
              Channel Name:
            </label>
            <input
              type="text"
              id="channelName"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="channelType" className="block text-gray-700 text-sm font-bold mb-2">
              Channel Type:
            </label>
            <select
              id="channelType"
              value={channelType}
              onChange={handleTypeChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="protected">Protected</option>
            </select>
          </div>

          {showPasswordInput && (
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Channel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateChannel;
