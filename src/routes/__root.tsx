import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import * as React from 'react';
import appCss from '../styles/app.css?inline';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'dark';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

function NotFound() {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
			<h1 className="text-2xl font-bold">Page not found</h1>
			<a href="/" className="text-highlight hover:underline">
				Go home
			</a>
		</div>
	)
}

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'Mozaik AI Docs',
			},
		],
		links: [],
	}),
	notFoundComponent: NotFound,
	shellComponent: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: appCss }} />
      </head>
      <body>
        <RootProvider theme={{ defaultTheme: 'dark' }}>
          <Outlet />
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}
