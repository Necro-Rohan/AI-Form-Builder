import express from "express";
import cors from "cors";
import "dotenv/config";
import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import qrcode from "qrcode";
import { createClient } from "@supabase/supabase-js";

// Check if required environment variables are present
console.log("🔍 Environment variables check:");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✅ Present" : "❌ Missing");
console.log("DIRECT_URL:", process.env.DIRECT_URL ? "✅ Present" : "❌ Missing");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Present" : "❌ Missing");
console.log("OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY ? "✅ Present" : "❌ Missing");

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is required");
  process.exit(1);
}

// --- Initialize Express App ---
const app = express();
const PORT = process.env.PORT || 3000;


console.log("API Key being used:", process.env.OPENROUTER_API_KEY);

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', // Added port 5174
    'http://localhost:3000',
    'https://ai-form-builder-s4hj.onrender.com',
    'https://ai-form-builder2.vercel.app', // Vercel frontend
    'https://your-frontend-domain.com' // Add your production frontend URL here
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize OpenAI (OpenRouter)
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "AI Dynamic Form Builder",
  },
});

// Initialize Prisma Client
const prisma = new PrismaClient();

// Test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 To fix this issue:');
    console.log('1. Install PostgreSQL locally: brew install postgresql');
    console.log('2. Start PostgreSQL: brew services start postgresql');
    console.log('3. Create database: createdb form_builder');
    console.log('4. Or use a free cloud database: https://neon.tech');
    process.exit(1);
  }
}

// Test connection on startup
testDatabaseConnection();

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || "https://your-project.supabase.co",
  process.env.SUPABASE_ANON_KEY || "your-anon-key"
);

// Initialize Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// -------------------- Authentication Routes --------------------

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    
    res.json({
      message: "User created successfully",
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    
    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Get user info
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

// -------------------- Form Management Routes --------------------

// Get user's forms
app.get("/api/forms", authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    const where = { userId: req.user.id };
    
    if (status) {
      where.status = status.toUpperCase();
    }

    const forms = await prisma.form.findMany({
      where,
      include: {
        _count: {
          select: { responses: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ error: "Failed to fetch forms" });
  }
});

// Get single form
app.get("/api/forms/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const form = await prisma.form.findFirst({
      where: { 
        id,
        userId: req.user.id
      },
      include: {
        responses: true,
        user: {
          select: { name: true, email: true }
        }
      }
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ error: "Failed to fetch form" });
  }
});

// Update form
app.put("/api/forms/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, schema, uiSchema, status, isPublic, password, collectIp, notifyEmail } = req.body;
    
    const form = await prisma.form.findFirst({
      where: { 
        id,
        userId: req.user.id
      }
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const updatedForm = await prisma.form.update({
      where: { id },
      data: {
        title,
        description,
        schema,
        uiSchema,
        status,
        isPublic,
        password,
        collectIp,
        notifyEmail,
        publishedAt: status === 'PUBLISHED' ? new Date() : form.publishedAt
      }
    });

    res.json(updatedForm);
  } catch (error) {
    console.error("Error updating form:", error);
    res.status(500).json({ error: "Failed to update form" });
  }
});

// Delete form
app.delete("/api/forms/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const form = await prisma.form.findFirst({
      where: { 
        id,
        userId: req.user.id
      }
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    await prisma.form.delete({
      where: { id }
    });

    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).json({ error: "Failed to delete form" });
  }
});

