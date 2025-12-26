// 1. 프로젝트 상세 정보 타입
export interface Project {
    projectId: number;
    title: string;
    description: string;
    githubUrl?: string; // Optional (없을 수도 있음)
    demoUrl?: string;
    thumbnailUrl?: string;
    // 프로젝트에 사용된 기술 스택 (필요시 추가)
    skills?: Skill[];
}

// 2. 기술 스택 타입
export interface Skill {
    skillId: number;
    name: string;
    category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Other';
    iconUrl?: string;
}

// 3. 연락처 전송 데이터 타입
export interface ContactRequest {
    senderName: string;
    email: string;
    subject: string;
    message: string;
}