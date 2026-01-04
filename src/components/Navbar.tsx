import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface NavbarProps {
    isAdmin: boolean;
    setIsAdmin: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin, setIsAdmin }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem('admin_password');
            setIsAdmin(false); // 전역 상태 업데이트
            alert('로그아웃 되었습니다.');
            navigate('/');
        }
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: '#374151',
                borderBottom: '1px solid #4B5563'
            }}
        >
            <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{ textDecoration: 'none', color: '#FFFFFF', fontWeight: 'bold' }}
                    >
                        DEV_PORTFOLIO
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button component={RouterLink} to="/" sx={{ color: '#FFFFFF' }}>Home</Button>
                        <Button component={RouterLink} to="/projects" sx={{ color: '#FFFFFF' }}>Projects</Button>

                        {isAdmin ? (
                            <>
                                <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1, borderLeft: '1px solid #4B5563', pl: 2 }}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        component={RouterLink}
                                        to="/admin/projects/new"
                                        startIcon={<AddCircleOutlineIcon />}
                                        sx={{ color: '#0D9488', borderColor: '#0D9488' }}
                                    >
                                        등록
                                    </Button>
                                    <IconButton
                                        component={RouterLink}
                                        to="/admin/settings"
                                        sx={{ color: '#0D9488' }}
                                    >
                                        <SettingsIcon />
                                    </IconButton>
                                    <Button onClick={handleLogout} sx={{ color: '#ff4444' }}>
                                        Logout
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <Button
                                component={RouterLink}
                                to="/login"
                                sx={{
                                    color: 'rgba(255,255,255,0.2)',
                                    fontSize: '0.65rem',
                                    ml: 2
                                }}
                            >
                                Admin
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;