'use client';

import { use, useContext, useEffect, useState } from "react";
import ThemeContext from "../theme/themeContext";

const Stats = ( {userId, stats}: {userId : string, stats: any } ) => {

	const {theme} = useContext(ThemeContext);
	const [textColor, setTextColor] = useState<string>(theme === "latte" ? "text-red" : "text-peach");
	
	useEffect(() => {
		if (theme === "latte") {
			setTextColor("text-red");
		}
		else {
			setTextColor("text-peach");
		}
	}, [theme]);
		
	return (
		<div className="flex flex-col mx-[2vw] h-full text-text">
			<p className={` flex flex-col mt-1 text-center text-2xl text-peach uppercase ` + textColor}>Stats</p>
			<div className="flex flex-row h-[inherit] w-full ">
				<div className="flex flex-col w-full justify-center">
					<div className="flex flex-col py-[1vw] justify-center h-full w-full ">
						<div className="text-xl uppercase">Elo</div>
						<div className="text-xl">{stats.totalScore}</div>
					</div>
				</div>
				<div className="flex flex-col justify-center">
					<div className="flex flex-middle h-[105px] border border-gray-600 mx-2"></div>
				</div>
				<div className="flex flex-col w-full h-full">
					<div className="flex py-[1vw] justify-center w-full h-full">
						<div className="flex flex-col py-[1vw] h-full w-full justify-center ">
							<div className="text-lg">
								W / Played - R
							</div>
							<div className="text-xl">
								{stats.win} / {stats.played} - {(stats.ratio * 100).toFixed(0)}%
							</div>
						</div>
					</div>
					<div className="flex flex-row justify-center">
						<div className="flex flex-middle w-[5vw] border border-gray-600"></div>
					</div>
					<div className="flex py-[1vw] justify-center w-full h-full">
						<div className="flex flex-col py-[1vw] h-full w-full justify-center ">
							<div className="text-xl uppercase">
								Winstreak
							</div>
							<div className="text-lg">
								{stats.winStreak}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Stats;