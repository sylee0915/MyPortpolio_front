// src/types/index.ts

export interface Skill {
    skillId: number;
    name: string;
    category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Other';
    iconUrl?: string;
}

export interface Project {
    projectId?: number;          // 생성 시에는 없을 수 있으므로 Optional
    title: string;
    description: string;         // 프로젝트 개요
    period: string;              // 제작 기간
    teamSize: string;            // 제작 인원
    content: string;             // 상세 내용 (마크다운 등을 고려할 수 있음)
    githubUrl?: string;
    demoUrl?: string;            // 배포 사이트 주소
    thumbnailUrl?: string;
    erdImageUrl?: string;        // ERD 다이어그램
    architectureImageUrl?: string; // 기술 아키텍처
    skills: string[];            // 이름 리스트로 받기로 했으므로 string[]
}

// 등록 요청을 위한 별도의 타입
export interface ProjectRequest {
    title: string;
    description: string;
    period: string;
    teamSize: string;
    content: string;
    githubUrl: string;
    demoUrl: string;
    thumbnailUrl: string;
    erdImageUrl: string;
    architectureImageUrl: string;
    skillIds: number[];          // 백엔드에서 ID 리스트를 받으므로 number[]
}
// 3. 연락처 전송 데이터 타입
export interface ContactRequest {
    senderName: string;
    email: string;
    subject: string;
    message: string;
}

export interface SiteConfig {
    mainTitle: string;
    subTitle: string;
    mainColor: string;
    subColor: string;
}