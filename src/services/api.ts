import axios, { type AxiosResponse } from 'axios';
import type { Project, ProjectRequest, Skill, ContactRequest } from '../types';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const projectService = {
    getAll: (): Promise<AxiosResponse<Project[]>> => api.get<Project[]>('/projects'),

    // 단일 프로젝트 조회
    getById: (id: number): Promise<AxiosResponse<Project>> =>
        api.get<Project>(`/projects/${id}`),

    // 관리자 전용 프로젝트 등록
    create: (data: ProjectRequest): Promise<AxiosResponse<Project>> =>
        api.post<Project>('/projects/admin', data),
};

export const skillService = {
    // 기술 스택 조회
    getAll: (): Promise<AxiosResponse<Skill[]>> => api.get<Skill[]>('/skills'),
};

export const contactService = {
    // 연락처 메시지 전송
    send: (data: ContactRequest): Promise<AxiosResponse<string>> => api.post<string>('/contacts', data),
};

export default api;