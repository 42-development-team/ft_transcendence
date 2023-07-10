import useChannels from '@/app/hooks/useChannels';
import style from '../Chat.module.css';

const AddChannel = () => {
    const {createNewChannel} = useChannels();
    return (
        <li className={style.channelItem}>
            <button onClick={createNewChannel} className='rounded-[inherit] w-[inherit] h-[inherit]'>
                <svg viewBox="0 0 24 24" aria-hidden="false" width={"48"} height={"48"} className={style.channelIcon}>
                    <path fill="currentColor" d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z"></path>
                </svg>
                <h4 className={style.channelName}>Create a new channel</h4>
            </button>
        </li>
    );
}

export default AddChannel;