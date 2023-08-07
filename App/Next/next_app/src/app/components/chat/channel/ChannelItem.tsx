import { ChannelModel } from "@/app/utils/models";

type ChannelProps = {
    channel: ChannelModel
}

// Todo: Add channel icon
// Todo: manage password for private channels
const ChannelItem = ({ channel: { name, icon } }: ChannelProps) => {
    return (
        <div className="flex flex-grow relative items-center justify-between mt-2 mb-2 hover:bg-surface1 rounded py-1 px-2 mr-2">
            <div className="flex items-center w-80">
                <h1 className="font-medium text-md">{name}</h1>
            </div>
            <div className="relative inline-block text-left">
                <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-full px-3 py-2 font-semibold text-sm bg-surface1 hover:bg-base"
                    onClick={() => console.log("Join Channel " + name)}>
                    Join
                </button>
            </div>
        </div>
    )
}

export default ChannelItem;