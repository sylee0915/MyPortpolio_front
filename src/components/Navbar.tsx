import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: '#374151', // 배경색과 동일하게 맞춤
                borderBottom: '1px solid #4B5563' // 미세한 구분선
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
                    <Box>
                        <Button component={RouterLink} to="/" sx={{ color: '#FFFFFF' }}>Home</Button>
                        <Button component={RouterLink} to="/projects" sx={{ color: '#FFFFFF' }}>Projects</Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;