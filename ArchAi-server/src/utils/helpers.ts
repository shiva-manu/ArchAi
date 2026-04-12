export function extractJsonFromResponse(content: string): unknown {
  console.log('[extractJsonFromResponse] Raw AI response (first 300 chars):', content.substring(0, 300));
  
  let jsonStr = content;
  
  // Try to extract JSON from markdown code blocks first
  const jsonBlock = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonBlock) {
    jsonStr = jsonBlock[1];
    console.log('[extractJsonFromResponse] Extracted from code block');
  }
  
  // Find the first { or [ to handle cases where there's text before the JSON
  const firstBrace = jsonStr.indexOf('{');
  const firstBracket = jsonStr.indexOf('[');
  const candidates = [firstBrace, firstBracket].filter((index) => index >= 0);
  const startIndex = candidates.length > 0 ? Math.min(...candidates) : -1;
  
  if (startIndex > -1) {
    jsonStr = jsonStr.substring(startIndex);
  }
  
  // Find the matching closing brace/bracket
  const openChar = jsonStr[0];
  const closeChar = openChar === '{' ? '}' : ']';
  let depth = 0;
  let inString = false;
  let escapeNext = false;
  let endIndex = -1;
  
  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];
    
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    
    if (char === '"' && !escapeNext) {
      inString = !inString;
      continue;
    }
    
    if (!inString) {
      if (char === openChar || char === (openChar === '{' ? '[' : undefined)) {
        depth++;
      } else if (char === closeChar || char === (closeChar === '}' ? ']' : undefined)) {
        depth--;
        if (depth === 0) {
          endIndex = i + 1;
          break;
        }
      }
    }
  }
  
  if (endIndex > -1) {
    jsonStr = jsonStr.substring(0, endIndex);
  }
  
  // Clean up control characters in string values
  jsonStr = cleanJsonString(jsonStr);
  
  try {
    let parsed = JSON.parse(jsonStr);
    
    // If the result is an array with a single object, unwrap it
    if (Array.isArray(parsed)) {
      console.log('[extractJsonFromResponse] AI returned array, unwrapping...');
      if (parsed.length === 1 && typeof parsed[0] === 'object') {
        console.log('[extractJsonFromResponse] Unwrapping single-element array to object');
        return parsed[0];
      }
      // If it's a multi-element array, return as-is (might be valid for some endpoints)
      return parsed;
    }
    
    return parsed;
  } catch (error) {
    console.error('[extractJsonFromResponse] JSON parse error:', error);
    console.error('[extractJsonFromResponse] Raw JSON (first 500 chars):', jsonStr.substring(0, 500));
    throw new Error(`Failed to parse AI response as JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Clean control characters from JSON string values while preserving structure
 */
function cleanJsonString(json: string): string {
  let result = '';
  let inString = false;
  let escapeNext = false;
  
  for (let i = 0; i < json.length; i++) {
    const char = json[i];
    
    if (escapeNext) {
      result += char;
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      result += char;
      escapeNext = true;
      continue;
    }
    
    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }
    
    if (inString) {
      // Replace control characters (except valid escape sequences)
      const charCode = char.charCodeAt(0);
      
      // Keep printable ASCII, tabs, and valid JSON whitespace
      if (charCode >= 32 || char === '\t') {
        result += char;
      } else if (char === '\n' || char === '\r') {
        // Convert newlines to \n in strings
        result += '\\n';
      } else if (charCode < 32) {
        // Skip other control characters
        continue;
      } else {
        result += char;
      }
    } else {
      result += char;
    }
  }
  
  return result;
}

export function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  const attempt = async (retry: number): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (retry >= maxRetries) throw error;
      const delay = baseDelay * Math.pow(2, retry);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return attempt(retry + 1);
    }
  };
  return attempt(0);
}

export function sanitizePrompt(prompt: string): string {
  return prompt.replace(/<[^>]*>/g, '').trim();
}
