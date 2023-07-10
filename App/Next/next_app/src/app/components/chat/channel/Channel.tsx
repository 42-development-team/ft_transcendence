import styles from './Channel.module.css';
import Image from "next/image";
import { useChatContext } from '@/app/context/ChatContextProvider';
import { ChannelModel } from '@/app/utils/models';

type ChannelProps = {
    channel: ChannelModel
}

const Channel = ({channel :{name, icon}}: ChannelProps) => {
    const {openChat} = useChatContext();
    return (
        <li className={styles.channelItem}>
            <button onClick={openChat} className='rounded-[inherit] w-[inherit] h-[inherit] relative'>
                <Image alt="Channel Icon" fill src={icon} 
                sizes=" 100vw, 100vw"
                className="rounded-[inherit]" />
                <h4 className={styles.channelName} >{name}</h4>
            </button>
        </li>
    );
}

export default Channel;