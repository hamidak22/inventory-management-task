import React, { useState } from 'react';
import {
    Drawer,
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    useTheme,
    Typography,
    useMediaQuery,
    AppBar,
    Toolbar,
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import InventoryIcon from '@mui/icons-material/Inventory';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import StoreIcon from '@mui/icons-material/Store';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Menu as MenuIcon } from '@mui/icons-material';

const AppSidebar = () => {
    const theme = useTheme();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };


    const currentTab = pathname?.split('/')[1] || '';
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navItemsTop = [
        {
            text: 'Dashboard',
            tabKey: '',
            icon: <DashboardIcon />,
            url: `/`,
        },
        {
            text: 'Products',
            tabKey: 'products',
            icon: <InventoryIcon />,
            url: `/products`,
        },
        {
            text: 'Warehouses',
            tabKey: 'warehouses',
            icon: <WarehouseIcon />,
            url: `/warehouses`,
        },
        {
            text: 'Stock Levels',
            tabKey: 'stock',
            icon: <StoreIcon />,
            url: `/stock`,
        },
        {
            text: 'Transfers',
            tabKey: 'transfers',
            icon: <LocalShippingIcon />,
            url: `/transfers`,
        },
        {
            text: 'Alerts',
            tabKey: 'alerts',
            icon: <NotificationsIcon />,
            url: `/alerts`,
        },
    ];

    return (
        <>
            {isMobile && (
                <AppBar
                    position="fixed"
                    sx={{
                        width: '100%',
                        zIndex: theme.zIndex.drawer + 1,
                        bgcolor: '#2e7d32',
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            Inventory Management System
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            <Box
                component="nav"
                sx={{ width: { sm: 300 }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant={isMobile ? 'temporary' : 'permanent'}
                    open={open}
                    sx={{
                        width: open ? 300 : 60,
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                        '& .MuiDrawer-paper': {
                            width: open ? 300 : 60,
                            backgroundColor: theme.palette.primary.dark,
                            boxSizing: 'border-box',
                            borderRight: 'none',
                            overflowX: 'hidden',
                            py: 2,
                            px: open ? 4 : 1,
                            borderRadius: '0 14px 14px 0',
                            boxShadow:
                                '0px 8px 16px -4px rgba(18, 25, 38, 0.07), 0px 0px 1px 0px rgba(12, 26, 75, 0.10)',
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: open
                                    ? theme.transitions.duration.enteringScreen
                                    : theme.transitions.duration.leavingScreen,
                            }),
                        },
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: open ? 'space-between' : 'center',
                                p: open ? theme.spacing(0, 0, 0, 0.5) : 0,
                                mb: open ? 5 : 5,
                                mt: 2,
                                height: 'auto',
                            }}
                        >
                            {open && (
                                <Box
                                    sx={{
                                        flexGrow: 1,
                                        display: 'flex',
                                        justifyContent: 'start',
                                        alignItems: 'center',
                                        color: 'white',
                                    }}
                                >
                                    <InventoryIcon sx={{ mr: 2 }} />
                                    <Typography fontSize={12} fontWeight={700}>
                                        Inventory Management System
                                    </Typography>
                                </Box>
                            )}
                            <IconButton
                                onClick={handleDrawerToggle}
                                aria-label={open ? 'Close sidebar' : 'Open sidebar'}
                                sx={{
                                    backgroundColor: theme.palette.primary[600],
                                    color: 'white',
                                    borderRadius: '8px',
                                    width: 32,
                                    height: 32,
                                }}
                            >
                                {open ? (
                                    <ArrowBackIosNewIcon />
                                ) : (
                                    <ArrowForwardIosIcon />
                                )}
                            </IconButton>
                        </Box>

                        {!open && (
                            <Box
                                sx={{
                                    mx: 'auto',
                                    color: 'white',
                                    my: 2.5,
                                }}
                            >
                                <InventoryIcon />
                            </Box>
                        )}
                        <List
                            sx={{
                                flexGrow: 1,
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                pt: open ? 3 : 1.5,
                                px: open ? 0.5 : 0,
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                '&::-webkit-scrollbar': {
                                    display: 'none',
                                },
                                borderTop: '1px dashed white'
                            }}
                        >
                            {navItemsTop.map((item) => {
                                const isActive = currentTab === item.tabKey;

                                return (
                                    <React.Fragment key={item.text}>
                                        <Link
                                            href={item.url}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <ListItemButton
                                                title={open ? '' : item.text}
                                                sx={{
                                                    minHeight: 32,
                                                    justifyContent: open ? 'initial' : 'center',
                                                    px: 2.5,
                                                    py: 1.5,
                                                    mb: 3,
                                                    borderRadius: '8px',
                                                    color: isActive
                                                        ? theme.palette.primary[600]
                                                        : 'white',
                                                    transition: theme.transitions.create(
                                                        ['background-color', 'box-shadow', 'color'],
                                                        {
                                                            duration: theme.transitions.duration.short,
                                                        }
                                                    ),
                                                    ...(isActive && {
                                                        backgroundColor: '#ffffff',
                                                        boxShadow: '0px 3px 8px -1px rgba(50, 50, 71, 0.05), 0px 0px 1px 0px rgba(12, 26, 75, 0.20)',
                                                    }),
                                                    ...(!isActive && {
                                                        '&:hover': {
                                                            color: theme.palette.primary[600],
                                                        },
                                                    }),
                                                }}
                                            >
                                                <ListItemIcon
                                                    sx={{
                                                        minWidth: 0,
                                                        mr: open ? 2 : 'none',
                                                        justifyContent: 'center',
                                                        color: 'inherit',
                                                    }}
                                                >
                                                    {item.icon}
                                                </ListItemIcon>
                                                {open && (
                                                    <ListItemText
                                                        primary={item.text}
                                                        primaryTypographyProps={{
                                                            sx: {
                                                                fontWeight: isActive ? 600 : 500,
                                                                fontSize: '12px',
                                                                color: 'inherit',
                                                            },
                                                        }}
                                                    />
                                                )}
                                            </ListItemButton>
                                        </Link>
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    </Box>
                </Drawer>
            </Box>
        </>
    );
};

export default AppSidebar;
