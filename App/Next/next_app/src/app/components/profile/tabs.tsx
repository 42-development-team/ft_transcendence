"use client";

import React, { useState } from "react";
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";

export function UnderlineTabs() {
  const [activeTab, setActiveTab] = useState("leaderboard");

  const handleClick = (value: string) => {
    setActiveTab(value);
  };

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

  const indicatorStyle = {
    transition: "border-color 0.5s ease-in-out, text-shadow 0.5s ease-in-out",
  };
  
  return (
    <div className=" mt-[1vw] h-full rounded-lg transition hover:duration-[550ms] bg-surface0 hover:shadow-[0_35px_55px_-20px_rgba(0,0,0,0.7)]">
      <Tabs value={activeTab}>
        <TabsHeader
          className="rounded-none bg-transparent p-0 font-semibold"
        >
          {data.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              onClick={() => handleClick(value)}
              style={indicatorStyle}
              className={`${
                activeTab === value ? "text-blue-500" : " text-gray-400"
              } border-b-2 ${
                activeTab === value ? "border-blue-500" : "border-gray-500"
              }`}
            >
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value} className="text-gray-400">
              {desc} 
            </TabPanel>// TODO: Add leaderboard and match history
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
}
