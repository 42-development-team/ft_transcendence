import styles from './Channel.module.css';
import Image from "next/image";
import { useChatContext } from '@/app/context/ChatContextProvider';

const Channel = ({channelName, icon} : {channelName: string, icon: any}) => {
    const {openChat} = useChatContext();
    return (
        <li className={styles.channelItem}>
            <button onClick={openChat}>
                <Image alt="Channel Icon" width={0} height={0} src={icon} className={styles.channelIcon} />
                <h4 className={styles.channelName} >{channelName}</h4>
            </button>
        </li>
    );
}

export default Channel;