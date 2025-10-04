import React from 'react';
import { Palette, Sparkles, Briefcase, Wand2 } from 'lucide-react';
import { FORM_TEMPLATES, getRandomTemplate } from '../config/templates';

const TemplateSelector = ({ selectedTemplate, onTemplateSelect, onRandomSelect }) => {
  const templates = Object.values(FORM_TEMPLATES);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Palette className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Choose Template</h3>
        </div>
        <button
          onClick={onRandomSelect}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
        >
          <Wand2 className="w-4 h-4" />
          <span>Random</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onTemplateSelect(template)}
            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-lg ${
              selectedTemplate?.id === template.id
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {selectedTemplate?.id === template.id && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 mb-3">
              {template.id === 'modern' && <Sparkles className="w-5 h-5 text-indigo-600" />}
              {template.id === 'professional' && <Briefcase className="w-5 h-5 text-blue-600" />}
              {template.id === 'creative' && <Wand2 className="w-5 h-5 text-pink-600" />}
              <h4 className="font-semibold text-gray-900">{template.name}</h4>
            </div>

            <p className="text-sm text-gray-600 mb-4">{template.description}</p>

            {/* Template Preview */}
            <div className="space-y-2">
              <div className={`h-2 rounded ${template.id === 'modern' ? 'bg-indigo-200' : template.id === 'professional' ? 'bg-blue-200' : 'bg-pink-200'}`}></div>
              <div className={`h-1 rounded ${template.id === 'modern' ? 'bg-indigo-100' : template.id === 'professional' ? 'bg-blue-100' : 'bg-pink-100'}`}></div>
              <div className={`h-1 rounded ${template.id === 'modern' ? 'bg-indigo-100' : template.id === 'professional' ? 'bg-blue-100' : 'bg-pink-100'}`}></div>
            </div>

            {/* Color Palette Preview */}
            <div className="flex space-x-1 mt-3">
              <div 
                className="w-4 h-4 rounded-full border border-gray-200" 
                style={{ backgroundColor: template.colors.primary }}
                title="Primary"
              ></div>
              <div 
                className="w-4 h-4 rounded-full border border-gray-200" 
                style={{ backgroundColor: template.colors.secondary }}
                title="Secondary"
              ></div>
              <div 
                className="w-4 h-4 rounded-full border border-gray-200" 
                style={{ backgroundColor: template.colors.success }}
                title="Success"
              ></div>
              <div 
                className="w-4 h-4 rounded-full border border-gray-200" 
                style={{ backgroundColor: template.colors.error }}
                title="Error"
              ></div>
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Selected:</span> {selectedTemplate.name} - {selectedTemplate.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
