import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportFormSchema } from '../../types';
import type { ReportFormData, RiskLevel } from '../../types';
import styles from './ReportForm.module.css';

interface ReportFormProps {
  initialLat?: number;
  initialLng?: number;
}

export default function ReportForm({ initialLat = -33.4489, initialLng = -70.6693 }: ReportFormProps) {
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);



  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      latitude: initialLat,
      longitude: initialLng,
      riskLevel: 'medium',
    },
  });
  // Update form when coordinates change from map click
  useEffect(() => {
    setValue('latitude', initialLat);
    setValue('longitude', initialLng);
  }, [initialLat, initialLng, setValue]);

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    console.log('Form submitted:', data);
    
    // TODO: Replace with actual Supabase call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert('Report submitted successfully!');
    setIsSubmitting(false);
  };

  const handleRiskLevelClick = (level: RiskLevel) => {
    setSelectedRisk(level);
    setValue('riskLevel', level);
  };

  return (
    <div className={styles.formContainer}>
      {/* Form Header */}
      <div className={styles.formHeader}>
        <span className={styles.formHeaderIcon}>⚠️</span>
        <h2 className={styles.formHeaderTitle}>Report New Incident</h2>
      </div>

      {/* Form Body */}
      <div className={styles.formBody}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Coordinates */}
          <div className={styles.formGroup}>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label className={styles.label}>Latitude</label>
                <input
                  type="text"
                  className={styles.input}
                  {...register('latitude', { valueAsNumber: true })}
                  readOnly
                />
                {errors.latitude && (
                  <span className={styles.error}>{errors.latitude.message}</span>
                )}
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>Longitude</label>
                <input
                  type="text"
                  className={styles.input}
                  {...register('longitude', { valueAsNumber: true })}
                  readOnly
                />
                {errors.longitude && (
                  <span className={styles.error}>{errors.longitude.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Incident Description</label>
            <textarea
              className={styles.textarea}
              placeholder="Describe the wildfire incident in detail including location landmarks, size estimation, wind conditions, and any immediate threats to property or lives..."
              {...register('description')}
            />
            {errors.description && (
              <span className={styles.error}>{errors.description.message}</span>
            )}
          </div>

          {/* Risk Level */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Risk Level Assessment</label>
            <input type="hidden" {...register('riskLevel')} />
            <div className={styles.riskButtons}>
              <button
                type="button"
                className={`${styles.riskButton} ${styles.riskLow} ${
                  selectedRisk === 'low' ? styles.active : ''
                }`}
                onClick={() => handleRiskLevelClick('low')}
              >
                <span className={styles.riskIcon}>🔥</span>
                <span>LOW</span>
              </button>
              <button
                type="button"
                className={`${styles.riskButton} ${styles.riskMedium} ${
                  selectedRisk === 'medium' ? styles.active : ''
                }`}
                onClick={() => handleRiskLevelClick('medium')}
              >
                <span className={styles.riskIcon}>🔥</span>
                <span>MEDIUM</span>
              </button>
              <button
                type="button"
                className={`${styles.riskButton} ${styles.riskHigh} ${
                  selectedRisk === 'high' ? styles.active : ''
                }`}
                onClick={() => handleRiskLevelClick('high')}
              >
                <span className={styles.riskIcon}>🔥</span>
                <span>HIGH</span>
              </button>
            </div>
            {errors.riskLevel && (
              <span className={styles.error}>{errors.riskLevel.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <div className={styles.formGroup}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  <span>SENDING...</span>
                </>
              ) : (
                <>
                  <span className={styles.submitIcon}>✈️</span>
                  <span>SEND EMERGENCY REPORT</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}