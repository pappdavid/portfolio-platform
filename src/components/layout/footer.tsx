import Link from 'next/link';

const footerLinks = [
  { title: 'Privacy', href: '/privacy-policy' },
  { title: 'Terms', href: '/terms-of-service' },
  { title: 'Security', href: '/security' },
  { title: 'About', href: '/about' }
];

const socialLinks = [
  { title: 'GitHub', href: 'https://github.com/pappdavid' },
  { title: 'LinkedIn', href: 'https://linkedin.com/in/d%C3%A1vid-papp' }
];

export function Footer() {
  return (
    <footer className='border-t border-white/[0.07] bg-[#060608]'>
      <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row'>
        <p className='font-mono text-xs text-[#3f3f46]'>
          &copy; {new Date().getFullYear()} David Papp
        </p>
        <nav className='flex items-center gap-5'>
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='text-xs text-[#52525b] transition-colors hover:text-white'
            >
              {link.title}
            </Link>
          ))}
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target='_blank'
              rel='noopener noreferrer'
              className='font-mono text-xs text-[#52525b] transition-colors hover:text-[#22c55e]'
            >
              {link.title} ↗
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
