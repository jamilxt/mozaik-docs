import { useEffect, useId, useState } from 'react';

type MermaidProps = {
  chart: string;
};

function resolveTheme(): 'dark' | 'default' {
  if (typeof document === 'undefined') return 'default';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'default';
}

export function Mermaid({ chart }: MermaidProps) {
  const idBase = useId().replace(/[:]/g, '');
  const renderId = `mermaid-${idBase}`;
  const [svg, setSvg] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'default'>('default');

  useEffect(() => {
    setTheme(resolveTheme());

    if (typeof window === 'undefined') return;

    const observer = new MutationObserver(() => {
      setTheme(resolveTheme());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const mermaidModule = await import('mermaid');
      const mermaid = mermaidModule.default;

      mermaid.initialize({
        startOnLoad: false,
        theme,
        securityLevel: 'loose',
        fontFamily: 'inherit',
      });

      try {
        const { svg: rendered } = await mermaid.render(
          `${renderId}-${theme}`,
          chart,
        );
        if (!cancelled) setSvg(rendered);
      } catch (error) {
        if (!cancelled) {
          console.error('Mermaid render failed:', error);
          setSvg(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, theme, renderId]);

  if (!svg) {
    return (
      <pre className="not-prose my-6 overflow-auto rounded-lg border bg-fd-card p-4 text-xs text-fd-muted-foreground">
        <code>{chart}</code>
      </pre>
    );
  }

  return (
    <div
      className="not-prose my-6 flex justify-center overflow-auto rounded-lg border bg-fd-card p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
