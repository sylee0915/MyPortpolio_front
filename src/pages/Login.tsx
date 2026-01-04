import React, { useState } from 'react';
import { Container, TextField, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('admin_password', password);
        alert('관리자로 인증되었습니다.');
        navigate('/admin/settings'); // 설정 페이지로 이동
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>관리자 로그인</Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        type="password"
                        label="관리자 비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                    />
                    <Button type="submit" fullWidth variant="contained" color="secondary" sx={{ mt: 2 }}>
                        로그인
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;