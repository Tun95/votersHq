import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";

import Comment from "./Comment";
import PollLeaderBoard from "./PollLeaderBoard";
import PolesVotes from "./PolesVotes";
import VoteStats from "./VoteStats";
import { ElectionResponse } from "../../types/election/election details/types";

// Custom TabPanel component to conditionally render tab content
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function TabMainPanel({
  election,
  totalVotes,
  maleVotes,
  femaleVotes,
  ageRangeDistribution,
  leaderboardTop5,
  leaderboardTop3,
  fetchElection,
}: ElectionResponse) {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <div className="tab_panel tap_mobile candidate_view_tab">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="tab panel"
          className="tabs"
          sx={{
            borderBottom: "1px solid var(--color-border)",
            margin: "0px 20px",
            ".MuiTabs-indicator": { backgroundColor: "var(--color-primary)" },
            ".MuiTab-root": { textTransform: "none" },
            ".Mui-selected": {
              color: "var(--color-primary)",
              borderBottom: "3px solid var(--color-primary)",
              position: "relative",
              fontWeight: "600",
            },
          }}
        >
          <Tab
            label="Election Details"
            disableRipple
            disableTouchRipple
            disableFocusRipple
          />
          <Tab
            label="Election Stats"
            disableRipple
            disableTouchRipple
            disableFocusRipple
          />
          <Tab
            label="Comment"
            disableRipple
            disableTouchRipple
            disableFocusRipple
          />
        </Tabs>

        <Box className="TabPanel">
          <TabPanel value={selectedTab} index={0}>
            <Box>
              <PolesVotes
                election={election}
                totalVotes={totalVotes}
                maleVotes={maleVotes}
                femaleVotes={femaleVotes}
                ageRangeDistribution={ageRangeDistribution}
                leaderboardTop5={leaderboardTop5}
                leaderboardTop3={leaderboardTop3}
                fetchElection={fetchElection}
              />
            </Box>
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <Box>
              <PollLeaderBoard
                election={election}
                totalVotes={totalVotes}
                maleVotes={maleVotes}
                femaleVotes={femaleVotes}
                ageRangeDistribution={ageRangeDistribution}
                leaderboardTop5={leaderboardTop5}
                leaderboardTop3={leaderboardTop3}
                fetchElection={fetchElection}
              />
            </Box>
            <Box>
              <VoteStats
                election={election}
                totalVotes={totalVotes}
                maleVotes={maleVotes}
                femaleVotes={femaleVotes}
                ageRangeDistribution={ageRangeDistribution}
                leaderboardTop5={leaderboardTop5}
                leaderboardTop3={leaderboardTop3}
                fetchElection={fetchElection}
              />
            </Box>
          </TabPanel>
          <TabPanel value={selectedTab} index={2}>
            <Box>
              <Comment
                election={election}
                totalVotes={totalVotes}
                maleVotes={maleVotes}
                femaleVotes={femaleVotes}
                ageRangeDistribution={ageRangeDistribution}
                leaderboardTop5={leaderboardTop5}
                leaderboardTop3={leaderboardTop3}
                fetchElection={fetchElection}
              />
            </Box>
          </TabPanel>
        </Box>
      </div>
    </>
  );
}

export default TabMainPanel;
