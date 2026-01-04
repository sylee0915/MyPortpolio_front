import React, { useState, useEffect } from 'react';
import {
    Container, Typography, TextField, Button, Box, Paper,
    FormControl, InputLabel, Select, MenuItem,
    Checkbox, ListItemText, OutlinedInput, CircularProgress,
    Alert, Snackbar, Stack, InputAdornment
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import { projectService, skillService, uploadImageToImgBB } from '../services/api';
import type { ProjectRequest, Skill } from '../types';

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
    const [uploadingField, setUploadingField] = useState<string | null>(null); // 현재 업로드 중인 필드 식별
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

    // 이미지 파일 업로드 핸들러 추가
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof ProjectRequest) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingField(fieldName);
        try {
            const url = await uploadImageToImgBB(file);
            setFormData(prev => ({ ...prev, [fieldName]: url }));
            setSnackbar({ open: true, message: '이미지가 성공적으로 업로드되었습니다.', severity: 'success' });
        } catch (err) {
            console.error("이미지 업로드 실패:", err);
            setSnackbar({ open: true, message: '이미지 업로드에 실패했습니다.', severity: 'error' });
        } finally {
            setUploadingField(null);
        }
    };

    // 폼 유효성 검증
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        if (!formData.title.trim()) errors.title = '프로젝트 명은 필수입니다.';
        if (!formData.description.trim()) errors.description = '한 줄 개요는 필수입니다.';
        if (formData.skillIds.length === 0) errors.skillIds = '최소 1개 이상의 기술 스택을 선택해주세요.';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSkillChange = (event: SelectChangeEvent<number[]>) => {
        const { value } = event.target;
        setFormData(prev => ({
            ...prev,
            skillIds: typeof value === 'string' ? value.split(',').map(Number) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            setSnackbar({ open: true, message: '입력 내용을 확인해주세요.', severity: 'error' });
            return;
        }

        setSubmitting(true);
        try {
            await projectService.create(formData);
            setSnackbar({ open: true, message: '프로젝트가 성공적으로 등록되었습니다.', severity: 'success' });
            setTimeout(() => navigate('/projects'), 1000);
        } catch (err: any) {
            setError(err.response?.data?.message || "프로젝트 등록 중 오류가 발생했습니다.");
            setSnackbar({ open: true, message: '등록에 실패했습니다.', severity: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    // 이미지 업로드 입력란 컴포넌트
    const ImageUploadField = ({ label, name, value }: { label: string, name: keyof ProjectRequest, value: string }) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <TextField
                fullWidth
                label={label}
                name={name}
                value={value}
                onChange={handleChange}
                placeholder="https://..."
                InputProps={{
                    endAdornment: uploadingField === name && (
                        <InputAdornment position="end">
                            <CircularProgress size={20} />
                        </InputAdornment>
                    ),
                }}
            />
            <Button
                variant="outlined"
                component="label"
                sx={{ height: '56px', minWidth: '100px' }}
                disabled={!!uploadingField}
            >
                파일 선택
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, name)}
                />
            </Button>
        </Box>
    );

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
                        <TextField fullWidth label="프로젝트 명" name="title" value={formData.title} onChange={handleChange} required error={!!validationErrors.title} helperText={validationErrors.title} />
                        <TextField fullWidth label="한 줄 개요" name="description" value={formData.description} onChange={handleChange} required error={!!validationErrors.description} helperText={validationErrors.description} />

                        <Stack direction="row" spacing={2}>
                            <TextField fullWidth label="제작 기간" name="period" value={formData.period} onChange={handleChange} placeholder="예: 2023.08 ~ 2023.10" />
                            <TextField fullWidth label="제작 인원" name="teamSize" value={formData.teamSize} onChange={handleChange} placeholder="예: 1인 / 팀 4인" />
                        </Stack>

                        <TextField fullWidth multiline rows={4} label="상세 구현 내용" name="content" value={formData.content} onChange={handleChange} />

                        <TextField fullWidth label="GitHub 주소" name="githubUrl" value={formData.githubUrl} onChange={handleChange} />
                        <TextField fullWidth label="데모 주소" name="demoUrl" value={formData.demoUrl} onChange={handleChange} />

                        {/* 이미지 업로드 필드 적용 */}
                        <ImageUploadField label="썸네일 이미지 URL" name="thumbnailUrl" value={formData.thumbnailUrl} />
                        <ImageUploadField label="ERD 다이어그램 URL" name="erdImageUrl" value={formData.erdImageUrl} />
                        <ImageUploadField label="아키텍처 이미지 URL" name="architectureImageUrl" value={formData.architectureImageUrl} />

                        <FormControl fullWidth error={!!validationErrors.skillIds}>
                            <InputLabel id="skills-label">기술 스택 선택 *</InputLabel>
                            <Select
                                labelId="skills-label"
                                multiple
                                value={formData.skillIds}
                                onChange={handleSkillChange}
                                input={<OutlinedInput label="기술 스택 선택 *" />}
                                renderValue={(selected) => skills.filter(s => selected.includes(s.skillId)).map(s => s.name).join(', ')}
                                MenuProps={MenuProps}
                            >
                                {skills.map((skill) => (
                                    <MenuItem key={skill.skillId} value={skill.skillId}>
                                        <Checkbox checked={formData.skillIds.indexOf(skill.skillId) > -1} />
                                        <ListItemText primary={`${skill.name} (${skill.category})`} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button type="submit" variant="contained" color="secondary" size="large" fullWidth disabled={submitting} sx={{ py: 1.5, fontWeight: 'bold' }}>
                            {submitting ? <CircularProgress size={24} color="inherit" /> : "프로젝트 등록하기"}
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminProject;