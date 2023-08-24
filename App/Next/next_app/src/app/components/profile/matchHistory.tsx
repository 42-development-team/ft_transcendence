
const matchHistory = ( props: { data: any, currentUser: string } ) => {
    const { data } = props;

    return (
        <div className="p-6 h-[50vh] overflow-auto">
            <div className="flex flex-col">
            {data.map((item: any, index: number) => (
                <div key={index} className={item.win === true ? 'rounded pl-1 pb-1 flex flex-row justify-between h-[120px] m-2 my-4 text-xl font-bold bg-gradient-to-r from-yellow-500 to-base' 
                    : 'rounded pl-1 pb-1 flex flex-row justify-between h-[120px] m-2 my-4 text-xl font-bold bg-gradient-to-r from-gray-500 to-gray'}>
                    <span className=" flex flex-grow justify-between bg-gradient-to-r from-base to-surface0 px-2">
                        <div className={`flex flex-col justify-center pl-4`} style={{ color: item.win === true ? "orange" : "grey"}}>
                            {item.win.toString()}
                        </div>
                        <div className="flex flex-col justify-center">
                            {item.score}
                        </div>
                        <div className="flex flex-col justify-center">
                            {item.vs}
                        </div>
                    </span>
                </div>
            ))}
            </div>
        </div>
    )
}
export default matchHistory;