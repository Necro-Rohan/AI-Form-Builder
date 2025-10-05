import React from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { getTemplateById } from '../config/templates';

// Custom validator that's more lenient
const customValidator = {
  ...validator,
  validateFormData: (formData, schema) => {
    // Return empty errors array to disable validation
    return { errors: [] };
  }
};

const StyledForm = ({ form, template, onSubmit, onFormChange }) => {
  if (!form || !form.schema) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">No form data available</div>
      </div>
    );
  }

  // Ensure schema is valid
  const safeSchema = {
    type: "object",
    properties: form.schema.properties || {},
    required: form.schema.required || []
  };

  const safeUiSchema = form.uiSchema || {};

  const selectedTemplate = getTemplateById(template?.id || 'modern');

  // Custom widgets for different field types
  const widgets = {
    TextWidget: (props) => {
      const { value, onChange, onBlur, onFocus, disabled, readonly, placeholder, ...domProps } = props;
      return (
        <input
          {...domProps}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          readOnly={readonly}
          placeholder={placeholder}
          className={selectedTemplate.styles.input}
          style={{ 
            backgroundColor: selectedTemplate.colors.surface,
            borderColor: selectedTemplate.colors.border,
            color: selectedTemplate.colors.text
          }}
        />
      );
    },
    TextareaWidget: (props) => {
      const { value, onChange, onBlur, onFocus, disabled, readonly, placeholder, ...domProps } = props;
      return (
        <textarea
          {...domProps}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          readOnly={readonly}
          placeholder={placeholder}
          className={selectedTemplate.styles.textarea}
          style={{ 
            backgroundColor: selectedTemplate.colors.surface,
            borderColor: selectedTemplate.colors.border,
            color: selectedTemplate.colors.text
          }}
        />
      );
    },
    SelectWidget: (props) => {
      const { value, onChange, onBlur, onFocus, disabled, readonly, options, ...domProps } = props;
      const enumOptions = options?.enumOptions || [];
      return (
        <select
          {...domProps}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          readOnly={readonly}
          className={selectedTemplate.styles.select}
          style={{ 
            backgroundColor: selectedTemplate.colors.surface,
            borderColor: selectedTemplate.colors.border,
            color: selectedTemplate.colors.text
          }}
        >
          {enumOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    },
    CheckboxWidget: (props) => {
      const { value, onChange, onBlur, onFocus, disabled, readonly, label, ...domProps } = props;
      return (
        <div className="flex items-center space-x-2">
          <input
            {...domProps}
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
            readOnly={readonly}
            className={selectedTemplate.styles.checkbox}
            style={{ 
              accentColor: selectedTemplate.colors.primary
            }}
          />
          <label className="text-sm font-medium" style={{ color: selectedTemplate.colors.text }}>
            {label}
          </label>
        </div>
      );
    },
    RadioWidget: (props) => {
      const { value, onChange, onBlur, onFocus, disabled, readonly, options, ...domProps } = props;
      const enumOptions = options?.enumOptions || [];
      return (
        <div className="space-y-2">
          {enumOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <input
                {...domProps}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                onFocus={onFocus}
                disabled={disabled}
                readOnly={readonly}
                className={selectedTemplate.styles.radio}
                style={{ 
                  accentColor: selectedTemplate.colors.primary
                }}
              />
              <label className="text-sm font-medium" style={{ color: selectedTemplate.colors.text }}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
      );
    },
    CheckboxesWidget: (props) => {
      const options = props.options?.enumOptions || [];
      return (
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={option.value}
                checked={props.value?.includes(option.value) || false}
                onChange={(e) => {
                  const newValue = e.target.checked
                    ? [...(props.value || []), option.value]
                    : (props.value || []).filter(v => v !== option.value);
                  props.onChange(newValue);
                }}
                className={selectedTemplate.styles.checkbox}
                style={{ 
                  accentColor: selectedTemplate.colors.primary
                }}
              />
              <label className="text-sm font-medium" style={{ color: selectedTemplate.colors.text }}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
      );
    }
  };

  // Custom field template
  const FieldTemplate = (props) => {
    const { id, classNames, style, children, errors, help, description, hidden, required, displayLabel } = props;
    const { schema, uiSchema } = props;

    if (hidden) {
      return <div className="hidden">{children}</div>;
    }

    return (
      <div className={selectedTemplate.styles.fieldGroup}>
        {displayLabel && schema.type !== 'boolean' && (
          <label 
            htmlFor={id} 
            className={selectedTemplate.styles.label}
            style={{ color: selectedTemplate.colors.text }}
          >
            {schema.title || id}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {description && (
          <p 
            className={selectedTemplate.styles.help}
            style={{ color: selectedTemplate.colors.textSecondary }}
          >
            {description}
          </p>
        )}
        
        <div className="mt-1">
          {children}
        </div>
        
        {errors && errors.length > 0 && (
          <div className={selectedTemplate.styles.error}>
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}
        
        {help && (
          <p 
            className={selectedTemplate.styles.help}
            style={{ color: selectedTemplate.colors.textSecondary }}
          >
            {help}
          </p>
        )}
      </div>
    );
  };

  // Custom object field template
  const ObjectFieldTemplate = (props) => {
    const { title, description, properties, required, uiSchema, idSchema } = props;

    return (
      <div className={selectedTemplate.styles.container}>
        {title && (
          <h1 
            className={selectedTemplate.styles.title}
            style={{ color: selectedTemplate.colors.text }}
          >
            {title}
          </h1>
        )}
        
        {description && (
          <p 
            className={selectedTemplate.styles.description}
            style={{ color: selectedTemplate.colors.textSecondary }}
          >
            {description}
          </p>
        )}
        
        <div className="space-y-4">
          {properties.map((element) => (
            <div key={element.name}>
              {element.content}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Handle form submission with proper error handling
  const handleFormSubmit = (data) => {
    console.log('StyledForm - Form submission data:', data);
    console.log('StyledForm - onSubmit function:', onSubmit);
    
    // Call the onSubmit handler directly
    if (onSubmit) {
      onSubmit(data);
    } else {
      console.error('No onSubmit handler provided to StyledForm');
    }
  };

  try {
    return (
      <div className="w-full">
        <Form
          schema={safeSchema}
          uiSchema={safeUiSchema}
          formData={form.formData || {}}
          onChange={onFormChange}
          onSubmit={handleFormSubmit}
          validator={customValidator}
          widgets={widgets}
          templates={{
            FieldTemplate,
            ObjectFieldTemplate
          }}
          showErrorList={false}
          noHtml5Validate={true}
          liveValidate={false}
          validate={false}
        >
          <div className="mt-8">
            <button
              type="submit"
              className={selectedTemplate.styles.button}
              style={{ 
                background: selectedTemplate.id === 'creative' 
                  ? 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)'
                  : selectedTemplate.colors.primary
              }}
            >
              Submit Form
            </button>
          </div>
        </Form>
      </div>
    );
  } catch (error) {
    console.error('Form rendering error:', error);
    return (
      <div className="text-center py-12">
        <div className="text-red-500">Error rendering form. Please try again.</div>
        <div className="text-sm text-gray-500 mt-2">Error: {error.message}</div>
      </div>
    );
  }
};

export default StyledForm;
