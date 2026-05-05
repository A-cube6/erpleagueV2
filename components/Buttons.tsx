import Link from 'next/link';

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  download?: boolean;
};

export function ButtonLink({ href, children, variant = 'primary', download }: ButtonLinkProps) {
  const className = variant === 'secondary' ? 'btn btn-secondary' : variant === 'outline' ? 'btn btn-outline' : 'btn btn-primary';
  return (
    <Link className={className} href={href} download={download}>
      {children}
    </Link>
  );
}
