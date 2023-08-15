
const Stats = ( userId: {userId : string }) => {
	return (
		<div className="flex flex-col mx-[2vw] h-full">
			<p className=" flex flex-col mt-1 text-center text-2xl uppercase text-xl underline underline-offset-2 text-red-400">Stats</p>
			<div className="flex flex-row h-full w-full ">
				<div className="flex flex-col w-full justify-center">
					<div className="flex flex-col py-[1vw] justify-center h-full w-full ">
						<div className="text-xl uppercase text-center ">Played</div>
						<div className="text-xl">15</div>
					</div>
					<div className="flex flex-row justify-center">
						<div className="flex flex-middle w-[5vw] border border-gray-600"></div>
					</div>
					<div className="flex flex-col py-[1vw] h-full w-full justify-center ">
						<div className="text-sm">
							W / L / D - R (%)
						</div>
						<div className="text-xl">
							10 / 5 - 1.5
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-center">
					<div className="flex flex-middle h-[105px] border border-gray-600 mx-2"></div>
				</div>
				<div className="flex flex-col w-full h-full">
					<div className="flex uppercase text-xl py-[1vw] text-xl justify-center w-full h-full">
						Rank
					</div>
					<div className="flex flex-row justify-center">
						<div className="flex flex-middle w-[5vw] border border-gray-600"></div>
					</div>
					<div className="flex py-[1vw] justify-center w-full h-full">
						<div className="flex flex-col py-[1vw] h-full w-full justify-center ">
							<div className="text-xl uppercase">
								Highest winning streak
							</div>
							<div>
								??
							</div>
						</div>
					</div>
				</div>
			</div>

		</div>
	)
}

export default Stats;