// IN FUTURE to develop. It did not work properly
// In the present i create a utility to play alert sounds based on r

import highRiskSound from '../assets/sounds/high-risk.mp3';
import mediumRiskSound from '../assets/sounds/medium-risk.mp3';
import lowRiskSound from '../assets/sounds/low-risk.mp3';

export const playAlertSound = (riskLevel: string) => {
  let soundFile: string;
  let volume = 1;

  switch (riskLevel.toLowerCase()) {
    case 'high':
      soundFile = highRiskSound;
      volume = 1;
      break;
    case 'medium':
      soundFile = mediumRiskSound;
      volume = 0.7;
      break;
    case 'low':
      soundFile = lowRiskSound;
      volume = 0.5;
      break;
    default:
      soundFile = mediumRiskSound;
      volume = 0.7;
  }

  try {
    const audio = new Audio(soundFile);
    audio.volume = volume;
    audio.play().catch((error) => {
      console.warn('Could not play sound:', error);
      // Silenciosamente fallar si no se puede reproducir
    });
  } catch (error) {
    console.warn('Error creating audio:', error);
  }
};