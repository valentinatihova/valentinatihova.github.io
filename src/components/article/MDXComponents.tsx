import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import apex from 'react-syntax-highlighter/dist/esm/languages/prism/apex';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Terminal, AlertCircle } from 'lucide-react';
import { getTextContent, slugify } from '../../lib/text';
import { Callout } from './Callout';
import { KeyMetric, KeyMetrics } from './KeyMetric';
import { Architecture, ArchitectureNode, ArchitectureEdge, ArchitectureStep } from './Architecture';

SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('apex', apex);

/**
 * Anchorable heading — assigns a deterministic slug id so the TOC can link
 * into the section and scroll-spy can highlight it. Respects an explicit
 * `id` prop if the author already wrote one.
 *
 * Pound-anchor (#) is rendered visible on hover to signal shareable links,
 * matching P37 (structured-reading).
 */
function AnchoredHeading({
  level,
  children,
  id: explicitId,
  className,
  ...rest
}: {
  level: 1 | 2 | 3;
  children?: React.ReactNode;
  id?: string;
  className: string;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
  const text = getTextContent(children);
  const id = explicitId ?? (text ? slugify(text) : undefined);
  return (
    <Tag id={id} className={`${className} group scroll-mt-24`} {...rest}>
      {children}
      {id && (
        <a
          href={`#${id}`}
          aria-label={`Link to "${text}"`}
          className="ml-3 font-mono text-[0.7em] font-normal text-stone-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-accent focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          #
        </a>
      )}
    </Tag>
  );
}

export const MDXComponents = {
  h1: (props: any) => (
    <AnchoredHeading
      level={1}
      className="mt-14 mb-5 border-b border-stone-200 pb-3 text-[1.875rem] font-bold tracking-[-0.015em] text-stone-900 md:text-[2.25rem]"
      {...props}
    />
  ),
  h2: (props: any) => (
    <AnchoredHeading
      level={2}
      className="mt-14 mb-5 border-b border-stone-200 pb-3 text-[1.875rem] font-bold tracking-[-0.015em] text-stone-900 md:text-[2.25rem]"
      {...props}
    />
  ),
  h3: (props: any) => (
    <AnchoredHeading
      level={3}
      className="mt-10 mb-4 text-[1.25rem] font-semibold tracking-normal text-stone-800 md:text-[1.5rem]"
      {...props}
    />
  ),
  p: (props: any) => <p className="mb-6 max-w-[65ch] text-[1.0625rem] leading-[1.7] text-stone-600 md:text-[1.125rem]" {...props} />,
  ul: (props: any) => <ul className="mb-6 max-w-[65ch] list-disc pl-6 text-[1.0625rem] leading-[1.7] text-stone-600 md:text-[1.125rem]" {...props} />,
  ol: (props: any) => <ol className="mb-6 max-w-[65ch] list-decimal pl-6 text-[1.0625rem] leading-[1.7] text-stone-600 md:text-[1.125rem]" {...props} />,
  li: (props: any) => <li className="mb-2 pl-1" {...props} />,
  a: (props: any) => <a className="text-accent underline decoration-accent/35 underline-offset-4 transition-colors hover:text-accent/80" {...props} />,
  img: (props: any) => (
    <span className="block my-10 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 p-2">
      <img className="mx-auto h-auto max-w-full rounded-[1rem] border border-stone-100" {...props} />
    </span>
  ),
  pre: (props: any) => {
    // Extract the code element from pre's children
    let codeElement: any = null;
    if (React.isValidElement(props.children)) {
      codeElement = props.children;
    } else if (Array.isArray(props.children) && props.children.length > 0 && React.isValidElement(props.children[0])) {
      codeElement = props.children[0];
    }
    
    // Check if we have a child with props (which would be our code component)
    if (codeElement && codeElement.props) {
      const childProps = codeElement.props as any;
      const className = childProps.className || '';
      const match = /language-(\w+)/.exec(className);
      
      // If it has a language class OR it's a multi-line string, treat it as a code block
      if (match || (typeof childProps.children === 'string' && childProps.children.includes('\n'))) {
        const lang = match ? match[1] : 'text';
        let codeString = String(childProps.children || '').replace(/\n$/, '');
        
        // Remove wrapping backticks if they exist
        if (codeString.startsWith('`') && codeString.endsWith('`')) {
          codeString = codeString.substring(1, codeString.length - 1);
        }
        
        if (lang === 'output' || lang === 'error') {
          const isError = lang === 'error';
          return (
            <div className={`group relative my-6 overflow-hidden rounded-xl border ${isError ? 'border-accent/50 bg-stone-900' : 'border-stone-700 bg-stone-800'} p-5 shadow-sm transition-colors duration-300`}>
              <div className={`text-xs font-mono uppercase tracking-wider mb-3 font-semibold flex items-center gap-2 ${isError ? 'text-accent' : 'text-stone-400'}`}>
                {isError ? <AlertCircle className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
                {isError ? 'ERROR' : 'OUTPUT'}
              </div>
              <pre className="text-stone-100 font-mono text-sm overflow-x-auto whitespace-pre m-0 p-0 bg-transparent border-none pb-2 custom-scrollbar">
                {codeString}
              </pre>
            </div>
          );
        }
        
        return (
          <div className="group my-10 overflow-hidden rounded-xl border border-stone-700 bg-[#292524] shadow-sm transition-all duration-300 hover:border-stone-600 hover:shadow-md">
            {/* macOS Style Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-stone-900 border-b border-stone-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50"></div>
              </div>
              <div className="text-xs font-mono text-stone-400 uppercase tracking-wider font-semibold transition-colors group-hover:text-stone-200">
                {lang}
              </div>
            </div>
            
            {/* Code Content */}
            <SyntaxHighlighter
              style={vscDarkPlus as any}
              language={lang === 'text' ? 'bash' : lang}
              PreTag="div"
              customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '0.875rem' }}
            >
              {codeString}
            </SyntaxHighlighter>
          </div>
        );
      }
    }
    
    // Fallback if it's not a standard code block
    return <pre className="custom-scrollbar my-8 overflow-x-auto rounded-xl border border-stone-700 bg-stone-800 p-5 text-sm text-stone-100 font-mono" {...props} />;
  },
  code: (props: any) => {
    // Only style inline code here. Block code is handled by pre.
    return <code className="rounded border border-stone-200 bg-stone-100 px-1.5 py-0.5 font-mono text-[0.9em] text-stone-800" {...props} />;
  },

  // --- Editorial primitives available inside any .mdx file -----------------
  // (imports for these live at the top of this file; re-exposing by name
  //  is what lets <Callout>, <Architecture>, etc. be used directly in MDX)
  Callout,
  KeyMetric,
  KeyMetrics,
  Architecture,
  ArchitectureStep,
  ArchitectureNode,
  ArchitectureEdge,
};