// -------------------- Generate Schema --------------------
app.post("/api/generate-schema", authenticateToken, async (req, res) => {
  const { description, formTitle } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    // Enhanced AI-powered schema generation
    let generatedJson = {
      schema: {
        type: "object",
        properties: {},
        required: []
      },
      uiSchema: {},
      followups: []
    };

    // Use AI to generate better form schemas
    const aiPrompt = `You are an expert form builder. Generate a JSON schema for a form based on this description: "${description}"

Requirements:
1. Create appropriate form fields based on the description
2. Use proper field types (string, email, number, integer, boolean, array, select)
3. Add appropriate validation (required fields, formats, min/max values)
4. Generate user-friendly titles and placeholders
5. For select/dropdown fields, provide relevant options
6. For multi-select fields, use array type with enum items
7. Consider the context and purpose of the form

Return ONLY a valid JSON object with this exact structure:
{
  "schema": {
    "type": "object",
    "properties": {
      "fieldName": {
        "type": "string|number|integer|boolean|array",
        "title": "User Friendly Title",
        "format": "email|date|url (if applicable)",
        "enum": ["option1", "option2"] (for select fields),
        "minimum": 0 (for numbers),
        "maximum": 100 (for numbers)
      }
    },
    "required": ["fieldName1", "fieldName2"]
  },
  "uiSchema": {
    "fieldName": {
      "ui:placeholder": "Helpful placeholder text",
      "ui:widget": "select|textarea|checkbox|range (if applicable)"
    }
  }
}

Examples:
- "Contact form: name, email, subject, message" → name (string), email (email), subject (string), message (textarea)
- "Survey: age, gender, interests" → age (integer), gender (select), interests (array)
- "Event registration: name, email, t-shirt size, dietary restrictions" → name, email, tshirtSize (select), dietaryRestrictions (textarea)

Generate the schema now:`;

    try {
      const openaiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
          'X-Title': 'Dynamic Form Builder'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
      messages: [
            {
              role: 'user',
              content: aiPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      if (openaiResponse.ok) {
        const aiData = await openaiResponse.json();
        const aiContent = aiData.choices[0].message.content.trim();
        
        // Try to parse the AI response as JSON
        try {
          // Clean the AI response by removing markdown formatting
          let cleanedContent = aiContent;
          if (cleanedContent.includes('```json')) {
            cleanedContent = cleanedContent.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
          }
          if (cleanedContent.includes('```')) {
            cleanedContent = cleanedContent.replace(/```\s*/g, '');
          }
          
          const aiGenerated = JSON.parse(cleanedContent.trim());
          if (aiGenerated.schema && aiGenerated.uiSchema) {
            generatedJson = aiGenerated;
            console.log('AI-generated schema:', generatedJson);
          } else {
            throw new Error('Invalid AI response structure');
          }
        } catch (parseError) {
          console.log('AI response parsing failed, using fallback:', parseError.message);
          console.log('AI response:', aiContent);
          // Fall back to keyword-based generation
          generatedJson = await generateFallbackSchema(description);
        }
      } else {
        console.log('AI API failed, using fallback');
        generatedJson = await generateFallbackSchema(description);
      }
    } catch (aiError) {
      console.log('AI generation error, using fallback:', aiError.message);
      generatedJson = await generateFallbackSchema(description);
    }

    // Fallback to keyword-based generation if AI fails
    async function generateFallbackSchema(description) {
      const lowerDesc = description.toLowerCase();
      const fallbackJson = {
        schema: {
          type: "object",
          properties: {},
          required: []
        },
        uiSchema: {},
        followups: []
      };
    
      // Name field - more comprehensive detection
      if (lowerDesc.includes('name') || lowerDesc.includes('full name') || lowerDesc.includes('first name') || lowerDesc.includes('last name')) {
        fallbackJson.schema.properties.name = {
          type: "string",
          title: "Name"
        };
        fallbackJson.uiSchema.name = {
          "ui:placeholder": "Enter your full name"
        };
        fallbackJson.schema.required.push("name");
      }

      // Email field - more comprehensive detection
      if (lowerDesc.includes('email') || lowerDesc.includes('e-mail') || lowerDesc.includes('email address')) {
        fallbackJson.schema.properties.email = {
          type: "string",
          format: "email",
          title: "Email"
        };
        fallbackJson.uiSchema.email = {
          "ui:placeholder": "Enter your email address"
        };
        fallbackJson.schema.required.push("email");
      }

      // Phone field - more comprehensive detection
      if (lowerDesc.includes('phone') || lowerDesc.includes('mobile') || lowerDesc.includes('contact') || lowerDesc.includes('number')) {
        fallbackJson.schema.properties.phone = {
          type: "string",
          title: "Phone Number"
        };
        fallbackJson.uiSchema.phone = {
          "ui:placeholder": "Enter your phone number"
        };
        if (!lowerDesc.includes('optional')) {
          fallbackJson.schema.required.push("phone");
        }
      }

      // College field - more comprehensive detection
      if (lowerDesc.includes('college') || lowerDesc.includes('university') || lowerDesc.includes('school') || lowerDesc.includes('institution')) {
        fallbackJson.schema.properties.college = {
          type: "string",
          title: "College/University"
        };
        fallbackJson.uiSchema.college = {
          "ui:placeholder": "Enter your college or university"
        };
        fallbackJson.schema.required.push("college");
      }

      // GitHub field - more comprehensive detection
      if (lowerDesc.includes('github') || lowerDesc.includes('git') || lowerDesc.includes('username')) {
        fallbackJson.schema.properties.github = {
          type: "string",
          title: "GitHub Username"
        };
        fallbackJson.uiSchema.github = {
          "ui:placeholder": "Enter your GitHub username"
        };
        fallbackJson.schema.required.push("github");
      }

      // T-shirt size - more comprehensive detection
      if (lowerDesc.includes('t-shirt') || lowerDesc.includes('tshirt') || lowerDesc.includes('shirt size') || lowerDesc.includes('size')) {
        fallbackJson.schema.properties.tshirtSize = {
          type: "string",
          title: "T-shirt Size",
          enum: ["S", "M", "L", "XL", "XXL"]
        };
        fallbackJson.uiSchema.tshirtSize = {
          "ui:widget": "select"
        };
        fallbackJson.schema.required.push("tshirtSize");
      }

      // Rating field - for feedback forms
      if (lowerDesc.includes('rating') || lowerDesc.includes('rate') || lowerDesc.includes('score')) {
        fallbackJson.schema.properties.rating = {
          type: "integer",
          title: "Rating",
          minimum: 1,
          maximum: 5
        };
        fallbackJson.uiSchema.rating = {
          "ui:widget": "range"
        };
        fallbackJson.schema.required.push("rating");
      }

      // Comments field - for feedback forms
      if (lowerDesc.includes('comments') || lowerDesc.includes('feedback') || lowerDesc.includes('suggestions') || lowerDesc.includes('message')) {
        fallbackJson.schema.properties.comments = {
          type: "string",
          title: "Comments"
        };
        fallbackJson.uiSchema.comments = {
          "ui:widget": "textarea",
          "ui:placeholder": "Enter your comments or feedback"
        };
        fallbackJson.schema.required.push("comments");
      }

      // Would recommend field - for feedback forms
      if (lowerDesc.includes('recommend') || lowerDesc.includes('would recommend')) {
        fallbackJson.schema.properties.wouldRecommend = {
          type: "boolean",
          title: "Would you recommend this to others?"
        };
        fallbackJson.uiSchema.wouldRecommend = {
          "ui:widget": "radio"
        };
        fallbackJson.schema.required.push("wouldRecommend");
      }

      // Improvements field - for feedback forms
      if (lowerDesc.includes('improvements') || lowerDesc.includes('improve') || lowerDesc.includes('better')) {
        fallbackJson.schema.properties.improvements = {
          type: "string",
          title: "What could be improved?"
        };
        fallbackJson.uiSchema.improvements = {
          "ui:widget": "textarea",
          "ui:placeholder": "What improvements would you suggest?"
        };
        fallbackJson.schema.required.push("improvements");
      }

      // Age field - for surveys
      if (lowerDesc.includes('age')) {
        fallbackJson.schema.properties.age = {
          type: "integer",
          title: "Age",
          minimum: 1,
          maximum: 120
        };
        fallbackJson.uiSchema.age = {
          "ui:placeholder": "Enter your age"
        };
        fallbackJson.schema.required.push("age");
      }

      // Gender field - for surveys
      if (lowerDesc.includes('gender')) {
        fallbackJson.schema.properties.gender = {
          type: "string",
          title: "Gender",
          enum: ["Male", "Female", "Other", "Prefer not to say"]
        };
        fallbackJson.uiSchema.gender = {
          "ui:widget": "select"
        };
        fallbackJson.schema.required.push("gender");
      }

      // Interests field - for surveys
      if (lowerDesc.includes('interests') || lowerDesc.includes('hobbies')) {
        fallbackJson.schema.properties.interests = {
          type: "array",
          title: "Interests",
          items: {
            type: "string",
            enum: ["Technology", "Sports", "Music", "Art", "Reading", "Travel", "Gaming", "Cooking"]
          }
        };
        fallbackJson.uiSchema.interests = {
          "ui:widget": "checkboxes"
        };
        fallbackJson.schema.required.push("interests");
      }

      // Favorite color field - for surveys
      if (lowerDesc.includes('favorite color') || lowerDesc.includes('color')) {
        fallbackJson.schema.properties.favoriteColor = {
          type: "string",
          title: "Favorite Color",
          enum: ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Black", "White"]
        };
        fallbackJson.uiSchema.favoriteColor = {
          "ui:widget": "select"
        };
        fallbackJson.schema.required.push("favoriteColor");
      }

      // Newsletter signup field - for surveys
      if (lowerDesc.includes('newsletter') || lowerDesc.includes('subscribe') || lowerDesc.includes('updates')) {
        fallbackJson.schema.properties.newsletterSignup = {
          type: "boolean",
          title: "Subscribe to newsletter"
        };
        fallbackJson.uiSchema.newsletterSignup = {
          "ui:widget": "checkbox"
        };
        // Newsletter signup is usually optional
      }

      // Check for contradictions
      if (lowerDesc.includes('anonymous') && lowerDesc.includes('phone')) {
        fallbackJson.followups.push({
          type: "contradiction",
          message: "You asked for anonymous responses and to collect phone numbers. How should we handle this?",
          options: [
            { id: "mask", label: "Mask phone (store last 4 digits)", description: "Phone numbers will be partially hidden in responses" },
            { id: "encrypt", label: "Encrypt & store (PII)", description: "Full phone numbers stored securely" },
            { id: "remove", label: "Don't collect phone", description: "Remove phone field from form" }
          ]
        });
      }

      return fallbackJson;
    }

    // Return the generated schema without saving to database
    // Form will only be saved when user clicks "Save Draft" or "Publish"
    return res.status(200).json({ ...generatedJson });
  } catch (error) {
    console.error("Error generating schema:", error);
    return res.status(500).json({ error: "Failed to generate form schema.", details: error.message });
  }
});

// -------------------- Save Draft Route --------------------
app.post("/api/forms/save-draft", authenticateToken, async (req, res) => {
  try {
    const { title, description, schema, uiSchema } = req.body;

    if (!title || !schema) {
      return res.status(400).json({ error: "Title and schema are required" });
    }

    const savedForm = await prisma.form.create({
      data: {
        title: title,
        description: description || '',
        schema: schema,
        uiSchema: uiSchema || {},
        userId: req.user.id,
        status: 'DRAFT'
      },
    });

    return res.status(200).json({ 
      id: savedForm.id, 
      message: "Form saved as draft successfully",
      form: savedForm 
    });
  } catch (error) {
    console.error("Error saving draft:", error);
    return res.status(500).json({ error: "Failed to save draft", details: error.message });
  }
});

// -------------------- Publish Form Route --------------------
app.post("/api/forms/publish", authenticateToken, async (req, res) => {
  try {
    const { title, description, schema, uiSchema, formId } = req.body;

    if (!title || !schema) {
      return res.status(400).json({ error: "Title and schema are required" });
    }

    let savedForm;
    
    if (formId) {
      // Update existing form
      savedForm = await prisma.form.update({
        where: { 
          id: formId,
          userId: req.user.id 
        },
        data: {
          title: title,
          description: description || '',
          schema: schema,
          uiSchema: uiSchema || {},
          status: 'PUBLISHED',
          isPublic: true,
          publishedAt: new Date()
        },
      });
    } else {
      // Create new form
      savedForm = await prisma.form.create({
        data: {
          title: title,
          description: description || '',
          schema: schema,
          uiSchema: uiSchema || {},
          userId: req.user.id,
          status: 'PUBLISHED',
          isPublic: true,
          publishedAt: new Date()
        },
      });
    }

    return res.status(200).json({ 
      id: savedForm.id, 
      message: "Form published successfully",
      form: savedForm,
      publicUrl: `${process.env.FRONTEND_URL}/public/${savedForm.id}`
    });
  } catch (error) {
    console.error("Error publishing form:", error);
    return res.status(500).json({ error: "Failed to publish form", details: error.message });
  }
});

// -------------------- Responses Routes --------------------

// Get responses for a specific form
app.get("/api/forms/:id/responses", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50, search } = req.query;
    
    // First verify the user owns this form
    const form = await prisma.form.findFirst({
      where: { 
        id,
        userId: req.user.id
      }
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found or access denied" });
    }

    // Build where clause for responses
    const where = { formId: id };
    
    // Add search functionality
    if (search) {
      where.OR = [
        {
          data: {
            path: [],
            string_contains: search
          }
        }
      ];
    }

    const responses = await prisma.response.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    const totalCount = await prisma.response.count({ where });

    res.json({
      responses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching responses:", error);
    res.status(500).json({ error: "Failed to fetch responses" });
  }
});

// Delete a specific response
app.delete("/api/responses/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // First get the response to check ownership
    const response = await prisma.response.findUnique({
      where: { id },
      include: {
        form: {
          select: { userId: true }
        }
      }
    });

    if (!response) {
      return res.status(404).json({ error: "Response not found" });
    }

    if (response.form.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    await prisma.response.delete({
      where: { id }
    });

    res.json({ message: "Response deleted successfully" });
  } catch (error) {
    console.error("Error deleting response:", error);
    res.status(500).json({ error: "Failed to delete response" });
  }
});

// Export responses as CSV
app.get("/api/forms/:id/export/csv", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const form = await prisma.form.findFirst({
      where: {
        id,
        userId: req.user.id
      },
      include: { responses: true }
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const csv = generateCSV(form);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_responses.csv"`);
    res.send(csv);
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).json({ error: "Failed to export CSV" });
  }
});

// Generate QR code for form
app.get("/api/forms/:id/qr", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const form = await prisma.form.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const formUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/f/${id}`;
    const qrCode = await qrcode.toDataURL(formUrl);
    
    res.json({ qrCode, formUrl });
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

// -------------------- Save Response --------------------
app.post("/api/save-response", async (req, res) => {
  try {
    const { formId, formData } = req.body;

    if (!formId || !formData) {
      return res.status(400).json({ error: "formId and formData are required" });
    }

    // Check if the form exists and is public
    const form = await prisma.form.findUnique({
      where: { 
        id: formId,
        isPublic: true,
        status: 'PUBLISHED'
      }
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found or not public" });
    }

    const savedResponse = await prisma.response.create({
      data: {
        formId: formId,
        data: formData,
      },
    });

    return res.status(200).json({ message: "Response saved successfully!", responseId: savedResponse.id });
  } catch (error) {
    console.error("Error saving response:", error);
    return res.status(500).json({ error: "Failed to save response.", details: error.message });
  }
});

// -------------------- Fetch Form with Responses --------------------
app.get("/api/forms/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const formWithResponses = await prisma.form.findUnique({
      where: { id },
      include: { responses: true },
    });

    if (!formWithResponses) {
      return res.status(404).json({ error: "Form not found" });
    }

    return res.status(200).json(formWithResponses);
  } catch (error) {
    console.error("Error fetching form:", error);
    return res.status(500).json({ error: "Failed to fetch form." });
  }
});

// Helper function to generate CSV
function generateCSV(form) {
  if (!form.responses.length) {
    return 'No responses found';
  }
  
  const headers = Object.keys(form.responses[0].data);
  const csvRows = [
    ['Timestamp', ...headers].join(','),
    ...form.responses.map(response => [
      new Date(response.createdAt).toISOString(),
      ...headers.map(header => {
        const value = response.data[header];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      })
    ])
  ];
  
  return csvRows.join('\n');
}

// Public form endpoint (no authentication required)
app.get("/api/public/forms/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const form = await prisma.form.findUnique({
      where: { 
        id,
        isPublic: true
      }
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found or not public" });
    }

    res.json(form);
  } catch (error) {
    console.error("Error fetching public form:", error);
    res.status(500).json({ error: "Failed to fetch form" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
