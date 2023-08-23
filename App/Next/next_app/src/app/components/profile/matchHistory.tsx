
const matchHistory = ( props: { data: any } ) => {
    const { data } = props.data;

    return (
        <div className="p-6 h-[50vh] overflow-auto">
            <div className="flex flex-col">
            {data.map((item: any, index: number) => (
                <div key={index} className="bg-gradient-to-r from-green-600 to-base flex flex-row justify-between h-20 m-2 my-4 text-xl font-bold">
                    <span className="flex flex-grow justify-between bg-gradient-to-r from-base to-surface0 p-2 block m-1">
                    <div className="flex flex-col justify-center">
                            {item}
                    </div>
                    <div className="flex flex-col justify-center">
                        {item}
                    </div>
                    <div className="flex flex-col justify-center">
                        {item}
                    </div>
                    </span>
                    </div>
            ))}
            </div>
        </div>
    )
}
export default matchHistory;