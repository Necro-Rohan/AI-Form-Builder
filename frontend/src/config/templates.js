// Form Templates Configuration
export const FORM_TEMPLATES = {
  MODERN: {
    id: 'modern',
    name: 'Modern Clean',
    description: 'Clean, minimalist design with subtle shadows and modern typography',
    colors: {
      primary: '#4f46e5',
      secondary: '#6366f1',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b'
    },
    styles: {
      container: 'max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8',
      title: 'text-3xl font-bold text-gray-900 mb-2',
      description: 'text-lg text-gray-600 mb-8',
      fieldGroup: 'mb-6',
      label: 'block text-sm font-semibold text-gray-700 mb-2',
      input: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors',
      textarea: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none',
      select: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors',
      checkbox: 'w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500',
      radio: 'w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500',
      button: 'w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
      error: 'text-red-600 text-sm mt-1',
      help: 'text-gray-500 text-sm mt-1'
    }
  },
  
  PROFESSIONAL: {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate-style design with structured layout and professional colors',
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      background: '#ffffff',
      surface: '#f1f5f9',
      text: '#0f172a',
      textSecondary: '#475569',
      border: '#cbd5e1',
      success: '#059669',
      error: '#dc2626',
      warning: '#d97706'
    },
    styles: {
      container: 'max-w-3xl mx-auto bg-white rounded-lg shadow-md border border-slate-200 p-10',
      title: 'text-2xl font-bold text-slate-900 mb-3 border-b border-slate-200 pb-3',
      description: 'text-base text-slate-600 mb-8 leading-relaxed',
      fieldGroup: 'mb-8 p-4 bg-slate-50 rounded-md border border-slate-200',
      label: 'block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide',
      input: 'w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all',
      textarea: 'w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none',
      select: 'w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all',
      checkbox: 'w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500',
      radio: 'w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500',
      button: 'w-full bg-blue-600 text-white py-3 px-6 rounded-md font-bold hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      error: 'text-red-600 text-sm mt-2 font-medium',
      help: 'text-slate-500 text-sm mt-2'
    }
  },
  
  CREATIVE: {
    id: 'creative',
    name: 'Creative Vibrant',
    description: 'Colorful, creative design with gradients and playful elements',
    colors: {
      primary: '#ec4899',
      secondary: '#f97316',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      surface: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b'
    },
    styles: {
      container: 'max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border-2 border-pink-200 p-8 relative overflow-hidden',
      title: 'text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent mb-3',
      description: 'text-lg text-gray-600 mb-8',
      fieldGroup: 'mb-6 p-6 bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl border border-pink-200',
      label: 'block text-sm font-bold text-gray-700 mb-2',
      input: 'w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white',
      textarea: 'w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all resize-none bg-white',
      select: 'w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white',
      checkbox: 'w-5 h-5 text-pink-600 border-pink-300 rounded focus:ring-pink-500',
      radio: 'w-5 h-5 text-pink-600 border-pink-300 focus:ring-pink-500',
      button: 'w-full bg-gradient-to-r from-pink-600 to-orange-500 text-white py-4 px-6 rounded-xl font-bold hover:from-pink-700 hover:to-orange-600 transition-all transform hover:scale-105 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2',
      error: 'text-red-600 text-sm mt-2 font-medium',
      help: 'text-gray-500 text-sm mt-2'
    }
  }
};

// Get random template
export const getRandomTemplate = () => {
  const templates = Object.values(FORM_TEMPLATES);
  return templates[Math.floor(Math.random() * templates.length)];
};

// Get template by ID
export const getTemplateById = (id) => {
  return FORM_TEMPLATES[id.toUpperCase()] || FORM_TEMPLATES.MODERN;
};
