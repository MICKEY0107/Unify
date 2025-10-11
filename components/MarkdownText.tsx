import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MarkdownTextProps {
  children: string;
  style?: any;
}

interface ParsedElement {
  type: 'text' | 'bold' | 'italic' | 'bullet' | 'header' | 'newline' | 'code' | 'codeblock';
  content: string;
  level?: number; // for headers and bullet indentation
}

export default function MarkdownText({ children, style }: MarkdownTextProps) {
  const parseMarkdown = (text: string): ParsedElement[] => {
    const elements: ParsedElement[] = [];
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip empty lines but add newline for spacing
      if (line.trim() === '') {
        if (i > 0) elements.push({ type: 'newline', content: '' });
        continue;
      }
      
      // Check for code blocks (```)
      if (line.trim() === '```') {
        // Find the closing ```
        let codeContent = '';
        let j = i + 1;
        while (j < lines.length && lines[j].trim() !== '```') {
          codeContent += lines[j] + '\n';
          j++;
        }
        if (j < lines.length) {
          elements.push({
            type: 'codeblock',
            content: codeContent.trim()
          });
          i = j; // Skip to after the closing ```
          continue;
        }
      }
      
      // Check for headers (# ## ###)
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        elements.push({
          type: 'header',
          content: headerMatch[2],
          level: headerMatch[1].length
        });
        continue;
      }
      
      // Check for bullet points (* - +) with indentation support
      const bulletMatch = line.match(/^(\s*)[*\-+]\s+(.+)$/);
      if (bulletMatch) {
        elements.push({
          type: 'bullet',
          content: bulletMatch[2],
          level: Math.floor(bulletMatch[1].length / 2) // Calculate nesting level
        });
        continue;
      }
      
      // Check for numbered lists (1. 2. etc.)
      const numberedMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);
      if (numberedMatch) {
        elements.push({
          type: 'bullet',
          content: numberedMatch[2],
          level: Math.floor(numberedMatch[1].length / 2)
        });
        continue;
      }
      
      // Parse inline formatting (bold, italic) in regular text
      const inlineElements = parseInlineFormatting(line);
      elements.push(...inlineElements);
      
      // Add newline after each line (except the last one)
      if (i < lines.length - 1) {
        elements.push({ type: 'newline', content: '' });
      }
    }
    
    return elements;
  };
  
  const parseInlineFormatting = (text: string): ParsedElement[] => {
    const elements: ParsedElement[] = [];
    let currentIndex = 0;
    
    // Enhanced regex to handle bold (**text**), italic (*text*), and inline code (`text`)
    // This regex prioritizes bold over italic to handle nested cases better
    const formatRegex = /(`([^`\n]+?)`|\*\*([^*\n]+?)\*\*|\*([^*\n]+?)\*)/g;
    let match;
    
    while ((match = formatRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        const beforeText = text.substring(currentIndex, match.index);
        if (beforeText) {
          elements.push({ type: 'text', content: beforeText });
        }
      }
      
      // Add the formatted text
      if (match[2]) {
        // Inline code (`text`)
        elements.push({ type: 'code', content: match[2] });
      } else if (match[3]) {
        // Bold text (**text**)
        elements.push({ type: 'bold', content: match[3] });
      } else if (match[4]) {
        // Italic text (*text*)
        elements.push({ type: 'italic', content: match[4] });
      }
      
      currentIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      const remainingText = text.substring(currentIndex);
      if (remainingText) {
        elements.push({ type: 'text', content: remainingText });
      }
    }
    
    // If no formatting was found, return the whole text as a single element
    if (elements.length === 0) {
      elements.push({ type: 'text', content: text });
    }
    
    return elements;
  };
  
  const renderElement = (element: ParsedElement, index: number) => {
    switch (element.type) {
      case 'header':
        return (
          <Text
            key={index}
            style={[
              styles.text,
              styles.header,
              element.level === 1 && styles.header1,
              element.level === 2 && styles.header2,
              element.level === 3 && styles.header3,
              style
            ]}
          >
            {element.content}
          </Text>
        );
        
      case 'bold':
        return (
          <Text key={index} style={[styles.text, styles.bold, style]}>
            {element.content}
          </Text>
        );
        
      case 'italic':
        return (
          <Text key={index} style={[styles.text, styles.italic, style]}>
            {element.content}
          </Text>
        );
        
      case 'bullet':
        const indentLevel = element.level || 0;
        return (
          <View 
            key={index} 
            style={[
              styles.bulletContainer,
              { paddingLeft: 8 + (indentLevel * 16) }
            ]}
          >
            <Text style={[styles.text, styles.bulletPoint, style]}>•</Text>
            <Text style={[styles.text, styles.bulletText, style]}>
              {renderInlineElements(parseInlineFormatting(element.content))}
            </Text>
          </View>
        );
        
      case 'code':
        return (
          <Text key={index} style={[styles.text, styles.inlineCode, style]}>
            {element.content}
          </Text>
        );
        
      case 'codeblock':
        return (
          <View key={index} style={styles.codeBlock}>
            <Text style={[styles.text, styles.codeBlockText, style]}>
              {element.content}
            </Text>
          </View>
        );
        
      case 'newline':
        return <Text key={index} style={styles.newline}>{'\n'}</Text>;
        
      case 'text':
      default:
        return (
          <Text key={index} style={[styles.text, style]}>
            {element.content}
          </Text>
        );
    }
  };
  
  const renderInlineElements = (elements: ParsedElement[]) => {
    return elements.map((element, index) => {
      switch (element.type) {
        case 'bold':
          return (
            <Text key={index} style={[styles.bold, style]}>
              {element.content}
            </Text>
          );
        case 'italic':
          return (
            <Text key={index} style={[styles.italic, style]}>
              {element.content}
            </Text>
          );
        case 'code':
          return (
            <Text key={index} style={[styles.inlineCode, style]}>
              {element.content}
            </Text>
          );
        default:
          return element.content;
      }
    });
  };
  
  const parsedElements = parseMarkdown(children);
  
  return (
    <View style={styles.container}>
      {parsedElements.map((element, index) => renderElement(element, index))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  text: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  italic: {
    fontStyle: 'italic',
    color: '#666666',
  },
  header: {
    fontWeight: '600',
    marginVertical: 4,
  },
  header1: {
    fontSize: 18,
    color: '#1A1A1A',
  },
  header2: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  header3: {
    fontSize: 15,
    color: '#1A1A1A',
  },
  bulletContainer: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  bulletPoint: {
    color: '#007AFF',
    fontWeight: '600',
    marginRight: 8,
    minWidth: 12,
  },
  bulletText: {
    flex: 1,
    color: '#1A1A1A',
  },
  newline: {
    height: 4,
  },
});