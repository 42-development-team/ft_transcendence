"use client";

import React, { useState, useEffect, useContext } from "react";
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
  const [gamesLoaded, setGamesLoaded] = useState<any>(false);
  const [statsLoaded, setStatsLoaded] = useState<any>(false);
  const [userIdNumber, setUserIdNumber] = useState<number>(Number(userId));
  const {theme} = useContext(ThemeContext);
  const [headerTextColor, setHeaderTextColor] = useState<string>(theme === "latte" ? "red" : "peach");
  const [bodyColor, setBodyColor] = useState<string>(theme === "latte" ? "bg-overlay0" : "bg-surface0");
  
  useEffect(() => {
    let sessionUserId = null;
    sessionUserId = sessionStorageUser();

    if (sessionUserId !== null && sessionUserId !== undefined) {
      setUserIdNumber(Number(sessionUserId) as number);
    }

    const fetchGame = async (userIdNumber: number) => {
      const getgames = await getGames({ userId: userIdNumber });
      setGames(await getgames);
      setGamesLoaded(true);
    }

    const fetchStats = async (userIdNumber: number) => {
      const getstats = await getStatsLeaderBoard({ userId: userIdNumber });
      setStats(await getstats);
      setStatsLoaded(true);
    }

    try {
      fetchGame(userIdNumber);
      fetchStats(userIdNumber);
      if (stats === undefined)
        throw new Error();
    } catch (error) {
      console.log("Error response when fetching userstats/info:", error);
    }

  }, [gamesLoaded, statsLoaded]);

  const handleClick = (value: string) => {
    setActiveTab(value);
  };

  useEffect(() => {
    if (theme === "latte") {
      setHeaderTextColor("red");
      setBodyColor("bg-surface0");
    }
    else {
      setHeaderTextColor("peach");
      setBodyColor("bg-surface0");
    }
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
    <div className={`  mt-[1vw] rounded-lg transition hover:duration-[550ms] bg-surface0 bg-opacity-80 hover:shadow-[0_35px_55px_-20px_rgba(0,0,0,0.20)]`}>
      <Tabs value={activeTab}>
        <TabsHeader
          className={`text-xl rounded-none bg-surface1 p-0 font-semibold h-[4vh]`}
        >
          {data.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              onClick={() => handleClick(value)}
              style={indicatorStyle}
              className={`${activeTab === value ? "text-" + headerTextColor + " text-xl" : " text-gray-400"
                } border-b-4 ${activeTab === value ? "border-" + headerTextColor : "border-gray-500"
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
