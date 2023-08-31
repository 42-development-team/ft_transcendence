import { useState, ChangeEvent, FormEvent, Dispatch, SetStateAction, useEffect } from 'react';
import { NewChannelInfo } from '@/app/hooks/useChannels';
import { ChatBarState, useChatBarContext } from "@/app/context/ChatBarContextProvider";
import { delay } from '@/app/utils/delay';
import { Alert } from '@material-tailwind/react';
import { AlertSuccessIcon } from '../../alert/AlertSuccessIcon';
import { AlertErrorIcon } from "../../alert/AlertErrorIcon";
import PasswordInputField from '../PasswordInputField';
import ChatHeader from '../chatbox/ChatHeader';
import { ChannelType } from '@/app/utils/models';

interface CreateChannelProps {
	userId: string;
	createNewChannel: (newChannel: NewChannelInfo) => Promise<string>;
}

// Todo: prevent double click on button
const CreateChannel = ({ userId, createNewChannel }: CreateChannelProps) => {

	const CLOSE_DELAY = 750;

	const { updateChatBarState, openChannel } = useChatBarContext();
	const [showPasswordInput, setShowPasswordInput] = useState(false);
	const [channelName, setChannelName] = useState('');
	const [channelType, setChannelType] = useState<string>(ChannelType.Public);
	const [password, setPassword] = useState('');
	const [lockInterface, setLockInterface] = useState(false);

	const [error, setError] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);

	useEffect(() => {
		// Auto focus on channel name input
		const channelNameInput = document.getElementById('channelName');
		if (channelNameInput) {
			channelNameInput.focus();
		}
	}, []);

	const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const selectedType = event.target.value;
		setChannelType(selectedType);
		setShowPasswordInput(selectedType === ChannelType.Protected);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		setOpenAlert(false);
		setError(false);
		event.preventDefault();
		if (channelName === '') return;
		if (channelType === ChannelType.Protected && password === '') return;
		setLockInterface(true);
		setShowPasswordInput(false);
		const newChannelInfo: NewChannelInfo = {
			name: channelName,
			type: channelType,
			hashedPassword: channelType === ChannelType.Protected ? password : undefined,
		};
		const createdChannelId = await createNewChannel(newChannelInfo);

		if (createdChannelId === 'error') {
			setOpenAlert(true);
			setError(true);
			await delay(CLOSE_DELAY);
			setLockInterface(false);
			return;
		}

		// Close the form after short delay
		setOpenAlert(true);
		await delay(CLOSE_DELAY);

		// Reset fields after creation.
		setChannelName('');
		setPassword('');
		setLockInterface(false);
		openChannel(createdChannelId);
	};

	return (
		<div className='w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
			<ChatHeader title="Create a channel" onCollapse={() => updateChatBarState(ChatBarState.Closed)} />
			<div className="p-4">
				<form onSubmit={handleSubmit}>
					<ChannelNameInput value={channelName} setValue={setChannelName} disabled={lockInterface} />	
					<ChannelTypeInput value={channelType} onChange={handleTypeChange} disabled={lockInterface} />	
					{showPasswordInput && 
						<PasswordInputField value={password}  setValue={setPassword}/>
					}
					<button type="submit" className={`button-mauve disabled:pointer-events-none disabled:bg-overlay1`} disabled={lockInterface} >
						Create Channel
					</button>
				</form>
				<Alert color="green" 
					className="mb-4 mt-4 p-2 text-text border-mauve border-[1px] break-all" 
					variant='gradient'
					open={openAlert}
					icon={error ? <AlertErrorIcon /> : <AlertSuccessIcon />}
					animate={{
						mount: { y: 0 },
						unmount: { y: 100 },
					}}>
						{!error && <p>{channelName} has been created</p>}
     		        	{error && <p>Channel name already exists</p>}
					</Alert>
			</div>
		</div>
	);
};

const ChannelNameInput = ({value, setValue, disabled} :
	{value: string, setValue: Dispatch<SetStateAction<string>>, disabled: boolean} ) => {
	return (
		<div className="mb-4">
			<label htmlFor="channelName" className="block text-text text-sm font-bold mb-2">
				Channel Name
			</label>
			<input
				type="text"
				id="channelName"
				value={value}
				disabled={disabled}
				maxLength={24}
				onChange={(e) => setValue(e.target.value)}
				className="w-full p-2 rounded bg-crust text-sm focus:outline-none focus:ring-1 focus:ring-mauve leading-tight"
			/>
		</div>
	)	
}



const ChannelTypeInput = ({value, onChange, disabled} :
	{value: string, onChange: (event: ChangeEvent<HTMLSelectElement>) => void, disabled: boolean}) => {
	return (
		<div className="mb-4">
			<label htmlFor="channelType" className="block text-text text-sm font-bold mb-2">
				Channel Type
			</label>
			<select
				id="channelType"
				value={value}
				onChange={onChange}
				disabled={disabled}
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
