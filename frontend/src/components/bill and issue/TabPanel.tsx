import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import BillVoting from "./BillVoting";
import RegionalStat from "./RegionalStat";
import Comment from "./Comment";
import DetailsContent from "./DetailsContent";
import { BillsResponse } from "../../types/bills/bills details/types";

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

function TabMainPanel({ fetchBill, bill }: BillsResponse) {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div className="tab_panel">
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
          label="Bill Details"
          disableRipple
          disableTouchRipple
          disableFocusRipple
        />
        <Tab
          label="Voting Stats"
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
            <BillVoting fetchBill={fetchBill} bill={bill} />
            <DetailsContent fetchBill={fetchBill} bill={bill} />
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <Box>
            <BillVoting fetchBill={fetchBill} bill={bill} />
            <RegionalStat fetchBill={fetchBill} bill={bill} />
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <Comment fetchBill={fetchBill} bill={bill} />
        </TabPanel>
      </Box>
    </div>
  );
}

export default TabMainPanel;
