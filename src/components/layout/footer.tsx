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
    <footer className='border-border/40 border-t'>
      <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row'>
        <p className='text-muted-foreground text-sm'>
          &copy; {new Date().getFullYear()} David Papp. Built with Next.js &
          shadcn/ui.
        </p>
        <nav className='flex items-center gap-4'>
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='text-muted-foreground hover:text-foreground text-sm transition-colors'
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
              className='text-muted-foreground hover:text-foreground text-sm transition-colors'
            >
              {link.title}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
