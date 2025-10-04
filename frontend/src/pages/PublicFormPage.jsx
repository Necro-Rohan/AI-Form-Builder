import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { CheckCircle, AlertCircle } from 'lucide-react';
import StyledForm from '../components/StyledForm';
import { FORM_TEMPLATES } from '../config/templates';
import toast from 'react-hot-toast';

const PublicFormPage = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/public/forms/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        setForm(data);
      } else {
        toast.error('Form not found or not public');
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/save-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: id,
          formData: data.formData
        })
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success('Thank you! Your response has been submitted.');
      } else {
        toast.error('Failed to submit response');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Form not found</h2>
          <p className="mt-2 text-gray-600">This form may have been removed or is not public.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Thank you!</h2>
          <p className="mt-2 text-gray-600">Your response has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <StyledForm
          form={form}
          template={FORM_TEMPLATES.MODERN} // Use modern template as default for public forms
          onSubmit={handleSubmit}
          disabled={submitting}
        />
      </div>
    </div>
  );
};

export default PublicFormPage;