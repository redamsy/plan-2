import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import CategoryIcon from '@mui/icons-material/Category';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ProductTable from "./ProductTable";
import CategoryTable from "./CategoryTable";
import SubCategoryTable from "./SubCategoryTable";
import ColorTable from './ColorTable';
import SizeTable from './SizeTable';
import ImageTable from './ImageTable';
import VendorTable from './VendorTable';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function IconLabelTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', marginTop: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
        >
          <Tab icon={<ProductionQuantityLimitsIcon />} label="Products" {...a11yProps(0)} />
          <Tab icon={<WorkspacesIcon />} label="Categories" {...a11yProps(1)} />
          <Tab icon={<CategoryIcon />} label="Sub Categories" {...a11yProps(2)} />
          <Tab icon={<ColorLensOutlinedIcon />} label="Colors" {...a11yProps(3)} />
          <Tab icon={<StraightenOutlinedIcon />} label="Sizes" {...a11yProps(4)} />
          <Tab icon={<CameraAltOutlinedIcon />} label="Images" {...a11yProps(5)} />
          <Tab icon={<SupportAgentIcon />} label="Vendors" {...a11yProps(6)} />
        </Tabs>
      </Box>
          
      <TabPanel value={value} index={0}>
        <ProductTable />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CategoryTable />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <SubCategoryTable />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ColorTable />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <SizeTable />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <ImageTable />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <VendorTable />
      </TabPanel>
      {/* <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel> */}
    </Box>
  );
}
