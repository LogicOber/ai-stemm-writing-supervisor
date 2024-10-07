import React, { useState, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const XMLRenderer = ({ children }) => {
  const [tagCounter] = useState({});

  const renderXMLTag = useCallback((tag, content, index) => {
    const tagNumber = (tagCounter[tag] = (tagCounter[tag] || 0) + 1);
    const nestedContent = renderContent(content);

    let backgroundColor;
    switch (tag) {
      case 'original_text':
        backgroundColor = '#f1c40f';
        break;
      case 'corrected_text':
        backgroundColor = '#2ecc71';
        break;
      case 'explanation':
        backgroundColor = '#3498db';
        break;
      case 'paragraph_analysis':
        backgroundColor = '#2c3e50';
        break;
      case 'STEMM_Writing':
        backgroundColor = '#8e44ad';
        break;
      default:
        backgroundColor = '#95a5a6';
    }

    return (
      <div key={index} className={`xml-tag ${tag}`} style={{ marginBottom: '1rem' }}>
        <div className="xml-tag-header" style={{ backgroundColor, color: '#fff', padding: '0.5rem 1rem' }}>
          {tag} #{tagNumber}
        </div>
        <div className="xml-tag-content" style={{ backgroundColor: '#fff', padding: '1rem', border: '1px solid #e0e0e0', borderTop: 'none' }}>
          {nestedContent}
        </div>
      </div>
    );
  }, [tagCounter]);

  const renderContent = useCallback((text) => {
    const xmlRegex = /<(\w+)>([\s\S]*?)<\/\1>/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = xmlRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <ReactMarkdown 
            key={`md-${lastIndex}`} 
            rehypePlugins={[rehypeRaw]}
            className="markdown-content"
          >
            {text.slice(lastIndex, match.index)}
          </ReactMarkdown>
        );
      }
      parts.push(renderXMLTag(match[1], match[2], match.index));
      lastIndex = xmlRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(
        <ReactMarkdown 
          key={`md-${lastIndex}`} 
          rehypePlugins={[rehypeRaw]}
          className="markdown-content"
        >
          {text.slice(lastIndex)}
        </ReactMarkdown>
      );
    }

    return parts;
  }, [renderXMLTag]);

  const renderedContent = useMemo(() => renderContent(children), [children, renderContent]);

  return <div className="xml-renderer">{renderedContent}</div>;
};

export default XMLRenderer;