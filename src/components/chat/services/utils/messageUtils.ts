
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
  
  // Fix improper line breaks within paragraphs
  processedText = processedText.replace(/([^\n])\n([^\n\-\*\d•#])/g, '$1\n\n$2');
  
  // Ensure tables have proper spacing
  processedText = processedText.replace(/(\|\s*[\w\s]+\s*\|)/g, '\n$1\n');
  
  return processedText;
}

/**
 * Creates a properly formatted offline message with a consistent style
 * 
 * @param offlineMessage The offline message text
 * @returns Formatted offline message with styling
 */
export function formatOfflineMessage(offlineMessage: string): string {
  return `> **Offline Modus Actief**\n\n${offlineMessage}\n\n_Uw handelssysteem blijft beschikbaar met beperkte functionaliteit. Verbind opnieuw met internet voor volledige toegang tot alle functies._`;
}

/**
 * Checks if a message was generated in offline mode
 * 
 * @param messageText The message text to check
 * @returns Boolean indicating if this is an offline mode message
 */
export function isOfflineModeMessage(messageText: string): boolean {
  return messageText.startsWith('> **Offline Modus Actief**');
}
