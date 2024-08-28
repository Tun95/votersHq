import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import Biography from "./Biography";
import Manifesto from "./Manifesto";
import PoliticalTime from "./PoliticalTime";
import { CandidateProps } from "../../../types/candidate/types";

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
        <div className="tabPanel">
          <Typography>{children}</Typography>
        </div>
      )}
    </div>
  );
}

function TabMainPanel({ candidate }: CandidateProps) {
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
            label="Biography"
            disableRipple
            disableTouchRipple
            disableFocusRipple
          />
          <Tab
            label="Manifesto"
            disableRipple
            disableTouchRipple
            disableFocusRipple
          />
          <Tab
            label="Political Timeline"
            disableRipple
            disableTouchRipple
            disableFocusRipple
            className="mobile"
          />
        </Tabs>

        <Box>
          <TabPanel value={selectedTab} index={0}>
            <Box>
              <Biography candidate={candidate} />
            </Box>
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <Box>
              <Manifesto candidate={candidate} />
            </Box>
          </TabPanel>
          <TabPanel value={selectedTab} index={2}>
            <Box className="mobile">
              <PoliticalTime candidate={candidate} />
            </Box>
          </TabPanel>
        </Box>
      </div>
    </>
  );
}

export default TabMainPanel;
