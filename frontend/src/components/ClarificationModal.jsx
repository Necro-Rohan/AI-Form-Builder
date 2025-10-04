import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

const ClarificationModal = ({ data, onResponse, onClose }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [customAnswer, setCustomAnswer] = useState('');

  const handleSubmit = () => {
    if (selectedOption === 'custom' && !customAnswer.trim()) {
      return;
    }
    
    const response = {
      option: selectedOption,
      customAnswer: selectedOption === 'custom' ? customAnswer : null
    };
    
    onResponse(response);
  };

  if (!data || !data.followups || data.followups.length === 0) {
    return null;
  }

  const followup = data.followups[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                We need a quick clarification
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">{followup.message}</p>
            
            <div className="space-y-3">
              {followup.options.map((option) => (
                <label
                  key={option.id}
                  className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedOption === option.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="clarification"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
              
              <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedOption === 'custom'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="clarification"
                    value="custom"
                    checked={selectedOption === 'custom'}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      Custom answer
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your choice..."
                      value={customAnswer}
                      onChange={(e) => setCustomAnswer(e.target.value)}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedOption || (selectedOption === 'custom' && !customAnswer.trim())}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Apply & regenerate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClarificationModal;