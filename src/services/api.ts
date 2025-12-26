import axios, {type AxiosResponse } from 'axios';
import type {Project, ContactRequest, Skill} from '../types';

// API 기본 설정
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const projectService = {
    // 프로젝트 목록 조회 (응답 데이터가 Project 배열임을 명시)
    getAll: (): Promise<AxiosResponse<Project[]>> => api.get<Project[]>('/projects'),
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