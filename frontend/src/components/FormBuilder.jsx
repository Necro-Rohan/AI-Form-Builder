import React, { useState, useEffect } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { Zap, Eye, Settings, Code, Wand2, Edit3, Palette } from 'lucide-react';
import FormFieldEditor from "./FormFieldEditor.jsx";
import TemplateSelector from "./TemplateSelector.jsx";
import StyledForm from "./StyledForm.jsx";
import { getRandomTemplate } from '../config/templates';
import toast from 'react-hot-toast';

const FormBuilder = ({ form, onGenerate, onFormChange }) => {
  const [description, setDescription] = useState('');
  const [formTitle, setFormTitle] = useState(form?.title || '');
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(!!form);
  const [showSchema, setShowSchema] = useState(false);
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});

  // Update preview state when a new form is generated
  useEffect(() => {
    if (form && form.schema) {
      setShowPreview(true);
    }
  }, [form]);

  // Sync local formTitle state when the form prop changes
  useEffect(() => {
    if (form?.title) {
      setFormTitle(form.title);
    }
  }, [form?.title]);

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error('Please enter a form description');
      return;
    }

    setGenerating(true);
    try {
      console.log('Generating form with description:', description);
      console.log('Form title:', formTitle);
      await onGenerate(description, formTitle);
      // Auto-select a random template if none selected
      if (!selectedTemplate) {
        const randomTemplate = getRandomTemplate();
        setSelectedTemplate(randomTemplate);
        toast.success(`Random template selected: ${randomTemplate.name}`);
      }
    } catch (error) {
      console.error('Error generating form:', error);
      toast.error('Failed to generate form');
    } finally {
      setGenerating(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
    toast.success(`Template selected: ${template.name}`);
  };

  const handleRandomTemplate = () => {
    const randomTemplate = getRandomTemplate();
    setSelectedTemplate(randomTemplate);
    toast.success(`Random template selected: ${randomTemplate.name}`);
  };

  const handleFormDataChange = (data) => {
    setFormData(data.formData);
    if (onFormChange) {
      onFormChange({ ...form, formData: data.formData });
    }
  };

  const handleTestSubmit = (data) => {
    console.log('Test submission:', data.formData);
    toast.success('Test submission successful!');
  };

  const samplePrompts = [
    "Form for hackathon registration: name, email, college, GitHub link, t-shirt size S/M/L, phone optional.",
    "Event feedback form: rating, comments, would recommend, improvements.",
    "Contact form: name, email, subject, message, urgency level.",
    "Survey: age, gender, interests, favorite color, newsletter signup."
  ];

  // This is the view before a form is generated
  if (!form) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wand2 className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Form with AI</h2>
            <p className="text-gray-600">Describe your form in plain English and we'll build it for you</p>
          </div>

          <div className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Title
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Enter your form title"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your form in plain English
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Form for hackathon registration: name, email, college, GitHub link, t-shirt size S/M/L, phone optional."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows="4"
            />
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Try these examples:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {samplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setDescription(prompt)}
                  className="text-left p-3 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>AI is ready to generate your form</span>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating || !description.trim()}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Generate Form</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // This is the main editor view after a form is generated
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Live Preview */}
        <div className="space-y-6">
          {/* Template Selection */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Form Template
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  {showTemplateSelector ? 'Hide Templates' : 'Choose Template'}
                </button>
              </div>
            </div>

            {showTemplateSelector && (
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateSelect={handleTemplateSelect}
                onRandomSelect={handleRandomTemplate}
              />
            )}

            {selectedTemplate && !showTemplateSelector && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedTemplate.name}</h4>
                    <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                  </div>
                  <button
                    onClick={() => setShowTemplateSelector(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form Preview */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Live Preview
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>
            </div>

            {showPreview && form.schema && (
              <div className="border border-gray-200 rounded-lg p-4">
                <StyledForm
                  form={{ ...form, title: formTitle, formData }}
                  template={selectedTemplate}
                  onSubmit={handleTestSubmit}
                  onFormChange={handleFormDataChange}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Schema & Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Schema & Settings
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowSchema(!showSchema)}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  {showSchema ? 'Hide JSON' : 'Show JSON'}
                </button>
              </div>
            </div>

            {showSchema && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Generated Schema:</h4>
                <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(form.schema, null, 2)}
                </pre>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Form Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setFormTitle(newTitle);
                    onFormChange({ ...form, title: newTitle });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter form title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={form.description || ''}
                  onChange={(e) => onFormChange({ ...form, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter form description"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.isPublic || false}
                    onChange={(e) => onFormChange({ ...form, isPublic: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Make form public</span>
                </label>
              </div>
            </div>
          </div>

          {/* Field Editor */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Edit3 className="w-5 h-5 mr-2" />
                Form Fields
              </h3>
              <button
                onClick={() => setShowFieldEditor(!showFieldEditor)}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                {showFieldEditor ? 'Hide Editor' : 'Show Editor'}
              </button>
            </div>

            {showFieldEditor && (
              <FormFieldEditor
                form={form}
                onFormChange={onFormChange}
              />
            )}
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  const currentDescription = form.description || description;
                  if (!currentDescription) {
                    toast.error("Please add a description to regenerate the form.");
                    return;
                  }
                  onGenerate(currentDescription, formTitle);
                }}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>Regenerate Form</span>
              </button>
              
              <button
                onClick={() => {
                  onFormChange(null);
                  setDescription('');
                  setFormTitle('');
                }}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex items-center justify-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Clear Form</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;