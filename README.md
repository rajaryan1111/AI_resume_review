# AI Resume Review

[![CI](https://github.com/rajaryan1111/AI_resume_review/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/rajaryan1111/AI_resume_review/actions/workflows/ci.yml)

AI-assisted resume and job-description analysis interface that compares candidate information against a target role and surfaces skills, gaps, diagnostics, and a visual skill graph.

## Features
- Resume and job-description text or PDF input
- Optional target-role hint
- Multipart request to the analysis API
- Skill-gap analysis and visual skill graph
- Environment-based backend URL configuration

## Architecture
```text
Resume / Job Description
        ↓
React + Vite frontend
        ↓
Analysis API
        ↓
Extraction → skill analysis → gap analysis
        ↓
Results + skill graph
```

## Tech stack
React · Vite · Tailwind CSS · React Flow · Recharts · Framer Motion

## Run locally
```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` to your running analysis backend.

## Repository hygiene
Local dependency folders, Python virtual environments, OS files, secrets, and generated test output are excluded from version control. Do not commit resumes, job descriptions containing personal data, API keys, or local environments.

## Status
Hackathon/portfolio project under active development.
