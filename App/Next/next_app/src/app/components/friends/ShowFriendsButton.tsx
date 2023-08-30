import { ChatBarState, useChatBarContext } from '@/app/context/ChatBarContextProvider';
import { Tooltip } from '@material-tailwind/react';
import style from '../chat/Chat.module.css';

const ShowFriendsButton = () => {
    const { updateChatBarState } = useChatBarContext();
    return (
        <li className={style.channelItem}>
            <Tooltip placement="right" content={"Friends"} className="tooltip" offset={8}>
                <button onClick={() => updateChatBarState(ChatBarState.FriendListOpen)} className='rounded-[inherit] w-[inherit] h-[inherit] '>
                    <svg viewBox="0 0 24 24" aria-hidden="false" width={"42"} height={"42"} className={style.channelIcon}>
                        <path fill="currentColor" d="M9.25 4C9.25 2.48122 10.4812 1.25 12 1.25C13.5188 1.25 14.75 2.48122 14.75 4C14.75 5.51878 13.5188 6.75 12 6.75C10.4812 6.75 9.25 5.51878 9.25 4Z" ></path>
                        <path fill="currentColor" d="M8.22309 11.5741L6.04779 10.849C5.42206 10.6404 5 10.0548 5 9.39526C5 8.41969 5.89953 7.69249 6.85345 7.89691L8.75102 8.30353C8.85654 8.32614 8.9093 8.33744 8.96161 8.34826C10.966 8.76286 13.034 8.76286 15.0384 8.34826C15.0907 8.33744 15.1435 8.32614 15.249 8.30353L17.1465 7.8969C18.1005 7.69249 19 8.41969 19 9.39526C19 10.0548 18.5779 10.6404 17.9522 10.849L15.7769 11.5741C15.514 11.6617 15.3826 11.7055 15.2837 11.7666C14.9471 11.9743 14.7646 12.361 14.8182 12.753C14.834 12.8681 14.8837 12.9974 14.9832 13.256L16.23 16.4977C16.6011 17.4626 15.8888 18.4997 14.8549 18.4997C14.3263 18.4997 13.8381 18.2165 13.5758 17.7574L12 14.9997L10.4242 17.7574C10.1619 18.2165 9.67373 18.4997 9.14506 18.4997C8.11118 18.4997 7.39889 17.4626 7.77003 16.4977L9.01682 13.256C9.11629 12.9974 9.16603 12.8681 9.18177 12.753C9.23536 12.361 9.05287 11.9743 8.71625 11.7666C8.61741 11.7055 8.48597 11.6617 8.22309 11.5741Z"></path>
                        <path fill="currentColor" d="M12 21.9998C17.5228 21.9998 22 19.9851 22 17.4998C22 15.778 19.8509 14.282 16.694 13.5254L17.63 15.959C18.379 17.9065 16.9415 19.9996 14.8549 19.9996C13.788 19.9996 12.8028 19.4279 12.2735 18.5015L12 18.0229L11.7265 18.5015C11.1972 19.4279 10.212 19.9996 9.14506 19.9996C7.05851 19.9996 5.62099 17.9065 6.37001 15.959L7.30603 13.5254C4.14907 14.282 2 15.778 2 17.4998C2 19.9851 6.47715 21.9998 12 21.9998Z"></path>
                    </svg>
                </button>
            </Tooltip>
        </li>
    );
}

export default ShowFriendsButton;