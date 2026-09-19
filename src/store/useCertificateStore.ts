import { create } from 'zustand';

export interface CertificateData {
  salutation: string;
  studentName: string;
  collegeName: string;
  university: string;
  rollNumber: string;
  registrationId: string;
  certificateId: string;
  domain: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  grade: string;
  mentorName: string;
  remarks: string;
  skills: string;
}

interface CertificateStore {
  data: CertificateData;
  updateData: (newData: Partial<CertificateData>) => void;
}

const defaultData: CertificateData = {
  salutation: "Mr.",
  studentName: "Prince Kumar",
  collegeName: "KIIT University Bhubaneswar",
  university: "KIIT University Bhubaneswar",
  rollNumber: "",
  registrationId: "VCT-2026-894211",
  certificateId: "VCT-CERT-2026-921",
  domain: "Consulting Analyst / Business Analyst",
  startDate: "2026-06-01",
  endDate: "2026-08-31",
  issueDate: "2026-08-31",
  grade: "A+",
  mentorName: "Rehan Suman",
  remarks: "They have worked on a live project and assisted the technical team in developing core modules, displaying strong analytical and problem-solving skills.",
  skills: "Business Analysis, Consulting, Project Management, Data Analytics, Strategic Planning",
};

export const useCertificateStore = create<CertificateStore>((set) => ({
  data: defaultData,
  updateData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
}));
