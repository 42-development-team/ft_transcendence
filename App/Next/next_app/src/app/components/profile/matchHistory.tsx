
const matchHistory = ( props: { data: any, currentUserId: number } ) => {
    const data = props.data;
    const currentUserId = props.currentUserId;
    console.log("data: ", data);

    return (
        <div className="p-6 h-[50vh] overflow-auto">
            <div className="flex flex-col">
            {data.map((item: any, index: number) => (
                <div key={index} className={ item.winner.id === currentUserId ? 'rounded pl-1 pb-1 flex flex-row justify-between h-[120px] m-2 my-4 text-xl font-bold bg-gradient-to-r from-yellow-500 to-base' 
                    : 'rounded pl-1 pb-1 flex flex-row justify-between h-[120px] m-2 my-4 text-xl font-bold bg-gradient-to-r from-gray-500 to-gray'}>
                    <span className=" flex flex-grow justify-between bg-gradient-to-r from-base to-surface0 px-2">
                        <div className={`flex flex-col justify-center pl-4`} style={{ color: item.winner.id === currentUserId ? "orange" : "grey"}}>
                            {item.winner.id === currentUserId ? "Win" : "Lose"}
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="flex justify-center text-red-800">
                                VS
                            </div>
                            {item.winner.id === currentUserId ? item.loser.username : item.winner.username}
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="flex justify-center">
                                {item.winner.id === currentUserId ?  item.winnerScore : item.loserScore} - {item.winner.id === currentUserId ?  item.loserScore : item.winnerScore}
                            </div>
                            <div>
                                {item.createdAt.slice(0,10)}
                            </div>
                        </div>
                    </span>
                </div>
            ))}
            </div>
        </div>
    )
}
export default matchHistory;