import React from 'react';
import { FormField, LoadingButton } from '../../Shared';

export default function AdditionalInfoStep({ formData, onChange, onNext, onBack, loading }) {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="register-step">
      {formData.accountType === 'student' && (
        <>
          <FormField
            label="Admission Number"
            name="admissionNumber"
            type="text"
            placeholder="ADM-2024-001"
            value={formData.admissionNumber || ''}
            onChange={(e) => handleChange('admissionNumber', e.target.value)}
          />

          <FormField
            label="Grade Level"
            name="gradeLevel"
            type="text"
            placeholder="Select your grade"
            value={formData.gradeLevel || ''}
            onChange={(e) => handleChange('gradeLevel', e.target.value)}
          />
        </>
      )}

      {formData.accountType === 'teacher' && (
        <>
          <FormField
            label="Qualification"
            name="qualification"
            type="text"
            placeholder="Your highest qualification"
            value={formData.qualification || ''}
            onChange={(e) => handleChange('qualification', e.target.value)}
          />

          <FormField
            label="Subject Specialization"
            name="subject"
            type="text"
            placeholder="Primary subject"
            value={formData.subject || ''}
            onChange={(e) => handleChange('subject', e.target.value)}
          />
        </>
      )}

      {formData.accountType === 'staff' && (
        <FormField
          label="Department"
          name="department"
          type="text"
          placeholder="Your department"
          value={formData.department || ''}
          onChange={(e) => handleChange('department', e.target.value)}
        />
      )}

      {formData.accountType === 'parent' && (
        <>
          <FormField
            label="Parent ID"
            name="parentId"
            type="text"
            placeholder="PAR-2024-001"
            value={formData.parentId || ''}
            onChange={(e) => handleChange('parentId', e.target.value)}
          />

          <FormField
            label="Student Admission Numbers"
            name="studentAdmissionNumbers"
            type="text"
            placeholder="Comma-separated admission numbers"
            value={formData.studentAdmissionNumbers || ''}
            onChange={(e) => handleChange('studentAdmissionNumbers', e.target.value)}
          />
        </>
      )}

      <FormField
        label="Address"
        name="address"
        type="text"
        placeholder="Your address"
        value={formData.address || ''}
        onChange={(e) => handleChange('address', e.target.value)}
      />

      <FormField
        label="Emergency Contact Name"
        name="emergencyContactName"
        type="text"
        placeholder="Emergency contact name"
        value={formData.emergencyContactName || ''}
        onChange={(e) => handleChange('emergencyContactName', e.target.value)}
      />

      <FormField
        label="Emergency Contact Phone"
        name="emergencyContactPhone"
        type="tel"
        placeholder="Emergency contact phone"
        value={formData.emergencyContactPhone || ''}
        onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
      />

      <div className="step-actions">
        <LoadingButton
          type="button"
          onClick={onBack}
          variant="secondary"
          loading={loading}
        >
          Back
        </LoadingButton>
        <LoadingButton type="submit" loading={loading}>
          Continue
        </LoadingButton>
      </div>
    </form>
  );
}
