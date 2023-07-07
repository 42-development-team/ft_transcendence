import Image from "next/image";

const Channel = ({channelName, icon} : {channelName: string, icon: any}) => {
    return (
        <li className="channelItem">
            <Image alt="Channel Icon" width={0} height={0} src={icon} className="channelIcon" />
            <h4 className="channelName">{channelName}</h4>
        </li>
    );
}

export default Channel;