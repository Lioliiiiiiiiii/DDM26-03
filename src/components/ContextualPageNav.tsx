type ContextualPageNavProps = {
  links: Array<{ label: string; href: string }>;
};

export function ContextualPageNav({ links }: ContextualPageNavProps) {
  return (
    <nav className="sticky top-16 z-30 overflow-x-auto rounded-xl border border-white/10 bg-slate-900/75 p-2 backdrop-blur">
      <ul className="flex min-w-max items-center gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="inline-flex rounded-lg px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-300 transition hover:bg-white/10 hover:text-orange-200"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
