import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Card, CardContent, CardMedia,
    Button, Box, CircularProgress, Chip, Stack, Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { projectService } from '../services/api';
import type { Project } from '../types';

const ProjectList: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // 백엔드 API에서 프로젝트 목록을 가져옵니다.
        projectService.getAll()
            .then(res => setProjects(res.data))
            .catch(err => console.error("데이터 로딩 실패:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress color="secondary" />
        </Box>
    );

    return (
        <Container sx={{ py: 10 }} maxWidth="md">
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 800, mb: 8, color: 'text.primary' }}>
                PROJECTS
            </Typography>

            {/* Grid 대신 Stack을 사용하여 세로로 나열합니다. */}
            <Stack spacing={10}>
                {projects.map((project) => (
                    <Box key={project.projectId}>
                        <Card sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' }, // 모바일은 세로, 데스크탑은 가로
                            bgcolor: 'transparent',
                            backgroundImage: 'none',
                            boxShadow: 'none',
                            gap: 4
                        }}>
                            {/* 프로젝트 썸네일 */}
                            <CardMedia
                                component="img"
                                sx={{
                                    width: { xs: '100%', md: 400 },
                                    height: 250,
                                    borderRadius: 2,
                                    objectFit: 'cover'
                                }}
                                image={project.thumbnailUrl || 'https://via.placeholder.com/400x250'}
                                alt={project.title}
                            />

                            <CardContent sx={{ flex: 1, p: 0, display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="caption" color="secondary" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {project.period} | {project.teamSize}
                                </Typography>

                                <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                    {project.title}
                                </Typography>

                                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                                    {project.description}
                                </Typography>

                                {/* 기술 스택 칩 나열 */}
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 4 }}>
                                    {project.skills?.map((skillName) => (
                                        <Chip
                                            key={skillName}
                                            label={skillName}
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(13, 148, 136, 0.1)',
                                                color: 'secondary.main',
                                                fontWeight: 'bold',
                                                borderRadius: 1
                                            }}
                                        />
                                    ))}
                                </Stack>

                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        component={RouterLink}
                                        to={`/projects/${project.projectId}`} // 상세 페이지 연결
                                        sx={{ fontWeight: 'bold', px: 3 }}
                                    >
                                        상세 보기
                                    </Button>
                                    {project.githubUrl && (
                                        <Button
                                            href={project.githubUrl}
                                            target="_blank"
                                            sx={{ color: 'text.primary', fontWeight: 'bold' }}
                                        >
                                            GitHub
                                        </Button>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                        <Divider sx={{ mt: 10, bgcolor: 'rgba(255,255,255,0.1)' }} />
                    </Box>
                ))}
            </Stack>

            {projects.length === 0 && (
                <Typography variant="h6" sx={{ textAlign: 'center', mt: 10, color: 'text.secondary' }}>
                    등록된 프로젝트가 없습니다. 관리자 페이지에서 프로젝트를 추가해 주세요!
                </Typography>
            )}
        </Container>
    );
};

export default ProjectList;