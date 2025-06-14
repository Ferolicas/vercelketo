// components/Comments.tsx
import { useEffect } from 'react';

declare global {
  interface Window {
    DISQUS?: unknown;
    disqus_config?: () => void;
  }
}

interface CommentsProps {
  pageUrl: string;
  pageIdentifier: string;
}

const DISQUS_SHORTNAME = 'planeta-keto'; // Cambia por tu shortname real

export default function Comments({ pageUrl, pageIdentifier }: CommentsProps) {
  useEffect(() => {
    const disqusThread = document.getElementById('disqus_thread');
    if (disqusThread) disqusThread.innerHTML = '';

    window.disqus_config = function () {
      // @ts-expect-error: Disqus espera que this sea el objeto de configuración
      this.page.url = pageUrl;
      // @ts-expect-error: Disqus espera que this sea el objeto de configuración
      this.page.identifier = pageIdentifier;
    };

    const script = document.createElement('script');
    script.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
    script.setAttribute('data-timestamp', Date.now().toString());
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      delete window.DISQUS;
      delete window.disqus_config;
    };
  }, [pageUrl, pageIdentifier]);

  return (
    <div className="disqus-container mt-8">
      <div id="disqus_thread" />
      <noscript>
        Please enable JavaScript to view the{' '}
        <a
          href="https://disqus.com/?ref_noscript"
          rel="noopener noreferrer"
          target="_blank"
        >
          comments powered by Disqus.
        </a>
      </noscript>
    </div>
  );
}