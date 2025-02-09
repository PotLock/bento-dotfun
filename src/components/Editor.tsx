'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
// @ts-ignore
import marked from 'marked';

interface EditorProps {
  initialValue?: string;
  initialTitle?: string;
  initialIsPrivate?: boolean;
  supportEmoji?: boolean;
  walletAddress?: string;
  readOnly?: boolean;
  onSave: (title: string, content: string, htmlContent: string, isPrivate: boolean) => void;
}

export default function Editor({ 
  initialValue = '', 
  initialTitle = '', 
  initialIsPrivate = false,
  supportEmoji = true, 
  walletAddress,
  readOnly = false,
  onSave 
}: EditorProps) {
  const [markdown, setMarkdown] = useState(initialValue);
  const [html, setHtml] = useState('');
  const [title, setTitle] = useState(initialTitle);
  const [isPrivate, setIsPrivate] = useState(initialIsPrivate);
  const editorRef = useRef<HTMLDivElement>(null);

  const parseMarkdown = async (text: string): Promise<string> => {
    // Process AI Generation first, before any other markdown processing
    const processAIGeneration = async (text: string, isEmoji: boolean = false): Promise<string> => {
      const textPattern = isEmoji ?
        /~🤖\s*\[([^\]]+)\]\s*\("([^"]+)"\)/g :
        /~ai\[([^\]]+)\]\s*\("([^"]+)"\)/g;
      
      const imagePattern = isEmoji ?
        /~🤖🖼️\s*\[([^\]]+)\]\s*\("([^"]+)"\)/g :
        /~ai-img\[([^\]]+)\]\s*\("([^"]+)"\)/g;

      const voicePattern = isEmoji ?
        /~🤖🔈\s*\[([^\]]+)\]\s*\("([^"]+)"\)/g :
        /~ai-voice\[([^\]]+)\]\s*\("([^"]+)"\)/g;

      const videoPattern = isEmoji ?
        /~🤖🎬\s*\[([^\]]+)\]\s*\("([^"]+)"\)/g :
        /~ai-video\[([^\]]+)\]\s*\("([^"]+)"\)/g;

      // Helper function to find all matches
      const findMatches = (pattern: RegExp, text: string): Array<RegExpExecArray> => {
        const matches: Array<RegExpExecArray> = [];
        let match: RegExpExecArray | null;
        pattern.lastIndex = 0; // Reset lastIndex
        
        while ((match = pattern.exec(text)) !== null) {
          matches.push(match);
        }
        
        return matches;
      };

      // Find all matches
      const matches = [
        ...findMatches(textPattern, text),
        ...findMatches(imagePattern, text),
        ...findMatches(voicePattern, text),
        ...findMatches(videoPattern, text)
      ];

      let result = text;
      
      // Process each match
      for (const match of matches) {
        const [fullMatch, botName, prompt] = match;
        const type = fullMatch.includes('~ai-img') || fullMatch.includes('🖼️') ? 'image' :
                    fullMatch.includes('~ai-voice') || fullMatch.includes('🔈') ? 'voice' :
                    fullMatch.includes('~ai-video') || fullMatch.includes('🎬') ? 'video' : 'text';

        // Create a unique ID for this request
        const requestId = Math.random().toString(36).substring(7);
        
        // Show loading state immediately with unique ID
        const loadingMessage = `<div class="ai-loading" id="ai-loading-${requestId}">${botName} is thinking...</div>`;
        result = result.replace(fullMatch, loadingMessage);
        
        // Update HTML immediately to show loading state
        setHtml(result);

        try {
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, bot: botName, prompt })
          });

          if (!response.ok) throw new Error(response.statusText);
          const data = await response.json();

          let replacement = '';
          switch (type) {
            case 'text':
              replacement = data.content || '';
              break;
            case 'image':
              replacement = `<img src="${data.url}" alt="${prompt}">`;
              break;
            case 'voice':
              replacement = `<audio controls><source src="${data.url}" type="audio/mpeg">Your browser does not support the audio element.</audio>`;
              break;
            case 'video':
              replacement = `<video controls><source src="${data.url}" type="video/mp4">Your browser does not support the video element.</video>`;
              break;
          }

          // Replace the loading message with the actual content
          result = result.replace(loadingMessage, replacement);
        } catch (error: any) {
          const errorMessage = `Error generating ${type}: ${error?.message || 'Unknown error'}`;
          // Replace the loading message with the error message
          result = result.replace(loadingMessage, errorMessage);
        }
      }

      return result;
    };

    // Process AI generation before any other markdown processing
    text = await processAIGeneration(text);
    if (supportEmoji) {
      text = await processAIGeneration(text, true);
    }

    if (supportEmoji) {
      // Process emoji-based syntax first
      text = text.replace(/~🔗\s*([^\n]+)/g, (match, content) => {
        const linkMatch = content.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          return `<a href="${linkMatch[2]}">${linkMatch[1]}</a>`;
        }
        return content;
      });
      
      text = text.replace(/~🖼️\s*([^\n]+)/g, (match, content) => {
        const imageMatch = content.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (imageMatch) {
          return `<img src="${imageMatch[2]}" alt="${imageMatch[1]}">`;
        }
        return content;
      });

      // Headers with emoji - process these first to avoid emoji showing in output
      text = text.replace(/^~✏️(?!✏️)\s*([^✏️\n]+?)[\s]*$/gm, '<h1>$1</h1>');
      text = text.replace(/^~✏️✏️(?!✏️)\s*([^✏️\n]+?)[\s]*$/gm, '<h2>$1</h2>');
      text = text.replace(/^~✏️✏️✏️\s*([^✏️\n]+?)[\s]*$/gm, '<h3>$1</h3>');

      // Other emoji-based patterns
      text = text.replace(/~🌟\s*(.*?)$/gm, '<p><strong>$1</strong></p>');
      text = text.replace(/~🖋️\s*(.*?)$/gm, '<p><em>$1</em></p>');
      text = text.replace(/~❌\s*(.*?)$/gm, '<p><del>$1</del></p>');
    }

    // Standard Markdown syntax
    // Headers
    text = text.replace(/^#\s+(.+?)$/gm, '<h1>$1</h1>');
    text = text.replace(/^##\s+(.+?)$/gm, '<h2>$1</h2>');
    text = text.replace(/^###\s+(.+?)$/gm, '<h3>$1</h3>');

    // Other standard patterns
    text = text.replace(/\*\*(.*?)\*\*/g, '<p><strong>$1</strong></p>');
    text = text.replace(/\*(.*?)\*/g, '<p><em>$1</em></p>');
    text = text.replace(/~~(.*?)~~/g, '<p><del>$1</del></p>');
    
    // Process standard images before links to avoid conflicts
    text = text.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Lists
    const processLists = (text: string): string => {
      const lines = text.split('\n');
      const result = [];
      let currentLevel = 0;
      let inList = false;
      let listStack: ('ul' | 'ol')[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const unorderedMatch = line.match(/^(\s*)-\s*(.*?)$/);
        const orderedMatch = line.match(/^(\s*)\d+\.\s*(.*?)$/);

        if (unorderedMatch || orderedMatch) {
          const match = unorderedMatch || orderedMatch;
          if (!match) continue;
          
          const [, indent, content] = match;
          const level = Math.floor(indent.length / 2); // Each level is 2 spaces
          const listType = unorderedMatch ? 'ul' : 'ol';

          if (!inList) {
            result.push(`<${listType}>`);
            listStack.push(listType);
            inList = true;
            currentLevel = level;
          } else if (level > currentLevel) {
            // Starting a new nested list
            result.push(`<${listType}>`);
            listStack.push(listType);
            currentLevel = level;
          } else if (level < currentLevel) {
            // Closing nested lists until we reach the current level
            while (currentLevel > level && listStack.length > 0) {
              const type = listStack.pop();
              if (type) result.push(`</${type}>`);
              currentLevel--;
            }
          }

          result.push(`<li>${content}</li>`);
        } else {
          // Not a list item - close all open lists
          if (inList) {
            while (listStack.length > 0) {
              const type = listStack.pop();
              if (type) result.push(`</${type}>`);
            }
            inList = false;
            currentLevel = 0;
          }
          result.push(line);
        }
      }

      // Close any remaining open lists
      if (inList) {
        while (listStack.length > 0) {
          const type = listStack.pop();
          if (type) result.push(`</${type}>`);
        }
      }

      return result.join('\n');
    };

    // Process lists
    text = processLists(text);

    // Code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');

    if (supportEmoji) {
      text = text.replace(/~💻\s*([^~]+)/g, '<pre><code>$1</code></pre>');
    }

    // Arguments
    const args = new Map();
    
    // Extract and store arguments
    text = text.replace(/@arg\[([^\]]+)\]:(\w+)\s*\((.*?)\)/g, (match, name, type, desc) => {
      args.set(name, { type, desc: desc.trim() });
      return ''; // Return empty string to not show the variable name
    });
    if (supportEmoji) {
      text = text.replace(/~💡\s*\[([^\]]+)\]:(\w+)\s*\((.*?)\)/g, (match, name, type, desc) => {
        args.set(name, { type, desc: desc.trim() });
        return ''; // Return empty string to not show the variable name
      });
    }

    // Reference Arguments
    text = text.replace(/\{([^}]+)\}/g, (match, name) => {
      if (args.has(name)) {
        const arg = args.get(name);
        return `<span class="arg-reference">${arg.desc}</span>`;
      }
      return match;
    });

    // Tools and AI Components
    const tools = new Map();
    const aiComponents = new Map();
    
    // Extract and store tools
    text = text.replace(/@tool\[([^\]]+)\]\((.*?)\)(?:\s*\*\*Args:\*\*\s*((?:[\s\S](?!\*\*Description:\*\*))*?))?\s*\*\*Description:\*\*\s*([\s\S]*?)(?=\n\n|$)/gm, 
      (match, name, params, args, desc) => {
        tools.set(name, { params, args, desc: desc.trim() });
        return ''; // Remove entire tool definition
    });
    
    // Process emoji-based tool syntax
    if (supportEmoji) {
      text = text.replace(/~?@?🔧\s*\[([^\]]+)\]\((.*?)\)(?:\s*\*\*Args:\*\*\s*((?:[\s\S](?!\*\*Description:\*\*))*?))?\s*\*\*Description:\*\*\s*([\s\S]*?)(?=\n\n|$)/gm,
        (match, name, params, args, desc) => {
          tools.set(name, { params, args, desc: desc.trim() });
          return ''; // Remove entire tool definition
      });
    }

    // Extract and store AI Components
    text = text.replace(/@ai\[([^\]]+)\]\((.*?)(?:,\s*tool:\s*\[([^\]]+)\])?\)(?:\s*\*\*Description:\*\*\s*([\s\S]*?)(?=\n\n|$))?/gm,
      (match, name, params, toolRef, desc) => {
        aiComponents.set(name, { 
          params: params.trim(),
          toolRef,
          desc: desc ? desc.trim() : ''
        });
        return ''; // Remove entire AI component definition
    });
    
    if (supportEmoji) {
      text = text.replace(/~?@?🤖\s*\[([^\]]+)\]\((.*?)(?:,\s*tool:\s*\[([^\]]+)\])?\)(?:\s*\*\*Description:\*\*\s*([\s\S]*?)(?=\n\n|$))?/gm,
        (match, name, params, toolRef, desc) => {
          aiComponents.set(name, { 
            params: params.trim(),
            toolRef,
            desc: desc ? desc.trim() : ''
          });
          return ''; // Remove entire AI component definition
      });
    }

    // Reference AI Components
    text = text.replace(/@ai\[([^\]]+)\]\((.*?)\)/g, (match, name, params) => {
      if (aiComponents.has(name)) {
        const ai = aiComponents.get(name);
        let html = `<div class="ai-component">`;
        html += `<span class="ai-name">${name}</span>`;
        html += `<span class="ai-params">(${ai.params}${ai.toolRef ? `, using ${ai.toolRef}` : ''})</span>`;
        html += `</div>`;
        return html;
      }
      return match;
    });

    // Reference Tools
    text = text.replace(/\{([^}]+)\}/g, (match, name) => {
      if (tools.has(name)) {
        return name; // Just return the tool name when referenced
      }
      return match;
    });

    // Components (Structured Layouts)
    const processLayouts = (text: string, isEmoji: boolean = false): string => {
      const prefix = isEmoji ? '~📦' : '>';
      const pattern = isEmoji ? 
        /^(\s*)~📦\s*\[([^\]]+)\]\s*\n([\s\S]*?)(?=(?:\s*)~📦\s*\[|$)/gm :
        /^(\s*)>\s*\[([^\]]+)\]\s*\n([\s\S]*?)(?=(?:\s*)>\s*\[|$)/gm;
      
      let lastIndex = 0;
      let result = '';
      let match;

      while ((match = pattern.exec(text)) !== null) {
        const [fullMatch, indent, className, content] = match;
        const level = indent.length;
        
        // Add any text between matches
        if (match.index > lastIndex) {
          result += text.substring(lastIndex, match.index);
        }
        
        // Process the content recursively for nested layouts
        const processedContent = content.split('\n').map(line => {
          // Remove the current level of indentation from nested content
          if (line.startsWith(indent)) {
            return line.substring(indent.length);
          }
          return line;
        }).join('\n');

        // Create the div with proper indentation
        const indentStr = '  '.repeat(level / 2);
        result += `${indentStr}<div class="${className}">\n`;
        result += processedContent.split('\n').map(line => `${indentStr}  ${line}`).join('\n');
        result += `\n${indentStr}</div>\n`;
        
        lastIndex = match.index + fullMatch.length;
      }
      
      // Add any remaining text
      if (lastIndex < text.length) {
        result += text.substring(lastIndex);
      }
      
      return result;
    };

    // Process standard layouts first
    text = processLayouts(text);
    
    // Process emoji-based layouts if supported
    if (supportEmoji) {
      text = processLayouts(text, true);
    }

    // Including External Markdown Content
    const processExternalMarkdown = (text: string, isEmoji: boolean = false): string => {
      const pattern = isEmoji ?
        /~📄\s*\(\s*url\s*=\s*"([^"]+)"\s*\)/g :
        /~mkd\s*\(\s*url\s*=\s*"([^"]+)"\s*\)/g;

      return text.replace(pattern, (match, url) => {
        return `<div class="external-markdown" data-url="${url}">
  <div class="external-markdown-loading">Loading external content from: ${url}</div>
</div>`;
      });
    };

    // Process standard syntax first
    text = processExternalMarkdown(text);
    
    // Process emoji-based syntax if supported
    if (supportEmoji) {
      text = processExternalMarkdown(text, true);
    }

    return text;
  };

  const handleInput = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const parsedHtml = await parseMarkdown(value);
    setHtml(parsedHtml);
    setMarkdown(value);
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    onSave(title, markdown, html, isPrivate);
  };

  useEffect(() => {
    const initializeHtml = async () => {
      const parsedHtml = await parseMarkdown(initialValue);
      setHtml(parsedHtml);
    };
    initializeHtml();
  }, [initialValue]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2 justify-between">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
            className="p-2 border rounded-md w-full md:min-w-[600px]"
            readOnly={readOnly}
          />
          {!readOnly && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          )}
        </div>
        {!readOnly && (
          <div className="flex items-center space-x-2">
            <select
              value={isPrivate ? 'private' : 'public'}
              onChange={(e) => setIsPrivate(e.target.value === 'private')}
              className="p-2 border rounded-md"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        )}
        <div className="markdown-editor" ref={editorRef}>
          <textarea
            className="markdown-input"
            value={markdown}
            onChange={handleInput}
            placeholder="Type your markdown here..."
            readOnly={readOnly}
          />
          <div 
            className="markdown-preview"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
      <div className="flex justify-end">
      </div>
    </div>
  );
} 