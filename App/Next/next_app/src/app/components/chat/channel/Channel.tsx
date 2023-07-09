import styles from './Channel.module.css';
import Image from "next/image";

const Channel = ({channelName, icon} : {channelName: string, icon: any}) => {
    return (
        <li className={styles.channelItem}>
            <Image alt="Channel Icon" width={0} height={0} src={icon} className={styles.channelIcon}/>
            <h4 className={styles.channelName} >{channelName}</h4>
        </li>
    );
}

export default Channel;