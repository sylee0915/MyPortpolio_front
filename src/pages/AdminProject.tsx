import React, { useState, useEffect } from 'react';
import {
    Container, Typography, TextField, Button, Box, Paper,
    FormControl, InputLabel, Select, MenuItem,
    Checkbox, ListItemText, OutlinedInput, CircularProgress,
    Alert, Snackbar, Stack, InputAdornment, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useParams } from 'react-router-dom';
import { projectService, skillService, uploadImageToImgBB } from '../services/api';
import type { ProjectRequest, Skill } from '../types';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: { style: { maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, width: 250 } },
};

const AdminProject: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<ProjectRequest>({
        title: '', description: '', period: '', teamSize: '', content: '',
        githubUrl: '', demoUrl: '', thumbnailUrl: '', erdImageUrl: '', architectureImageUrl: '',
        skillIds: []
    });

    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [uploadingField, setUploadingField] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    // 기술 스택 추가 상태
    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillCategory, setNewSkillCategory] = useState<Skill['category']>('Other');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const skillsRes = await skillService.getAll();
                const allSkills = skillsRes.data;
                setSkills(allSkills);

                if (isEditMode) {
                    const projectRes = await projectService.getById(Number(id));
                    const p = projectRes.data;
                    const currentSkillIds = allSkills
                        .filter(s => p.skills.includes(s.name))
                        .map(s => s.skillId);

                    setFormData({
                        title: p.title, description: p.description, period: p.period, teamSize: p.teamSize, content: p.content,
                        githubUrl: p.githubUrl || '', demoUrl: p.demoUrl || '', thumbnailUrl: p.thumbnailUrl || '',
                        erdImageUrl: p.erdImageUrl || '', architectureImageUrl: p.architectureImageUrl || '',
                        skillIds: currentSkillIds
                    });
                }
            } catch (err) {
                console.error("데이터 로딩 실패:", err);
                setSnackbar({ open: true, message: '데이터 로딩 실패', severity: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEditMode]);

    const handleAddGlobalSkill = async () => {
        if (!newSkillName.trim()) {
            setSnackbar({ open: true, message: '기술명을 입력해주세요', severity: 'error' });
            return;
        }
        try {
            const res = await skillService.add({ name: newSkillName, category: newSkillCategory });
            setSkills(prev => [...prev, res.data]);
            setNewSkillName('');
            setSnackbar({ open: true, message: '기술 스택이 추가되었습니다', severity: 'success' });
        } catch (err) {
            console.error('기술 스택 추가 실패:', err);
            setSnackbar({ open: true, message: '기술 스택 추가 실패', severity: 'error' });
        }
    };

    const handleDeleteGlobalSkill = async (e: React.MouseEvent, skillId: number) => {
        e.stopPropagation();
        if (!window.confirm("리스트에서 삭제하시겠습니까?")) return;
        try {
            await skillService.delete(skillId);
            setSkills(prev => prev.filter(s => s.skillId !== skillId));
            setFormData(prev => ({ ...prev, skillIds: prev.skillIds.filter(sid => sid !== skillId) }));
            setSnackbar({ open: true, message: '기술 스택이 삭제되었습니다', severity: 'success' });
        } catch (err) {
            console.error('기술 스택 삭제 실패:', err);
            setSnackbar({ open: true, message: '삭제 실패: 사용 중인 프로젝트가 있을 수 있습니다', severity: 'error' });
        }
    };

    // ⭐ 개선된 파일 업로드 핸들러 (디버깅 추가)
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof ProjectRequest) => {
        console.log('📤 업로드 시작:', fieldName); // 디버깅 로그

        const file = e.target.files?.[0];
        if (!file) {
            console.log('❌ 파일이 선택되지 않음');
            return;
        }

        console.log('📁 선택된 파일:', file.name, file.type, file.size);

        // 이미지 파일 확인
        if (!file.type.startsWith('image/')) {
            setSnackbar({ open: true, message: '이미지 파일만 업로드 가능합니다', severity: 'error' });
            return;
        }

        // 파일 크기 제한 (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setSnackbar({ open: true, message: '이미지 크기는 5MB 이하여야 합니다', severity: 'error' });
            return;
        }

        setUploadingField(fieldName);
        console.log('⏳ 업로딩 상태:', fieldName);

        try {
            console.log('🔄 ImgBB 업로드 중...');
            const url = await uploadImageToImgBB(file);
            console.log('✅ 업로드 성공! URL:', url);

            setFormData(prev => {
                const newData = { ...prev, [fieldName]: url };
                console.log('💾 FormData 업데이트:', newData);
                return newData;
            });

            setSnackbar({ open: true, message: '이미지가 업로드되었습니다', severity: 'success' });
        } catch (err) {
            console.error('❌ 업로드 실패:', err);
            setSnackbar({ open: true, message: '이미지 업로드 실패', severity: 'error' });
        } finally {
            setUploadingField(null);
            console.log('🏁 업로드 완료');
        }

        // input 초기화 (같은 파일 재선택 가능하도록)
        e.target.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 필수 항목 검증
        if (!formData.title.trim() || !formData.description.trim()) {
            setSnackbar({ open: true, message: '필수 항목을 입력해주세요', severity: 'error' });
            return;
        }

        console.log('📋 제출할 데이터:', formData);
        setSubmitting(true);

        try {
            if (isEditMode) {
                await projectService.update(Number(id), formData);
            } else {
                await projectService.create(formData);
            }
            setSnackbar({ open: true, message: '프로젝트가 저장되었습니다', severity: 'success' });
            setTimeout(() => navigate('/projects'), 1000);
        } catch (err) {
            console.error('저장 실패:', err);
            setSnackbar({ open: true, message: '저장 실패', severity: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    // ⭐ 개선된 ImageUploadField 컴포넌트
    const ImageUploadField = ({ label, name, value }: { label: string, name: keyof ProjectRequest, value: string }) => (
        <Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    label={label}
                    name={name}
                    value={value}
                    onChange={(e) => {
                        console.log('✏️ 텍스트 입력:', name, e.target.value);
                        setFormData(p => ({...p, [name]: e.target.value}));
                    }}
                    InputProps={{
                        endAdornment: uploadingField === name && (
                            <InputAdornment position="end">
                                <CircularProgress size={20} />
                            </InputAdornment>
                        )
                    }}
                />
                <Button
                    variant="outlined"
                    component="label"
                    disabled={uploadingField === name}
                    sx={{ height: '56px', minWidth: '100px' }}
                >
                    {uploadingField === name ? '업로드 중...' : '파일 선택'}
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                            console.log('🖱️ 파일 선택 이벤트 발생:', name);
                            handleFileUpload(e, name);
                        }}
                    />
                </Button>
            </Box>

            {/* 이미지 미리보기 */}
            {value && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        미리보기
                    </Typography>
                    <Box
                        component="img"
                        src={value}
                        alt={label}
                        sx={{
                            maxWidth: '100%',
                            maxHeight: 150,
                            borderRadius: 1,
                            objectFit: 'contain',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                        onError={(e) => {
                            console.error('🖼️ 이미지 로드 실패:', value);
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </Box>
            )}
        </Box>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4, bgcolor: 'background.paper' }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                    {isEditMode ? "프로젝트 수정" : "새 프로젝트 등록"}
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {/* 기본 정보 */}
                        <TextField
                            fullWidth
                            label="프로젝트 명"
                            name="title"
                            value={formData.title}
                            onChange={(e) => setFormData(p => ({...p, title: e.target.value}))}
                            required
                        />

                        <TextField
                            fullWidth
                            label="한 줄 개요"
                            name="description"
                            value={formData.description}
                            onChange={(e) => setFormData(p => ({...p, description: e.target.value}))}
                            required
                        />

                        <Stack direction="row" spacing={2}>
                            <TextField
                                fullWidth
                                label="제작 기간"
                                value={formData.period}
                                onChange={(e) => setFormData(p => ({...p, period: e.target.value}))}
                            />
                            <TextField
                                fullWidth
                                label="제작 인원"
                                value={formData.teamSize}
                                onChange={(e) => setFormData(p => ({...p, teamSize: e.target.value}))}
                            />
                        </Stack>

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="상세 내용"
                            value={formData.content}
                            onChange={(e) => setFormData(p => ({...p, content: e.target.value}))}
                        />

                        {/* URL 정보 */}
                        <TextField
                            fullWidth
                            label="GitHub URL"
                            value={formData.githubUrl}
                            onChange={(e) => setFormData(p => ({...p, githubUrl: e.target.value}))}
                        />

                        <TextField
                            fullWidth
                            label="데모 URL"
                            value={formData.demoUrl}
                            onChange={(e) => setFormData(p => ({...p, demoUrl: e.target.value}))}
                        />

                        {/* 이미지 업로드 섹션 */}
                        <Typography variant="h6" sx={{ mt: 2, color: 'secondary.main' }}>
                            이미지 업로드
                        </Typography>

                        <ImageUploadField label="썸네일 이미지" name="thumbnailUrl" value={formData.thumbnailUrl} />
                        <ImageUploadField label="ERD 이미지" name="erdImageUrl" value={formData.erdImageUrl} />
                        <ImageUploadField label="아키텍처 이미지" name="architectureImageUrl" value={formData.architectureImageUrl} />

                        {/* 기술 스택 선택 */}
                        <FormControl fullWidth>
                            <InputLabel>기술 스택 선택</InputLabel>
                            <Select
                                multiple
                                value={formData.skillIds}
                                onChange={(e) => setFormData(p => ({...p, skillIds: e.target.value as number[]}))}
                                input={<OutlinedInput label="기술 스택 선택" />}
                                renderValue={(selected) =>
                                    skills.filter(s => selected.includes(s.skillId)).map(s => s.name).join(', ')
                                }
                                MenuProps={MenuProps}
                            >
                                {skills.map((skill) => (
                                    <MenuItem key={skill.skillId} value={skill.skillId}>
                                        <Checkbox checked={formData.skillIds.includes(skill.skillId)} />
                                        <ListItemText primary={`${skill.name} (${skill.category})`} />
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleDeleteGlobalSkill(e, skill.skillId)}
                                        >
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* 기술 스택 추가 */}
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                리스트에 없는 기술 추가
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <TextField
                                    size="small"
                                    placeholder="기술명"
                                    value={newSkillName}
                                    onChange={(e) => setNewSkillName(e.target.value)}
                                />
                                <Select
                                    size="small"
                                    value={newSkillCategory}
                                    onChange={(e) => setNewSkillCategory(e.target.value as Skill['category'])}
                                >
                                    {['Frontend', 'Backend', 'Database', 'DevOps', 'Other'].map(c => (
                                        <MenuItem key={c} value={c}>{c}</MenuItem>
                                    ))}
                                </Select>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={handleAddGlobalSkill}
                                >
                                    추가
                                </Button>
                            </Stack>
                        </Paper>

                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            size="large"
                            fullWidth
                            disabled={submitting}
                        >
                            {submitting ? <CircularProgress size={24} /> : (isEditMode ? "수정 완료" : "등록 완료")}
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({...snackbar, open: false})}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminProject;