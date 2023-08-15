
const Stats = ( userId: {userId : string }) => {
	return (
		<div className="flex flex-col mx-[2vw] h-full">
			<div className="flex flex-col text-center">Stats</div>
			<div className="flex flex-row h-full w-full ">
				<div className="flex flex-col w-full justify-center">
					<div className="flex flex-col py-[1vw] justify-center h-full w-full ">
						<div className="text-center">Played</div>
						<div className="">15</div>
					</div>
					<div className="flex flex-row justify-center">
						<div className="flex flex-middle w-[5vw] border border-gray-600"></div>
					</div>
					<div className="flex flex-col py-[1vw] h-full w-full justify-center text-center">
						W/L/D-R%
						<div className="">10/5-1.5</div>
					</div>
				</div>
				<div className="flex flex-col justify-center">
					<div className="flex flex-middle h-[105px] border border-gray-600 mx-2"></div>
				</div>
				<div className="flex flex-col w-full h-full">
					<div className="flex py-[1vw] justify-center w-full h-full">
						Some component
					</div>
					<div className="flex flex-row justify-center">
						<div className="flex flex-middle w-[5vw] border border-gray-600"></div>
					</div>
					<div className="flex py-[1vw] justify-center w-full h-full">
						Some component
					</div>
				</div>
			</div>

		</div>
	)
}

export default Stats;