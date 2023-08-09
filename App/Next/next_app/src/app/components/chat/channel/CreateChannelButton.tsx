import { useChatBarContext } from '@/app/context/ChatBarContextProvider';
import style from '../Chat.module.css';

const CreateChannelButton = () => {
    const { toggleCreateChannelVisibility } = useChatBarContext();

    return (
        <li className={style.channelItem}>
            <button
                onClick={toggleCreateChannelVisibility}
                className='rounded-[inherit] w-[inherit] h-[inherit]'
            >
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="false"
                    width="48"
                    height="48"
                    className={style.channelIcon}
                >
                </svg>
                <h4 className={style.channelName}>Create Channel</h4>
            </button>
        </li>
    );
}

export default CreateChannelButton;
