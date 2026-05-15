export type GlyphKind =
  | 'hex' | 'shield' | 'layers' | 'orbit' | 'mail' | 'cal' | 'doc'
  | 'download' | 'github' | 'linkedin' | 'cost' | 'terminal' | 'gauge'
  | 'trend-down' | 'shield-check' | 'cube' | 'role' | 'edu' | 'pin'
  | 'code' | 'briefcase' | 'target' | 'link' | 'info' | 'lock' | 'eye' | 'wave';

interface GlyphProps {
  kind: GlyphKind;
  size?: number;
  color?: string;
}

export function Glyph({ kind, size = 22, color = 'currentColor' }: GlyphProps) {
  const p = { width: size, height: size, fill: 'none' as const, stroke: color, strokeWidth: 1.5 };

  if (kind === 'hex') return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" stroke={color} strokeWidth="1.6">
      <polygon points="18,3 32,11 32,25 18,33 4,25 4,11" />
      <polygon points="18,11 25,15 25,21 18,25 11,21 11,15" />
    </svg>
  );
  if (kind === 'shield') return (<svg {...p} viewBox="0 0 24 24"><path d="M12 2 L20 5 V12 C20 17 16 21 12 22 C8 21 4 17 4 12 V5 Z" /><path d="M9 12 L11 14 L15 10" strokeLinecap="round" strokeLinejoin="round" /></svg>);
  if (kind === 'layers') return (<svg {...p} viewBox="0 0 24 24"><path d="M12 3 L21 8 L12 13 L3 8 Z" /><path d="M3 12 L12 17 L21 12" /><path d="M3 16 L12 21 L21 16" /></svg>);
  if (kind === 'orbit') return (<svg {...p} viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="9" ry="4" /><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)" /><circle cx="12" cy="12" r="2" fill={color} /></svg>);
  if (kind === 'mail') return (<svg {...p} viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7 L12 13 L21 7"/></svg>);
  if (kind === 'cal') return (<svg {...p} viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9 L21 9"/><path d="M8 3 V7"/><path d="M16 3 V7"/></svg>);
  if (kind === 'doc') return (<svg {...p} viewBox="0 0 24 24"><path d="M6 3 H14 L19 8 V21 H6 Z"/><path d="M14 3 V8 H19"/></svg>);
  if (kind === 'download') return (<svg {...p} viewBox="0 0 24 24"><path d="M12 3 V15"/><path d="M7 11 L12 16 L17 11" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 19 H20"/></svg>);
  if (kind === 'github') return (<svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.6.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1 .8-.2 1.7-.3 2.5-.3s1.7.1 2.5.3c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 4-1.3 6.8-5.1 6.8-9.6C22 6.6 17.5 2 12 2z"/></svg>);
  if (kind === 'linkedin') return (<svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.3 18.3H5.7V9.7h2.6v8.6zM7 8.6c-.8 0-1.5-.7-1.5-1.5S6.2 5.6 7 5.6s1.5.7 1.5 1.5S7.8 8.6 7 8.6zm11.3 9.7h-2.6v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.3h-2.6V9.7h2.5v1.2c.4-.7 1.2-1.4 2.5-1.4 2.7 0 3.2 1.8 3.2 4.1v4.7z"/></svg>);
  if (kind === 'cost') return (<svg {...p} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9 9 C9 7.5, 10 7, 12 7 C14 7, 15 7.5, 15 9 C15 11, 9 11, 9 13 C9 14.5, 10 15, 12 15 C14 15, 15 14.5, 15 13"/><path d="M12 6 V18"/></svg>);
  if (kind === 'terminal') return (<svg {...p} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9 L10 12 L7 15"/><path d="M12 16 H17"/></svg>);
  if (kind === 'gauge') return (<svg {...p} viewBox="0 0 24 24"><path d="M3 17 A9 9 0 0 1 21 17"/><circle cx="12" cy="17" r="1.5" fill={color}/><path d="M12 17 L7 11" strokeLinecap="round"/></svg>);
  if (kind === 'trend-down') return (<svg {...p} viewBox="0 0 24 24"><path d="M3 8 L9 14 L13 10 L21 18" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 14 V18 H17"/></svg>);
  if (kind === 'shield-check') return (<svg {...p} viewBox="0 0 24 24"><path d="M12 3 L19 6 V12 C19 16 16 19 12 21 C8 19 5 16 5 12 V6 Z"/><path d="M9 12 L11 14 L15 10" strokeLinecap="round" strokeLinejoin="round"/></svg>);
  if (kind === 'cube') return (<svg {...p} viewBox="0 0 24 24"><path d="M12 3 L21 8 V16 L12 21 L3 16 V8 Z"/><path d="M12 3 V12"/><path d="M3 8 L12 12 L21 8"/></svg>);
  if (kind === 'role') return (<svg {...p} viewBox="0 0 24 24"><circle cx="12" cy="9" r="4"/><path d="M4 21 C4 16 8 14 12 14 C16 14 20 16 20 21"/></svg>);
  if (kind === 'edu') return (<svg {...p} viewBox="0 0 24 24"><path d="M2 9 L12 4 L22 9 L12 14 Z"/><path d="M6 11 V17 C6 19 9 20 12 20 C15 20 18 19 18 17 V11"/></svg>);
  if (kind === 'pin') return (<svg {...p} viewBox="0 0 24 24"><path d="M12 21 C12 21 19 15 19 10 A7 7 0 0 0 5 10 C5 15 12 21 12 21 Z"/><circle cx="12" cy="10" r="2.5"/></svg>);
  if (kind === 'code') return (<svg {...p} viewBox="0 0 24 24"><path d="M8 7 L3 12 L8 17"/><path d="M16 7 L21 12 L16 17"/><path d="M14 5 L10 19"/></svg>);
  if (kind === 'briefcase') return (<svg {...p} viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7 V5 A1 1 0 0 1 10 4 H14 A1 1 0 0 1 15 5 V7"/></svg>);
  if (kind === 'target') return (<svg {...p} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill={color}/></svg>);
  if (kind === 'link') return (<svg {...p} viewBox="0 0 24 24"><path d="M10 14 A4 4 0 0 1 10 8 L13 5 A4 4 0 0 1 19 11 L17 13"/><path d="M14 10 A4 4 0 0 1 14 16 L11 19 A4 4 0 0 1 5 13 L7 11"/></svg>);
  if (kind === 'info') return (<svg {...p} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11 V17"/><circle cx="12" cy="8" r="1" fill={color}/></svg>);
  if (kind === 'lock') return (<svg {...p} viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11 V8 A4 4 0 0 1 16 8 V11"/></svg>);
  if (kind === 'eye') return (<svg {...p} viewBox="0 0 24 24"><path d="M2 12 C5 7 8 5 12 5 C16 5 19 7 22 12 C19 17 16 19 12 19 C8 19 5 17 2 12 Z"/><circle cx="12" cy="12" r="3"/></svg>);
  if (kind === 'wave') return (<svg {...p} viewBox="0 0 24 24"><path d="M3 12 L7 12 L9 7 L13 17 L15 12 L21 12" strokeLinecap="round" strokeLinejoin="round"/></svg>);
  return null;
}
