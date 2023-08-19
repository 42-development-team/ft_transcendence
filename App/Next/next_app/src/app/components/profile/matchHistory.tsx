
const matchHistory = ( props: { data: any } ) => {
    const { data } = props.data;

    return (
        <div className="p-6 h-[50vh] overflow-auto">
            {data.map((item: any, index: number) => (
                <div key={index} className="h-20 m-2 border-b border-gray-300 rounded-none text-xl font-bold">
                    {item}
                </div>
            ))}
        </div>
    )
}
export default matchHistory;