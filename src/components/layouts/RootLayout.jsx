import styles from './RootLayout.module.scss';
import { AppBar, Box, Button, Drawer, Icon, IconButton, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import MenuIcon from '@mui/icons-material/Menu';

export default function RootLayout(props) {
  const { children } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              Fugu API examples
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <div>
          <ListItemButton>
            <ListItemIcon>
              <AccountBalanceIcon />
            </ListItemIcon>
            <ListItemText primary={<Link href="/">Home</Link>} />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <DriveFileMoveIcon />
            </ListItemIcon>
            <ListItemText primary={<Link href="/file-system-access-api">File System Access API</Link>} />
          </ListItemButton>
        </div>
      </Drawer>
      {children}
    </>
  )
}