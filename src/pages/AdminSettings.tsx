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
        const fetchConfig = async () => {
            try {
                const res = await api.get<SiteConfig>('/config');
                if (res.data) setFormData(res.data);
            } catch (err) {
                console.error("설정 로드 실패:", err);
                setSnackbar({ open: true, message: '설정을 불러오는데 실패했습니다', severity: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    // 입력값 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 메인 이미지 업로드 핸들러 (개선 버전)
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 이미지 파일 검증
        if (!file.type.startsWith('image/')) {
            setSnackbar({ open: true, message: '이미지 파일만 업로드 가능합니다', severity: 'error' });
            return;
        }

        // 파일 크기 검증 (예: 5MB 제한)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setSnackbar({ open: true, message: '이미지 크기는 5MB 이하여야 합니다', severity: 'error' });
            return;
        }

        setUploading(true);
        try {
            const url = await uploadImageToImgBB(file);
            setFormData(prev => ({ ...prev, mainImageUrl: url }));
            setSnackbar({ open: true, message: '이미지가 업로드되었습니다', severity: 'success' });
        } catch (err) {
            console.error('이미지 업로드 실패:', err);
            setSnackbar({ open: true, message: '이미지 업로드에 실패했습니다', severity: 'error' });
        } finally {
            setUploading(false);
        }
    };

    // 색상 코드 검증
    const isValidHexColor = (color: string): boolean => {
        if (color === 'transparent') return true;
        return /^#([0-9A-F]{3}){1,2}$/i.test(color);
    };

    // 설정 저장 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 유효성 검사
        if (!formData.mainTitle.trim() || !formData.subTitle.trim()) {
            setSnackbar({ open: true, message: '필수 항목을 입력해주세요', severity: 'error' });
            return;
        }

        // 색상 코드 검증
        if (!isValidHexColor(formData.primaryColor) || !isValidHexColor(formData.secondaryColor)) {
            setSnackbar({ open: true, message: '올바른 색상 코드를 입력해주세요 (예: #FFFFFF)', severity: 'error' });
            return;
        }

        setSubmitting(true);

        try {
            await api.put('/admin/config', formData);
            setSnackbar({
                open: true,
                message: '사이트 설정이 저장되었습니다. 새로고침 시 적용됩니다.',
                severity: 'success'
            });

            // 변경 사항 확인을 위해 1.5초 후 메인으로 이동
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            console.error('설정 저장 실패:', err);
            setSnackbar({
                open: true,
                message: '설정 저장에 실패했습니다. 관리자 권한을 확인해주세요.',
                severity: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    // 이미지 미리보기
    const ImagePreview = () => {
        if (!formData.mainImageUrl) return null;
        return (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    미리보기
                </Typography>
                <Box
                    component="img"
                    src={formData.mainImageUrl}
                    alt="메인 이미지 미리보기"
                    sx={{
                        maxWidth: '100%',
                        maxHeight: 200,
                        borderRadius: 2,
                        objectFit: 'contain',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        setSnackbar({ open: true, message: '이미지를 불러올 수 없습니다', severity: 'error' });
                    }}
                />
            </Box>
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress color="secondary" />
            </Box>
        );
    }

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
                            <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main', fontWeight: 'bold' }}>
                                메인 콘텐츠
                            </Typography>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    label="메인 타이틀"
                                    name="mainTitle"
                                    value={formData.mainTitle}
                                    onChange={handleChange}
                                    multiline
                                    required
                                    helperText="HTML 태그 사용 가능 (예: <br />)"
                                />
                                <TextField
                                    fullWidth
                                    label="서브 타이틀 / 자기소개 문구"
                                    name="subTitle"
                                    value={formData.subTitle}
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                    required
                                />
                                <Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <TextField
                                            fullWidth
                                            label="메인 사진 URL"
                                            name="mainImageUrl"
                                            value={formData.mainImageUrl}
                                            onChange={handleChange}
                                            InputProps={{
                                                endAdornment: uploading && (
                                                    <InputAdornment position="end">
                                                        <CircularProgress size={20} />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            disabled={uploading}
                                            sx={{ whiteSpace: 'nowrap', minWidth: '100px' }}
                                        >
                                            {uploading ? '업로드 중...' : '파일 선택'}
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </Button>
                                    </Box>
                                    <ImagePreview />
                                </Box>
                            </Stack>
                        </Box>

                        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

                        {/* 색상 설정 섹션 */}
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main', fontWeight: 'bold' }}>
                                테마 색상 (Hex Code)
                            </Typography>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    label="메인 배경색 (Primary)"
                                    name="primaryColor"
                                    value={formData.primaryColor}
                                    onChange={handleChange}
                                    placeholder="#374151"
                                    helperText="예: #FFFFFF 또는 #FFF"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Box
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        bgcolor: formData.primaryColor,
                                                        border: '1px solid white',
                                                        borderRadius: 1
                                                    }}
                                                />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="포인트 색상 (Secondary)"
                                    name="secondaryColor"
                                    value={formData.secondaryColor}
                                    onChange={handleChange}
                                    placeholder="#0D9488"
                                    helperText="버튼, 강조 색상"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Box
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        bgcolor: formData.secondaryColor,
                                                        border: '1px solid white',
                                                        borderRadius: 1
                                                    }}
                                                />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="네비게이션 바 배경색"
                                    name="navColor"
                                    value={formData.navColor}
                                    onChange={handleChange}
                                    placeholder="transparent 또는 #000000"
                                    helperText="투명: transparent, 불투명: #색상코드"
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
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminSettings;