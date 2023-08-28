import { useEffect, useState } from 'react';
import style from './Chat.module.css';
import { ChannelModel, ChannelType } from '@/app/utils/models';
import Channel from '@/components/chat/channel/Channel';
import ShowFriends from '../friends/ShowFriendsButton';
import Separator from './channel/Separator';
import JoinChannelButton from './channel/JoinChannelButton';
import CreateChannelButton from './channel/CreateChannelButton';
import DirectMessageChannel from './channel/DirectMessageChannel';

const ChatSideBar = ({ channels }: { channels: ChannelModel[] }) => {
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
		<div className="w-16 min-w-[4rem] bg-base h-full shadow-inner flex flex-col justify-start items-center">
			<div className={style.navChannel} >
				<ul className={style.channelContainer}>
					<ShowFriends />
					<JoinChannelButton />
					<CreateChannelButton />
					<Separator />
					{directMessageList}
					{channelsList}
				</ul>
			</div>
		</div>
	);
};

export default ChatSideBar;
