
const matchHistory = ( props: { data: any } ) => {
    const { data } = props;

    return (
        <div className="p-6 h-[50vh] overflow-auto">
            <div className="flex flex-col">
            {data.map((item: any, index: number) => (
                <div key={index} className="p-2 bg-gradient-to-r from-yellow-500 to-base border-l-2 flex flex-row justify-between h-20 m-2 my-4 text-xl font-bold">
                    <span className="flex flex-grow justify-between bg-gradient-to-r from-base to-surface0  p-2 m-1">
                        <div className={`flex flex-col justify-center pl-4`} style={{ color: item.win === true ? "orange" : "gray"}}>
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