
/**
 * Processes message text to ensure proper line breaks and formatting
 * 
 * @param text The raw message text from the API
 * @returns Properly formatted message text
 */
export function processMessageText(text: string): string {
  if (!text) return '';
  
  // Replace triple backticks code blocks with proper spacing
  let processedText = text.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `\n\`\`\`${code}\`\`\`\n`;
  });
  
  // Ensure proper line breaks for bullet points and numbered lists
  processedText = processedText.replace(/(?<!\n)(\n[•\-\*\d]+\.)/g, '\n$1');
  
  // Ensure markdown headers have proper spacing
  processedText = processedText.replace(/(?<!\n)(\n#{1,6}\s)/g, '\n$1');
  
  return processedText;
}
