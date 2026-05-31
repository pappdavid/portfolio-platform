export const amaCorpus: string = `
# About David Papp
AI engineer building production-grade tools for teams that ship LLM products. Focus areas: agent observability, guard rails, fine-tuning pipelines, and retrieval systems. Previously led three product launches end-to-end. Values: cost discipline, security by default, shipping the simplest thing that works.

Open to: junior AI / automation engineer, full-stack AI, and data science roles in the Netherlands.
Contact: contact@davidpapp.dev | Book a call: https://calendly.com/david-webinform/30min
LinkedIn: https://www.linkedin.com/in/d%C3%A1vid-papp | GitHub: https://github.com/pappdavid

# MCP Sentinel
A proxy layer for Model Context Protocol (MCP) that logs, guards, and audits every agent tool call in real time. Sits between AI agents and their tools. Validates inputs against guard rules: injection detection, PII scanning, cost limits. Logs every event to Supabase with RLS. Surfaces anomalies in a real-time dashboard. Built with TypeScript, Next.js, Supabase, Upstash, and Clerk auth. Demo available at /mcp or /dashboard/mcp.

# Custom Training Pipeline
Automated pipeline to convert codebases into fine-tuning datasets. Parses Git repositories, chunks code by semantic boundaries, generates instruction-response pairs using configurable prompt templates. Output is OpenAI-compatible JSONL for LoRA fine-tuning. Includes validation, deduplication, and quality scoring. Built with Python, Next.js, and Supabase. Demo at /training or /dashboard/training.

# RAG + 3D Chat
Retrieval-augmented generation chat interface with a 3D scene renderer powered by Thesys C1. Upload documents or paste repo URLs, ask questions, get answers grounded in your content. C1 generates both text and structured 3D scene descriptions. Built with Next.js, OpenAI, Thesys C1, and Supabase. Demo at /chat.

# Tech Stack
TypeScript, Python, Next.js 16, React 19, Supabase (PostgreSQL + RLS), Clerk (auth), Upstash (rate limiting), Thesys C1 (generative UI), OpenAI API, Tailwind CSS v4, Vercel, Node.js.

# Projects
Four main portfolio projects: MCP Sentinel (agent observability), Custom Training Pipeline (fine-tuning automation), RAG + 3D Chat (retrieval + generative UI), and this Portfolio Platform itself. Each has a live demo and open-source code. See /projects for case studies.

# What David Builds
Agent infrastructure: observability layers, guard rails, audit pipelines. Fine-tuning automation: dataset generation, LoRA adapter training. RAG systems: vector search, chunking, retrieval pipelines. Full-stack AI platforms: Next.js frontends, Supabase backends, streaming APIs.
`;
