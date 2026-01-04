import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Button, Chip, Stack,
    Card, CardMedia, CircularProgress, Divider, Paper
} from '@mui/material';
import { ArrowBack, GitHub, OpenInNew } from '@mui/icons-material';
import { projectService } from '../services/api.ts';
import type { Project } from '../types';

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        projectService.getById(Number(id))
            .then(res => setProject(res.data))
            .catch(err => {
                console.error("프로젝트 로딩 실패:", err);
                setError("프로젝트를 불러오는데 실패했습니다.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress color="secondary" />
        </Box>
    );

    if (error || !project) return (
        <Container sx={{ py: 10, textAlign: 'center' }}>
            <Typography variant="h5" color="error" gutterBottom>
                {error || "프로젝트를 찾을 수 없습니다."}
            </Typography>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/projects')}
                sx={{ mt: 3 }}
            >
                목록으로 돌아가기
            </Button>
        </Container>
    );

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            {/* 뒤로가기 버튼 */}
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/projects')}
                sx={{ mb: 4, color: 'text.secondary' }}
            >
                목록으로
            </Button>

            {/* 프로젝트 제목 */}
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
                {project.title}
            </Typography>

            {/* 기간 및 인원 */}
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {project.period} | {project.teamSize}
            </Typography>

            {/* 기술 스택 */}
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 4 }}>
                {project.skills?.map((skillName) => (
                    <Chip
                        key={skillName}
                        label={skillName}
                        sx={{
                            bgcolor: 'rgba(13, 148, 136, 0.1)',
                            color: 'secondary.main',
                            fontWeight: 'bold',
                            borderRadius: 1
                        }}
                    />
                ))}
            </Stack>

            {/* 썸네일 이미지 */}
            {project.thumbnailUrl && (
                <Card sx={{ mb: 6, borderRadius: 2, overflow: 'hidden' }}>
                    <CardMedia
                        component="img"
                        image={project.thumbnailUrl}
                        alt={project.title}
                        sx={{ width: '100%', height: 'auto', maxHeight: 500, objectFit: 'cover' }}
                    />
                </Card>
            )}

            {/* 프로젝트 개요 */}
            <Paper elevation={0} sx={{ p: 4, mb: 6, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
                    프로젝트 개요
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {project.description}
                </Typography>
            </Paper>

            {/* 상세 내용 */}
            <Paper elevation={0} sx={{ p: 4, mb: 6, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', mb: 3 }}>
                    주요 기능 및 구현 내용
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: 1.8
                    }}
                >
                    {project.content}
                </Typography>
            </Paper>

            {/* ERD 다이어그램 */}
            {project.erdImageUrl && (
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', mb: 3 }}>
                        ERD 다이어그램
                    </Typography>
                    <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <CardMedia
                            component="img"
                            image={project.erdImageUrl}
                            alt="ERD Diagram"
                            sx={{ width: '100%', height: 'auto' }}
                        />
                    </Card>
                </Box>
            )}

            {/* 아키텍처 */}
            {project.architectureImageUrl && (
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', mb: 3 }}>
                        기술 아키텍처
                    </Typography>
                    <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <CardMedia
                            component="img"
                            image={project.architectureImageUrl}
                            alt="Architecture Diagram"
                            sx={{ width: '100%', height: 'auto' }}
                        />
                    </Card>
                </Box>
            )}

            <Divider sx={{ my: 6, bgcolor: 'rgba(255,255,255,0.1)' }} />

            {/* 링크 버튼 */}
            <Stack direction="row" spacing={2} justifyContent="center">
                {project.githubUrl && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<GitHub />}
                        href={project.githubUrl}
                        target="_blank"
                        sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
                    >
                        GitHub 보기
                    </Button>
                )}
                {project.demoUrl && (
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<OpenInNew />}
                        href={project.demoUrl}
                        target="_blank"
                        sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
                    >
                        데모 사이트
                    </Button>
                )}
            </Stack>
        </Container>
    );
};

export default ProjectDetail;