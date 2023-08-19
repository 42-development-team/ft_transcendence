import { useState, ChangeEvent, FormEvent, Dispatch, SetStateAction } from 'react';
import { NewChannelInfo } from '@/app/hooks/useChannels';
import { ChatBarState, useChatBarContext } from "@/app/context/ChatBarContextProvider";
import { delay } from '@/app/utils/delay';
import { Alert } from '@material-tailwind/react';
import { AlertSuccessIcon } from '../../alert/AlertSuccessIcon';
import PasswordInputField from '../PasswordInputField';
import ChatHeader from '../chatbox/ChatHeader';

interface CreateChannelProps {
	userId: string;
	createNewChannel: (newChannel: NewChannelInfo) => Promise<string>;
}

const CreateChannel = ({ userId, createNewChannel }: CreateChannelProps) => {

	const CLOSE_DELAY = 750;

	const { updateChatBarState, openChannel } = useChatBarContext();
	const [showPasswordInput, setShowPasswordInput] = useState(false);
	const [channelName, setChannelName] = useState('');
	const [channelType, setChannelType] = useState('public');
	const [password, setPassword] = useState('');

	const [openAlert, setOpenAlert] = useState(false);

	const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const selectedType = event.target.value;
		setChannelType(selectedType);
		setShowPasswordInput(selectedType === 'protected');
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (channelName === '') return;
		if (channelType === 'protected' && password === '') return;

		setShowPasswordInput(false);
		const newChannelInfo: NewChannelInfo = {
			name: channelName,
			type: channelType,
			password: channelType === 'protected' ? password : undefined,
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
			<ChatHeader title="Create a channel" onCollapse={() => updateChatBarState(ChatBarState.Closed)} />
			<div className="p-4">
				<form onSubmit={handleSubmit}>
					<ChannelNameInput value={channelName} setValue={setChannelName} />	
					<ChannelTypeInput value={channelType} onChange={handleTypeChange} />	
					{showPasswordInput && 
						<PasswordInputField value={password}  setValue={setPassword}/>
					}
					<button type="submit" className={`button-mauve`} >
						Create Channel
					</button>
				</form>
				<Alert color="green" 
					className="mb-4 mt-4 p-2 text-text border-mauve border-[1px] break-all" 
					variant='gradient'
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

const ChannelNameInput = ({value, setValue} : {value: string, setValue: Dispatch<SetStateAction<string>>} ) => {
	return (
		<div className="mb-4">
			<label htmlFor="channelName" className="block text-text text-sm font-bold mb-2">
				Channel Name
			</label>
			<input
				type="text"
				id="channelName"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				className="w-full p-2 rounded bg-crust text-sm focus:outline-none focus:ring-1 focus:ring-mauve leading-tight"
			/>
		</div>
	)	
}

const ChannelTypeInput = ({value, onChange} : {value: string, onChange: (event: ChangeEvent<HTMLSelectElement>) => void}) => {
	return (
		<div className="mb-4">
			<label htmlFor="channelType" className="block text-text text-sm font-bold mb-2">
				Channel Type
			</label>
			<select
				id="channelType"
				value={value}
				onChange={onChange}
				className=" w-full p-2 rounded bg-crust text-sm focus:outline-none focus:ring-1 focus:ring-mauve leading-tight"
			>
				<option value="public">Public</option>
				<option value="private">Private</option>
				<option value="protected">Protected</option>
			</select>
		</div>
	)
}

export default CreateChannel;
