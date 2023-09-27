import { useEffect, useState } from 'react';
import { ChannelModel, ChannelType } from '@/app/utils/models';
import Channel from '@/components/chat/channel/Channel';
import ShowFriends from '../friends/ShowFriendsButton';
import Separator from './channel/Separator';
import JoinChannelButton from './channel/JoinChannelButton';
import CreateChannelButton from './channel/CreateChannelButton';
import DirectMessageChannel from './channel/DirectMessageChannel';

type ChatSideBarProps = {
	channels: ChannelModel[];
	friendRequestCount: number;
};

const ChatSideBar = ({ channels, friendRequestCount }: ChatSideBarProps) => {
	const [channelsList, setChannelsList] = useState<any[]>([]);
	const [directMessageList, setDirectMessageList] = useState<any[]>([]);

	const updateDisplay = () => {
		const channelsList = channels
			.filter((channel) => channel.type != ChannelType.DirectMessage)
			.map((channel) => (
				<Channel key={channel.id} channel={channel} />
			));
		setChannelsList(channelsList);
		const directMessages = channels
			.filter((channel) => channel.type == ChannelType.DirectMessage)
			.map((channel) => (
				<DirectMessageChannel key={channel.id} channel={channel} />
			));
		setDirectMessageList(directMessages);
	}

	useEffect(() => {
		updateDisplay();
	}, [channels]);

	return (
		<div className="bg-opacity-90 backdrop-blur-lg w-16 min-w-[4rem] bg-base h-full flex flex-col justify-start items-center">
			<ul className="flex flex-col gap-2 p-1 absolute h-[calc(100vh-48px)] items-center">
				<ShowFriends friendRequestCount={friendRequestCount}/>
				<JoinChannelButton />
				<CreateChannelButton />
				<Separator />
				<li className='overflow-y-scroll overflow-x-hidden no-scrollbar items-center -m-2 p-3'>
					<ul className="flex flex-col gap-3">
						{directMessageList}
						{channelsList}
					</ul>
				</li>
			</ul>
		</div>
	);
};

export default ChatSideBar;
