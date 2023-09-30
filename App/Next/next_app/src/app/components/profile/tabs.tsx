"use client";
import { useState, useEffect, useContext } from "react";
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import MatchHistory from "./matchHistory";
import LeaderBoard from "./leaderboard";
import sessionStorageUser from "./sessionStorage";
import getGames from "./getGames";
import getStatsLeaderBoard from "./getStatsLeaderBoard";
import ThemeContext from "../theme/themeContext";

export function UnderlineTabs({ userId }: { userId: string }) {
    const [activeTab, setActiveTab] = useState("leaderboard");
    const [games, setGames] = useState<any>([]);
    const [stats, setStats] = useState<any>([]);
    const [userIdNumber, setUserIdNumber] = useState<number>(Number(userId));
    const { theme } = useContext(ThemeContext);
    const [headerTextColor, setHeaderTextColor] = useState<string>(theme === "latte" ? "text-red" : "text-peach");
    const [headerBorderColor, setHeaderBorderColor] = useState<string>(theme === "latte" ? "border-red" : "border-peach");
    useEffect(() => {
        if (userId === undefined || userId === "") return;
        let sessionUserId = null;
        sessionUserId = sessionStorageUser();

        if (sessionUserId !== null && sessionUserId !== undefined) {
            setUserIdNumber(Number(sessionUserId) as number);
        }
        else {
            setUserIdNumber(Number(userId) as number);
        }

        const fetchGame = async (userIdNumber: number) => {
            const getgames = await getGames({ userId: userIdNumber });
            setGames(await getgames);
        }

        const fetchStats = async (userIdNumber: number) => {
            const getstats = await getStatsLeaderBoard({ userId: userIdNumber });
            setStats(await getstats);
        }

        try {
            if (userIdNumber === 0) return;
            fetchGame(userIdNumber);
            fetchStats(userIdNumber);
        } catch (error) {
            console.log("Error response when fetching userstats/info:", error);
        }

    }, [userId]);

    const handleClick = (value: string) => {
        setActiveTab(value);
    };

    useEffect(() => {
        setHeaderTextColor(theme === "latte" ? "text-red" : "text-peach");
        setHeaderBorderColor(theme === "latte" ? "border-red" : "border-peach");
    }, [theme]);

    const data = [
        {
            label: "Leaderboard",
            value: "leaderboard",
        },
        {
            label: "Match History",
            value: "match-history",
        },
    ];

    const indicatorStyle = {
        transition: "border-color 0.5s ease-in-out, text-shadow 0.5s ease-in-out, color 0.5s ease-in-out,font-size 0.1s ease-in-out",
    };

    return (
        <div className={`mt-[1vw] rounded-lg transition hover:duration-[550ms] bg-surface0 bg-opacity-80 hover:shadow-[0_35px_55px_-20px_rgba(0,0,0,0.20)]`}>
            <Tabs value={activeTab}>
                <TabsHeader
                    className={`text-xl rounded-none bg-surface1 p-0 font-semibold h-[4vh]`} >
                    {data.map(({ label, value }) => (
                        <Tab
                            key={value}
                            value={value}
                            activeClassName="bg-transparent z-30" 
                            onClick={() => handleClick(value)}
                            style={indicatorStyle}
                            className={`z-11 ${activeTab === value ?  headerTextColor + " text-xl" : " text-text"
                                } border-b-4 ${activeTab === value ?  headerBorderColor : "border-gray-500"
                                }`}
                        >
                            {label}
                        </Tab>
                    ))}
                </TabsHeader>
                <TabsBody >
                    {data.map(({ value }) => (
                        <TabPanel key={value} value={value} className="text-gray-400">
                            {activeTab === "match-history" ? (
                                <MatchHistory data={games} currentUserId={Number(userIdNumber)} />
                            ) : (
                                <LeaderBoard data={stats} currentUser={userIdNumber} />
                            )}
                        </TabPanel>
                    ))}
                </TabsBody>
            </Tabs>
        </div>
    );
}
