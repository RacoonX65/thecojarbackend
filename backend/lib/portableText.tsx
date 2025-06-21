import React from 'react';
import { PortableText } from '@portabletext/react';

// ============================================================================
// PORTABLE TEXT COMPONENTS FOR REACT
// ============================================================================

/**
 * Portable Text components for rendering rich text in React
 */
export const portableTextComponents = {
  types: {
    image: ({ value }: any) => (
      <img
        src={value.asset?.url}
        alt={value.alt || ''}
        className="max-w-full h-auto"
      />
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a href={value.href} className="text-blue-600 hover:text-blue-800 underline">
        {children}
      </a>
    ),
  },
};

/**
 * Render portable text in React components
 */
export const renderPortableText = (content: any) => {
  if (!content) return null;
  return <PortableText value={content} components={portableTextComponents} />;
};

/**
 * Portable Text component for use in React
 */
export const PortableTextRenderer: React.FC<{ content: any }> = ({ content }) => {
  return renderPortableText(content);
}; 