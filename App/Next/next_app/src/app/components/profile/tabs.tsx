import React, { useState } from "react";
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";

export function UnderlineTabs() {
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [animateTab, setAnimateTab] = useState("transition duration-1000 ease-out transform translate-x-0");

  const handleClick = (value: string) => {
    setActiveTab(value);
    setAnimateTab(value === "leaderboard" ? "transition duration-300 ease-out transform translate-x-0" : "transition duration-300 ease-out transform translate-x-full");
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
    <div>
      <Tabs value={activeTab}>
        <TabsHeader
          className="rounded-none bg-transparent p-0 font-semibold"
          indicatorProps={{
            style: indicatorStyle, //this shit doesn't works
          }}
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
