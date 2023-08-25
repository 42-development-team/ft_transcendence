"use client";

import React, { useState, useEffect, useLayoutEffect } from "react";
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import MatchHistory from "./matchHistory";
import LeaderBoard from "./leaderboard";
import sessionStorageUser from "./sessionStorage";
import getGames from "./getGames";
import getStatsLeaderBoard from "./getStatsLeaderBoard";

export function UnderlineTabs({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [games, setGames] = useState<any>([]);
  const [stats, setStats] = useState<any>([]);
  const [gamesLoaded, setGamesLoaded] = useState<Boolean>(false);
  const [statsLoaded, setStatsLoaded] = useState<Boolean>(false);
  const [userIdNumber, setUserIdNumber] = useState<number>(Number(userId));

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

    fetchGame(userIdNumber);
    fetchStats(userIdNumber);

  }, [gamesLoaded, statsLoaded]);

  const handleClick = (value: string) => {
    setActiveTab(value);
  };



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
    <div className=" mt-[1vw] rounded-lg transition hover:duration-[550ms] bg-surface0 bg-opacity-40 hover:shadow-[0_35px_55px_-20px_rgba(0,0,0,0.7)]">
      <Tabs value={activeTab}>
        <TabsHeader
          className="text-xl rounded-none bg-transparent p-0 font-semibold h-[4vh]"
        >
          {data.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              onClick={() => handleClick(value)}
              style={indicatorStyle}
              className={`${activeTab === value ? "text-blue-500 text-xl" : " text-gray-400"
                } border-b-4 ${activeTab === value ? "border-blue-500" : "border-gray-500"
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
            </TabPanel>// TODO: Add leaderboard and match history
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
}
