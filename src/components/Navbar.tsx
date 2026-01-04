import React, { useState, useEffect } from 'react'; // 1. useState, useEffect 임포트 확인
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings'; // 관리자 설정 아이콘

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    // 3. 컴포넌트 마운트 시 로그인 상태 확인
    useEffect(() => {
        const password = localStorage.getItem('admin_password');
        if (password) {
            setIsAdmin(true);
        }
    }, []);

    // 로그인 핸들러
    const handleLogin = () => {
        const password = window.prompt("관리자 비밀번호를 입력하세요.");
        if (password) {
            localStorage.setItem('admin_password', password);
            setIsAdmin(true);
            alert("관리자 모드로 전환되었습니다.");
        }
    };

    // 로그아웃 핸들러
    const handleLogout = () => {
        localStorage.removeItem('admin_password');
        setIsAdmin(false);
        alert("로그아웃 되었습니다.");
        navigate('/');
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

                        {/* 4. 관리자 상태에 따른 조건부 렌더링 */}
                        {isAdmin ? (
                            <>
                                <Button
                                    component={RouterLink}
                                    to="/admin/projects/new"
                                    sx={{ color: '#0D9488', fontWeight: 'bold' }}
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
                                <Button onClick={handleLogout} sx={{ color: '#ff4444', ml: 1 }}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            // 관리자가 아닐 때 구석에 작게 로그인 버튼
                            <Button
                                onClick={handleLogin}
                                sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem', ml: 2 }}
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