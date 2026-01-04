import React, { useState } from 'react';
import { Container, TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

interface LoginProps {
    setIsAdmin: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAdmin }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password.trim()) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            // 1. 인터셉터가 사용할 수 있도록 로컬 스토리지에 먼저 저장
            localStorage.setItem('admin_password', password);

            // 2. 서버에 비밀번호 검증 요청
            await authService.verify();

            // 3. 검증 성공 시 전역 상태 업데이트 및 이동
            setIsAdmin(true);
            alert('관리자로 인증되었습니다.');
            navigate('/admin/settings');
        } catch (error: any) {
            // 4. 실패 시 토큰 삭제 및 알림
            localStorage.removeItem('admin_password');
            alert('비밀번호가 올바르지 않습니다.');
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
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
                        disabled={loading}
                        placeholder="비밀번호를 입력하세요"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 2, height: '45px' }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : '로그인'}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;