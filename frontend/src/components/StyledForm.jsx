import React from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { getTemplateById } from '../config/templates';

const StyledForm = ({ form, template, onSubmit, onFormChange }) => {
  if (!form || !form.schema) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">No form data available</div>
      </div>
    );
  }

  const selectedTemplate = getTemplateById(template?.id || 'modern');

  // Custom widgets for different field types
  const widgets = {
    TextWidget: (props) => (
      <input
        {...props}
        className={selectedTemplate.styles.input}
        style={{ 
          backgroundColor: selectedTemplate.colors.surface,
          borderColor: selectedTemplate.colors.border,
          color: selectedTemplate.colors.text
        }}
      />
    ),
    TextareaWidget: (props) => (
      <textarea
        {...props}
        className={selectedTemplate.styles.textarea}
        style={{ 
          backgroundColor: selectedTemplate.colors.surface,
          borderColor: selectedTemplate.colors.border,
          color: selectedTemplate.colors.text
        }}
      />
    ),
    SelectWidget: (props) => (
      <select
        {...props}
        className={selectedTemplate.styles.select}
        style={{ 
          backgroundColor: selectedTemplate.colors.surface,
          borderColor: selectedTemplate.colors.border,
          color: selectedTemplate.colors.text
        }}
      >
        {props.options.enumOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ),
    CheckboxWidget: (props) => (
      <div className="flex items-center space-x-2">
        <input
          {...props}
          type="checkbox"
          className={selectedTemplate.styles.checkbox}
          style={{ 
            accentColor: selectedTemplate.colors.primary
          }}
        />
        <label className="text-sm font-medium" style={{ color: selectedTemplate.colors.text }}>
          {props.label}
        </label>
      </div>
    ),
    RadioWidget: (props) => (
      <div className="space-y-2">
        {props.options.enumOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              {...props}
              type="radio"
              value={option.value}
              checked={props.value === option.value}
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
    ),
    CheckboxesWidget: (props) => (
      <div className="space-y-2">
        {props.options.enumOptions.map((option) => (
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
    )
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

  return (
    <div className="w-full">
      <Form
        schema={form.schema}
        uiSchema={form.uiSchema}
        formData={form.formData || {}}
        onChange={onFormChange}
        onSubmit={onSubmit}
        validator={validator}
        widgets={widgets}
        templates={{
          FieldTemplate,
          ObjectFieldTemplate
        }}
        showErrorList={false}
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
};

export default StyledForm;
