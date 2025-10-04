import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FormBuilder from '../components/FormBuilder';
import ClarificationModal from '../components/ClarificationModal';
import FormSettings from '../components/FormSettings';
import { ArrowLeft, Save, Eye, Download, Share2, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

const FormBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClarification, setShowClarification] = useState(false);
  const [clarificationData, setClarificationData] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (id) {
      fetchForm();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchForm = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/forms/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setForm(data);
      } else {
        toast.error('Failed to load form');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateForm = async (description, formTitle = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate-schema`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ description, title: formTitle })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.followups && data.followups.length > 0) {
          setClarificationData(data);
          setShowClarification(true);
        } else {
          // For new forms, the API returns only the schema data (no ID until saved)
          console.log('Form generated successfully:', data);
          // Set the form title if provided
          if (formTitle) {
            data.title = formTitle;
          }
          setForm(data);
          toast.success('Schema generated successfully - Click "Save Draft" or "Publish" to save');
        }
      } else {
        toast.error(data.error || 'Failed to generate form');
      }
    } catch (error) {
      console.error('Error generating form:', error);
      toast.error('Network error');
    }
  };

  const handleClarificationResponse = async (response) => {
    setShowClarification(false);
    // For now, just use the original schema
    // In a real implementation, you'd send the clarification response back to the API
    setForm(clarificationData);
    toast.success('Form updated based on your clarification');
  };

  const handleSaveDraft = async () => {
    if (!form) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/forms/save-draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          schema: form.schema,
          uiSchema: form.uiSchema
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update the form with the saved ID
        setForm({ ...form, id: data.id });
        toast.success('Saved as Draft — you can edit later');
      } else {
        toast.error(data.error || 'Failed to save draft');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Network error');
    }
  };

  const handlePublish = async () => {
    if (!form) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/forms/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          schema: form.schema,
          uiSchema: form.uiSchema,
          formId: form.id // Include form ID if it exists (for updating existing forms)
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update the form with the saved ID and published status
        setForm({ ...form, id: data.id, status: 'PUBLISHED', isPublic: true });
        toast.success('Published — Link copied to clipboard');
        navigator.clipboard.writeText(data.publicUrl);
        navigate('/dashboard');
      } else {
        toast.error(data.error || 'Failed to publish form');
      }
    } catch (error) {
      console.error('Error publishing form:', error);
      toast.error('Network error');
    }
  };

  const handleExportHTML = () => {
    // Generate HTML export
    const htmlContent = generateHTMLExport(form);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Static HTML exported — embed this on any site');
  };

  const generateHTMLExport = (form) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${form.title}</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@rjsf/core@5/dist/react-jsonschema-form.js"></script>
    <script src="https://unpkg.com/@rjsf/utils@5/dist/react-jsonschema-form-utils.js"></script>
    <script src="https://unpkg.com/@rjsf/validator-ajv8@5/dist/react-jsonschema-form-validator-ajv8.js"></script>
    <script src="https://unpkg.com/@rjsf/mui@5/dist/react-jsonschema-form-mui.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        h1 { color: #1f2937; margin-bottom: 20px; }
        .submit-btn { background: #4f46e5; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; }
        .submit-btn:hover { background: #4338ca; }
        .success { background: #d1fae5; color: #065f46; padding: 12px; border-radius: 6px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${form.title}</h1>
        <div id="form-container"></div>
    </div>
    
    <script>
        const schema = ${JSON.stringify(form.schema)};
        const uiSchema = ${JSON.stringify(form.uiSchema)};
        
        const Form = React.createElement(ReactJsonSchemaForm.default, {
            schema: schema,
            uiSchema: uiSchema,
            onSubmit: (data) => {
                fetch('${import.meta.env.VITE_API_URL}/api/save-response', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        formId: '${form.id}',
                        formData: data.formData
                    })
                }).then(() => {
                    document.getElementById('form-container').innerHTML = '<div class="success">Thank you! Your response has been submitted.</div>';
                });
            }
        });
        
        ReactDOM.render(Form, document.getElementById('form-container'));
    </script>
</body>
</html>`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {id ? 'Edit Form' : 'Create New Form'}
              </h1>
            </div>
            
            {form && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowSettings(true)}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Settings
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={handlePublish}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Publish</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FormBuilder
          form={form}
          onGenerate={handleGenerateForm}
          onFormChange={setForm}
        />
      </div>

      {/* Clarification Modal */}
      {showClarification && (
        <ClarificationModal
          data={clarificationData}
          onResponse={handleClarificationResponse}
          onClose={() => setShowClarification(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && form && (
        <FormSettings
          form={form}
          onClose={() => setShowSettings(false)}
          onSave={(updatedForm) => {
            setForm(updatedForm);
            setShowSettings(false);
          }}
        />
      )}
    </div>
  );
};

export default FormBuilderPage;