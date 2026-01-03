import React, { useState, useEffect } from 'react';
import {
    Container, Typography, TextField, Button, Box, Paper,
    FormControl, InputLabel, Select, MenuItem,
    Checkbox, ListItemText, OutlinedInput, CircularProgress,
    Alert, Snackbar, Stack
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import { projectService, skillService } from '../services/api';
import type {ProjectRequest, Skill} from '../types';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const AdminProject: React.FC = () => {
    const navigate = useNavigate();

    // 상태 관리
    const [formData, setFormData] = useState<ProjectRequest>({
        title: '',
        description: '',
        period: '',
        teamSize: '',
        content: '',
        githubUrl: '',
        demoUrl: '',
        thumbnailUrl: '',
        erdImageUrl: '',
        architectureImageUrl: '',
        skillIds: []
    });

    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    // 기술 스택 목록 불러오기
    useEffect(() => {
        skillService.getAll()
            .then(res => setSkills(res.data))
            .catch(err => {
                console.error("기술 스택 로딩 실패:", err);
                setError("기술 스택 목록을 불러오는데 실패했습니다.");
            })
            .finally(() => setLoading(false));
    }, []);

    // URL 유효성 검증
    const isValidUrl = (url: string): boolean => {
        if (!url) return true; // 빈 값은 허용 (선택 필드)
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    // 폼 유효성 검증
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.title.trim()) {
            errors.title = '프로젝트 명은 필수입니다.';
        }

        if (!formData.description.trim()) {
            errors.description = '한 줄 개요는 필수입니다.';
        }

        if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
            errors.githubUrl = '올바른 URL 형식이 아닙니다.';
        }

        if (formData.demoUrl && !isValidUrl(formData.demoUrl)) {
            errors.demoUrl = '올바른 URL 형식이 아닙니다.';
        }

        if (formData.thumbnailUrl && !isValidUrl(formData.thumbnailUrl)) {
            errors.thumbnailUrl = '올바른 URL 형식이 아닙니다.';
        }

        if (formData.erdImageUrl && !isValidUrl(formData.erdImageUrl)) {
            errors.erdImageUrl = '올바른 URL 형식이 아닙니다.';
        }

        if (formData.architectureImageUrl && !isValidUrl(formData.architectureImageUrl)) {
            errors.architectureImageUrl = '올바른 URL 형식이 아닙니다.';
        }

        if (formData.skillIds.length === 0) {
            errors.skillIds = '최소 1개 이상의 기술 스택을 선택해주세요.';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // 입력값 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // 입력 시 해당 필드의 에러 제거
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // 기술 스택 선택 핸들러 (다중 선택)
    const handleSkillChange = (event: SelectChangeEvent<number[]>) => {
        const { value } = event.target;
        setFormData(prev => ({
            ...prev,
            skillIds: typeof value === 'string' ? value.split(',').map(Number) : value,
        }));

        // 기술 스택 선택 시 에러 제거
        if (validationErrors.skillIds) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.skillIds;
                return newErrors;
            });
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 유효성 검증
        if (!validateForm()) {
            setSnackbar({
                open: true,
                message: '입력 내용을 확인해주세요.',
                severity: 'error'
            });
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            await projectService.create(formData);
            setSnackbar({
                open: true,
                message: '프로젝트가 성공적으로 등록되었습니다.',
                severity: 'success'
            });

            // 1초 후 프로젝트 목록으로 이동
            setTimeout(() => {
                navigate('/projects');
            }, 1000);
        } catch (err: any) {
            console.error("등록 실패:", err);
            const errorMessage = err.response?.data?.message || "프로젝트 등록 중 오류가 발생했습니다.";
            setError(errorMessage);
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    // 스낵바 닫기
    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress color="secondary" />
        </Box>
    );

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4, bgcolor: 'background.paper' }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, color: 'text.primary' }}>
                    새 프로젝트 등록
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {/* 기본 정보 */}
                        <TextField
                            fullWidth
                            label="프로젝트 명"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            error={!!validationErrors.title}
                            helperText={validationErrors.title}
                        />

                        <TextField
                            fullWidth
                            label="한 줄 개요"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            error={!!validationErrors.description}
                            helperText={validationErrors.description}
                        />

                        <TextField
                            fullWidth
                            label="제작 기간"
                            name="period"
                            value={formData.period}
                            onChange={handleChange}
                            placeholder="예: 2023.08 ~ 2023.10"
                        />

                        <TextField
                            fullWidth
                            label="제작 인원"
                            name="teamSize"
                            value={formData.teamSize}
                            onChange={handleChange}
                            placeholder="예: 1인 프로젝트 / 팀 4인"
                        />

                        {/* 상세 내용 */}
                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            label="주요 페이지 소개 및 상세 구현 내용"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="프로젝트의 상세한 특징과 구현 기술을 작성해주세요."
                        />

                        {/* URL 정보 */}
                        <TextField
                            fullWidth
                            label="GitHub 주소"
                            name="githubUrl"
                            value={formData.githubUrl}
                            onChange={handleChange}
                            error={!!validationErrors.githubUrl}
                            helperText={validationErrors.githubUrl}
                            placeholder="https://github.com/..."
                        />

                        <TextField
                            fullWidth
                            label="데모/배포 주소"
                            name="demoUrl"
                            value={formData.demoUrl}
                            onChange={handleChange}
                            error={!!validationErrors.demoUrl}
                            helperText={validationErrors.demoUrl}
                            placeholder="https://..."
                        />

                        <TextField
                            fullWidth
                            label="썸네일 이미지 URL"
                            name="thumbnailUrl"
                            value={formData.thumbnailUrl}
                            onChange={handleChange}
                            error={!!validationErrors.thumbnailUrl}
                            helperText={validationErrors.thumbnailUrl}
                            placeholder="https://..."
                        />

                        <TextField
                            fullWidth
                            label="ERD 다이어그램 URL"
                            name="erdImageUrl"
                            value={formData.erdImageUrl}
                            onChange={handleChange}
                            error={!!validationErrors.erdImageUrl}
                            helperText={validationErrors.erdImageUrl}
                            placeholder="https://..."
                        />

                        <TextField
                            fullWidth
                            label="아키텍처 이미지 URL"
                            name="architectureImageUrl"
                            value={formData.architectureImageUrl}
                            onChange={handleChange}
                            error={!!validationErrors.architectureImageUrl}
                            helperText={validationErrors.architectureImageUrl}
                            placeholder="https://..."
                        />

                        {/* 기술 스택 선택 */}
                        <FormControl
                            fullWidth
                            error={!!validationErrors.skillIds}
                        >
                            <InputLabel id="skills-label">기술 스택 선택 *</InputLabel>
                            <Select
                                labelId="skills-label"
                                multiple
                                value={formData.skillIds}
                                onChange={handleSkillChange}
                                input={<OutlinedInput label="기술 스택 선택 *" />}
                                renderValue={(selected) =>
                                    skills.filter(s => selected.includes(s.skillId)).map(s => s.name).join(', ')
                                }
                                MenuProps={MenuProps}
                            >
                                {skills.map((skill) => (
                                    <MenuItem key={skill.skillId} value={skill.skillId}>
                                        <Checkbox checked={formData.skillIds.indexOf(skill.skillId) > -1} />
                                        <ListItemText primary={`${skill.name} (${skill.category})`} />
                                    </MenuItem>
                                ))}
                            </Select>
                            {validationErrors.skillIds && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                                    {validationErrors.skillIds}
                                </Typography>
                            )}
                        </FormControl>

                        {/* 제출 버튼 */}
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            size="large"
                            fullWidth
                            disabled={submitting}
                            sx={{ py: 1.5, fontWeight: 'bold', mt: 2 }}
                        >
                            {submitting ? <CircularProgress size={24} color="inherit" /> : "프로젝트 등록하기"}
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            {/* 스낵바 알림 */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminProject;