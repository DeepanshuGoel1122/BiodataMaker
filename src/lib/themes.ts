export type ThemeColor = 
  | 'gold' 
  | 'maroon' 
  | 'royal-blue' 
  | 'purple' 
  | 'emerald' 
  | 'pink' 
  | 'minimal-black' 
  | 'traditional-red' 
  | 'coffee' 
  | 'navy';

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textLight: string;
  border: string;
}

export const THEMES: Record<ThemeColor, ThemeConfig> = {
  gold: {
    primary: '#D4AF37', // Metallic Gold
    secondary: '#FBF8F1', // Pale Cream
    accent: '#AA8C2C', // Darker Gold
    background: '#FFFFFF',
    text: '#333333',
    textLight: '#666666',
    border: '#E8DDB5',
  },
  maroon: {
    primary: '#800000', // Maroon
    secondary: '#FDF7F7', // Very Pale Red
    accent: '#4D0000', // Dark Maroon
    background: '#FFFFFF',
    text: '#222222',
    textLight: '#777777',
    border: '#E0CACA',
  },
  'royal-blue': {
    primary: '#4169E1', // Royal Blue
    secondary: '#F5F7FD', // Pale Blue
    accent: '#27408B', // Dark Royal Blue
    background: '#FFFFFF',
    text: '#1C2833',
    textLight: '#5D6D7E',
    border: '#D4E0F9',
  },
  purple: {
    primary: '#6A0DAD', // Deep Purple
    secondary: '#FAF5FD', // Pale Purple
    accent: '#4B0082', // Indigo
    background: '#FFFFFF',
    text: '#2A1B38',
    textLight: '#726380',
    border: '#E6D7F5',
  },
  emerald: {
    primary: '#50C878', // Emerald Green
    secondary: '#F4FBF6', // Pale Green
    accent: '#046307', // Dark Green
    background: '#FFFFFF',
    text: '#1E3320',
    textLight: '#5F7361',
    border: '#CBEBD2',
  },
  pink: {
    primary: '#FFC0CB', // Pink
    secondary: '#FFF5F7', // Pale Pink
    accent: '#FF69B4', // Hot Pink
    background: '#FFFFFF',
    text: '#4A2B31',
    textLight: '#8A6D72',
    border: '#FFE0E5',
  },
  'minimal-black': {
    primary: '#000000', // Black
    secondary: '#F8F9FA', // Off White
    accent: '#495057', // Slate
    background: '#FFFFFF',
    text: '#212529',
    textLight: '#868E96',
    border: '#DEE2E6',
  },
  'traditional-red': {
    primary: '#C41E3A', // Cardinal Red
    secondary: '#FEF5F5', // Pale Red
    accent: '#8B0000', // Dark Red
    background: '#FFFFFF',
    text: '#3A1414',
    textLight: '#825656',
    border: '#F2D3D3',
  },
  coffee: {
    primary: '#6F4E37', // Coffee
    secondary: '#FAF7F5', // Pale Brown
    accent: '#4A3424', // Dark Coffee
    background: '#FFFFFF',
    text: '#36261C',
    textLight: '#7A6458',
    border: '#E3D7D0',
  },
  navy: {
    primary: '#000080', // Navy
    secondary: '#F2F2F7', // Pale Navy
    accent: '#000040', // Dark Navy
    background: '#FFFFFF',
    text: '#0D1121',
    textLight: '#555C70',
    border: '#CCD1E6',
  }
};
