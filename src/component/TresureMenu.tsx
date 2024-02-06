import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  StepIcon,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
} from '@mui/material';
import { ChevronLeft, ChevronRight, Search } from '@mui/icons-material';
import Link from 'next/link';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import {
  CreateAppbarTitle,
  CategoryInfomationList,
} from '@/libs/CategoryInfomation';

type TresureMenuProps = {
  path: string;
};

export default function TresureMenu(props: TresureMenuProps) {
  const [sideMenuIsOpen, setSideMenuIsOpen] = useState(false);
  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setSideMenuIsOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography>{CreateAppbarTitle(props.path)}</Typography>
        </Toolbar>
      </AppBar>
      <Divider sx={{ maxWidth: 300 }} />
      <Drawer variant="persistent" anchor="left" open={sideMenuIsOpen}>
        <IconButton onClick={() => setSideMenuIsOpen(false)}>
          {sideMenuIsOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
        <Divider />
        <List>
          {CategoryInfomationList.map((parent) => (
            <>
              <ListItem
                button={true}
                component={Link}
                key={parent.info.name}
                href={parent.info.link!}
              >
                <Typography>{parent.info.name}</Typography>
              </ListItem>
              {parent.content.map((item) => (
                <>
                  <ListItem
                    button
                    component={Link}
                    key={item.title}
                    href={item.link}
                    sx={{ maxWidth: 300 }}
                  >
                    <ListItemIcon>{<item.icon />}</ListItemIcon>
                    <Typography>{item.title}</Typography>
                  </ListItem>
                </>
              ))}
            </>
          ))}
        </List>
      </Drawer>
    </>
  );
}
