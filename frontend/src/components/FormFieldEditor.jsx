import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Eye, EyeOff, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';

// Sortable Field Item Component
const SortableFieldItem = ({ fieldKey, fieldSchema, isRequired, onEdit, onRemove, onToggleRequired, isEditing }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fieldKey });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-gray-200 rounded-lg p-4 mb-3 ${
        isDragging ? 'shadow-lg' : 'shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">
                {fieldSchema.title || fieldKey}
              </span>
              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                {fieldSchema.type}
              </span>
              {isRequired && (
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                  Required
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleRequired(fieldKey)}
            className={`p-1 rounded ${
              isRequired
                ? 'text-red-600 hover:bg-red-100'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={isRequired ? 'Make optional' : 'Make required'}
          >
            {isRequired ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onEdit(fieldKey)}
            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
            title="Edit field"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRemove(fieldKey)}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
            title="Remove field"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const FormFieldEditor = ({ form, onFormChange }) => {
  const [editingField, setEditingField] = useState(null);
  const [showAddField, setShowAddField] = useState(false);
  const [newField, setNewField] = useState({
    key: '',
    title: '',
    type: 'string',
    required: false,
    placeholder: '',
    options: []
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end for field reordering
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const schema = form.schema || {};
      const properties = schema.properties || {};
      const required = schema.required || [];
      
      // Get current field order
      const fieldKeys = Object.keys(properties);
      const oldIndex = fieldKeys.indexOf(active.id);
      const newIndex = fieldKeys.indexOf(over.id);
      
      // Reorder the fields
      const newFieldKeys = arrayMove(fieldKeys, oldIndex, newIndex);
      
      // Create new properties object with reordered fields
      const newProperties = {};
      newFieldKeys.forEach(key => {
        newProperties[key] = properties[key];
      });
      
      // Update the form schema
      const updatedSchema = {
        ...schema,
        properties: newProperties
      };
      
      // Update the UI schema to match the new order
      const updatedUiSchema = { ...(form.uiSchema || {}) };
      
      onFormChange({
        ...form,
        schema: updatedSchema,
        uiSchema: updatedUiSchema
      });
      
      toast.success('Field order updated');
    }
  };

  // Safety check
  if (!form || !form.schema) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8 text-gray-500">
          <p>No form data available for editing.</p>
        </div>
      </div>
    );
  }

  const fieldTypes = [
    { value: 'string', label: 'Text Input' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
    { value: 'integer', label: 'Integer' },
    { value: 'boolean', label: 'Checkbox' },
    { value: 'array', label: 'Multi-select' },
    { value: 'select', label: 'Dropdown' }
  ];

  const addField = () => {
    if (!newField.key || !newField.title) {
      toast.error('Please fill in field key and title');
      return;
    }

    const fieldKey = newField.key.toLowerCase().replace(/\s+/g, '');
    const updatedSchema = { ...schema };
    const updatedUiSchema = { ...(form.uiSchema || {}) };

    // Add to schema
    updatedSchema.properties[fieldKey] = {
      type: newField.type === 'select' ? 'string' : newField.type,
      title: newField.title,
      ...(newField.type === 'select' && { enum: newField.options }),
      ...(newField.type === 'array' && {
        items: { type: 'string', enum: newField.options }
      })
    };

    if (newField.required) {
      updatedSchema.required = [...(updatedSchema.required || []), fieldKey];
    }

    // Add to UI schema
    updatedUiSchema[fieldKey] = {
      'ui:placeholder': newField.placeholder || `Enter ${newField.title.toLowerCase()}`,
      ...(newField.type === 'select' && { 'ui:widget': 'select' }),
      ...(newField.type === 'array' && { 'ui:widget': 'checkboxes' }),
      ...(newField.type === 'boolean' && { 'ui:widget': 'checkbox' })
    };

    onFormChange({
      ...form,
      schema: updatedSchema,
      uiSchema: updatedUiSchema
    });

    setNewField({
      key: '',
      title: '',
      type: 'string',
      required: false,
      placeholder: '',
      options: []
    });
    setShowAddField(false);
    toast.success('Field added successfully');
  };

  const removeField = (fieldKey) => {
    const updatedSchema = { ...schema };
    const updatedUiSchema = { ...(form.uiSchema || {}) };

    delete updatedSchema.properties[fieldKey];
    updatedSchema.required = (updatedSchema.required || []).filter(key => key !== fieldKey);
    delete updatedUiSchema[fieldKey];

    onFormChange({
      ...form,
      schema: updatedSchema,
      uiSchema: updatedUiSchema
    });

    toast.success('Field removed successfully');
  };

  const toggleFieldRequired = (fieldKey) => {
    const updatedSchema = { ...schema };
    const required = updatedSchema.required || [];
    
    if (required.includes(fieldKey)) {
      updatedSchema.required = required.filter(key => key !== fieldKey);
    } else {
      updatedSchema.required = [...required, fieldKey];
    }

    onFormChange({
      ...form,
      schema: updatedSchema
    });
  };

  const updateFieldTitle = (fieldKey, newTitle) => {
    const updatedSchema = { ...schema };
    updatedSchema.properties[fieldKey].title = newTitle;

    onFormChange({
      ...form,
      schema: updatedSchema
    });
  };

  // Ensure schema has properties
  const schema = form.schema || {};
  if (!schema.properties) {
    schema.properties = {};
  }
  
  const fields = Object.entries(schema.properties);
  
  // Debug logging
  console.log('FormFieldEditor - form:', form);
  console.log('FormFieldEditor - form.schema:', form.schema);
  console.log('FormFieldEditor - schema.properties:', schema.properties);
  console.log('FormFieldEditor - fields:', fields);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Form Fields</h3>
        <button
          onClick={() => setShowAddField(!showAddField)}
          className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Field</span>
        </button>
      </div>

      {/* Add Field Form */}
      {showAddField && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Field</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Key
              </label>
              <input
                type="text"
                value={newField.key}
                onChange={(e) => setNewField({ ...newField, key: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="e.g., full_name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Title
              </label>
              <input
                type="text"
                value={newField.title}
                onChange={(e) => setNewField({ ...newField, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="e.g., Full Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Type
              </label>
              <select
                value={newField.type}
                onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {fieldTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placeholder
              </label>
              <input
                type="text"
                value={newField.placeholder}
                onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Enter placeholder text"
              />
            </div>
            {(newField.type === 'select' || newField.type === 'array') && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options (one per line)
                </label>
                <textarea
                  value={newField.options.join('\n')}
                  onChange={(e) => setNewField({ ...newField, options: e.target.value.split('\n').filter(opt => opt.trim()) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows="3"
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                />
              </div>
            )}
            <div className="md:col-span-2 flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newField.required}
                  onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Required field</span>
              </label>
            </div>
            <div className="md:col-span-2 flex space-x-2">
              <button
                onClick={addField}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Add Field
              </button>
              <button
                onClick={() => setShowAddField(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fields List with Drag and Drop */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
          <GripVertical className="w-4 h-4" />
          <span>Drag fields to reorder them</span>
        </div>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={fields.map(([fieldKey]) => fieldKey)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {fields.map(([fieldKey, fieldSchema]) => (
              <SortableFieldItem
                key={fieldKey}
                fieldKey={fieldKey}
                fieldSchema={fieldSchema}
                isRequired={schema.required?.includes(fieldKey)}
                onEdit={(key) => setEditingField(editingField === key ? null : key)}
                onRemove={removeField}
                onToggleRequired={toggleFieldRequired}
                isEditing={editingField === fieldKey}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {fields.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No fields added yet. Click "Add Field" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default FormFieldEditor;
