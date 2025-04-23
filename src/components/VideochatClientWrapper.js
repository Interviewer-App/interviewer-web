'use client';
import dynamic from "next/dynamic";

const Videochat = dynamic(() => import("@/components/Videochat"), { ssr: false });

export default function VideochatClientWrapper({ slug, JWT }) {
    return (
        <Videochat session={slug} jwt={JWT} />
    );
} 