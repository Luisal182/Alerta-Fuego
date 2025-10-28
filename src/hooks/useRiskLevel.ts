import { useState } from 'react';
import type { RiskLevel } from '../types';

export const useRiskLevel = () => {
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>('medium');

  const handleRiskLevelChange = (risk: RiskLevel) => {
    setSelectedRisk(risk);
  };

  return {
    selectedRisk,
    handleRiskLevelChange,
  };
};