
export interface GrokSettings {
  deepSearchEnabled: boolean;
  thinkEnabled: boolean;
}

export const defaultGrokSettings: GrokSettings = {
  deepSearchEnabled: true,
  thinkEnabled: true,
};
