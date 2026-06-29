import mentorsJson from "./mentors.json";

export interface MentorProfile {
  id: string;
  years: number;
  headline: string;
  bio: string;
  tags: string[];
  sampleReply: string;
}

export interface MentorSegment {
  id: string;
  num: string;
  title: string;
  blurb: string;
  mentors: MentorProfile[];
}

export const MENTOR_SEGMENTS: MentorSegment[] = mentorsJson as MentorSegment[];
export const MENTOR_COUNT = MENTOR_SEGMENTS.reduce((n, s) => n + s.mentors.length, 0);
