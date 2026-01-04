import React, { useState, useEffect } from 'react';
import {
    Container, Typography, TextField, Button, Box, Paper,
    CircularProgress, Alert, Snackbar, Stack, Divider, InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { uploadImageToImgBB } from '../services/api';
import type { SiteConfig } from '../types';

const AdminSettings: React.FC = () => {
    const navigate = useNavigate();

    // 상태 관리
    const [formData, setFormData] = useState<SiteConfig>({
        mainTitle: '',
        subTitle: '',
        mainImageUrl: '',
        primaryColor: '#374151',
        secondaryColor: '#0D9488',
        navColor: 'transparent'
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    // 현재 설정 불러오기
    useEffect(() => {
        api.get<SiteConfig>('/config')
            .then(res => {
                if (res.data) setFormData(res.data);
            })
            .catch(err => console.error("설정 로드 실패:", err))
            .finally(() => setLoading(false));
    }, []);

    // 입력값 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 메인 이미지 업로드 핸들러
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadImageToImgBB(file);
            setFormData(prev => ({ ...prev, mainImageUrl: url }));
            setSnackbar({ open: true, message: '이미지가 업로드되었습니다.', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: '이미지 업로드에 실패했습니다.', severity: 'error' });
        } finally {
            setUploading(false);
        }
    };

    // 설정 저장 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // 관리자 인증 헤더는 api.ts의 interceptor에서 처리됨
            await api.put('/admin/config', formData);
            setSnackbar({ open: true, message: '사이트 설정이 저장되었습니다. 새로고침 시 적용됩니다.', severity: 'success' });

            // 변경 사항 확인을 위해 1.5초 후 메인으로 이동
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setSnackbar({ open: true, message: '설정 저장에 실패했습니다. 비밀번호를 확인해주세요.', severity: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress color="secondary" />
        </Box>
    );

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4, bgcolor: 'background.paper' }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, color: 'text.primary' }}>
                    사이트 환경 설정
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                        {/* 텍스트 설정 섹션 */}
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main', fontWeight: 'bold' }}>메인 콘텐츠</Typography>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    label="메인 타이틀 (HTML 브레이크 <br /> 사용 가능)"
                                    name="mainTitle"
                                    value={formData.mainTitle}
                                    onChange={handleChange}
                                    multiline
                                />
                                <TextField
                                    fullWidth
                                    label="서브 타이틀 / 자기소개 문구"
                                    name="subTitle"
                                    value={formData.subTitle}
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                />
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                        fullWidth
                                        label="메인 사진 URL"
                                        name="mainImageUrl"
                                        value={formData.mainImageUrl}
                                        onChange={handleChange}
                                        InputProps={{
                                            endAdornment: uploading && <CircularProgress size={20} />
                                        }}
                                    />
                                    <Button variant="outlined" component="label" sx={{ whiteSpace: 'nowrap' }}>
                                        파일 선택
                                        <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>

                        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

                        {/* 색상 설정 섹션 */}
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main', fontWeight: 'bold' }}>테마 색상 (Hex Code)</Typography>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    label="메인 배경색 (Primary)"
                                    name="primaryColor"
                                    value={formData.primaryColor}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Box sx={{ width: 20, height: 20, bgcolor: formData.primaryColor, border: '1px solid white' }} /></InputAdornment>
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="포인트 색상 (Secondary)"
                                    name="secondaryColor"
                                    value={formData.secondaryColor}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Box sx={{ width: 20, height: 20, bgcolor: formData.secondaryColor, border: '1px solid white' }} /></InputAdornment>
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="네비게이션 바 배경색"
                                    name="navColor"
                                    value={formData.navColor}
                                    onChange={handleChange}
                                    placeholder="transparent 또는 #000000"
                                />
                            </Stack>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            size="large"
                            fullWidth
                            disabled={submitting || uploading}
                            sx={{ py: 1.5, fontWeight: 'bold' }}
                        >
                            {submitting ? <CircularProgress size={24} color="inherit" /> : "설정 저장하기"}
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminSettings;