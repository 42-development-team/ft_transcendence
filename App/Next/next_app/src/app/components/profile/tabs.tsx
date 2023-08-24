"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import MatchHistory from "./matchHistory";
import LeaderBoard  from "./leaderboard";
import sessionStorageUser from "./sessionStorage";
import getGames from "./getGames";

export function UnderlineTabs( {userId}: {userId: string} ) {
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [games, setGames] = useState<any>([]);

  useEffect(() => {
    let sessionUserId = null;
    sessionUserId = sessionStorageUser();

    if (sessionUserId !== null && sessionUserId !== undefined) {
      userId = sessionUserId as string;
    }
    fetchGame(userId);

  }, []);

  useEffect(() => {
  }, [games]);

  const handleClick = (value: string) => {
    setActiveTab(value);
  };

  const fetchGame = async (userId: string) => {
    const games = await getGames({userId: Number(userId)})
    setGames(await games);
  }

  const data = [
    {
      label: "Leaderboard",
      value: "leaderboard",
      desc: `Here the leaderboard Component(s) will be rendered`,
    },
    {
      label: "Match History",
      value: "match-history",
      desc: `Here the Match-history Component(s) will be rendered`,
    },
  ];

  //TODO: fetch data from backend


  const leaderBoardData = [{ avatar: "avatar", username: "jeanClaude38", wdr: "10/10/1" },
  { avatar: "avatar", username: "jeanClaude38", wdr: "10/10/1" },
  { avatar: "avatar", username: "jeanClaude38", wdr: "10/10/1" },
  { avatar: "avatar", username: "jeanClaude38", wdr: "10/10/1" },
  { avatar: "avatar", username: "aucaland", wdr: "10/10/1" },
  { avatar: "avatar", username: "jeanClaude38", wdr: "10/10/1" }];

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
              className={`${
                activeTab === value ? "text-blue-500 text-xl" : " text-gray-400"
              } border-b-4 ${
                activeTab === value ? "border-blue-500" : "border-gray-500"
              }`}
            >
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody >
          {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value} className="text-gray-400">
              {activeTab === "match-history" ? (
                <MatchHistory data={games} currentUserId={Number(userId)}/>
              ) : (
                <LeaderBoard data={leaderBoardData} currentUser={userId}/>
              )}
            </TabPanel>// TODO: Add leaderboard and match history
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
}
