# 🚀 AI Form Builder

A powerful, AI-driven form builder that creates dynamic forms from natural language descriptions. Built with React, Node.js, and PostgreSQL.

![AI Form Builder](https://img.shields.io/badge/AI-Powered-blue) ![React](https://img.shields.io/badge/React-18.x-61dafb) ![Node.js](https://img.shields.io/badge/Node.js-18.x-339933) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791)

## ✨ Features

### 🤖 AI-Powered Form Generation
- **Natural Language Processing**: Describe your form in plain English
- **Smart Schema Generation**: AI automatically creates form fields and validation rules
- **Intelligent Field Detection**: Automatically detects field types (text, email, select, etc.)
- **Context-Aware Forms**: AI understands the purpose and generates appropriate fields

### 🎨 Beautiful Templates
- **Modern Design**: Clean, professional templates
- **Customizable Themes**: Multiple color schemes and layouts
- **Responsive Design**: Works perfectly on all devices
- **Template Library**: Pre-built templates for common use cases

### 📊 Advanced Form Management
- **Real-time Preview**: See your form as you build it
- **Draft System**: Save work in progress
- **Publish & Share**: Generate public links for form distribution
- **Response Collection**: Collect and manage form submissions
- **Export Data**: Download responses as CSV files

### 🔐 User Authentication
- **Secure Login/Registration**: JWT-based authentication
- **User Dashboard**: Manage all your forms in one place
- **Form Ownership**: Each user owns their created forms
- **Privacy Controls**: Control form visibility and access

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React JSON Schema Form** - Dynamic form rendering
- **React Router** - Client-side routing
- **React Hot Toast** - Beautiful notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma** - Modern database ORM
- **PostgreSQL** - Robust relational database
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **OpenRouter API** - AI integration

### AI Integration
- **OpenRouter** - AI model access
- **GPT-4o-mini** - Form schema generation
- **Natural Language Processing** - Form description parsing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-form-builder.git
   cd ai-form-builder
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd Backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up the database**
   ```bash
   # Run the setup script
   ./setup-database.sh
   
   # Or manually:
   # Install PostgreSQL
   brew install postgresql
   
   # Start PostgreSQL
   brew services start postgresql
   
   # Create database
   createdb form_builder
   
   # Run migrations
   cd Backend
   npx prisma db push
   ```

4. **Configure environment variables**
   
   **Backend (.env)**
   ```env
   DATABASE_URL="postgresql://username@localhost:5432/form_builder"
   DIRECT_URL="postgresql://username@localhost:5432/form_builder"
   JWT_SECRET=your-super-secret-jwt-key-here
   OPENROUTER_API_KEY=your-openrouter-api-key
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend (.env)**
   ```env
   VITE_API_URL=http://localhost:3001
   VITE_NODE_ENV=development
   ```

5. **Start the application**
   ```bash
   # Start backend (Terminal 1)
   cd Backend
   npm start
   
   # Start frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 📖 Usage Guide

### Creating Your First Form

1. **Register/Login** to your account
2. **Click "Create New Form"**
3. **Describe your form** in natural language:
   ```
   "Create a contact form with name, email, subject, and message fields"
   ```
4. **AI generates the form** automatically
5. **Customize** fields, validation, and styling
6. **Preview** your form
7. **Publish** and share the public link

### Example Form Descriptions

- **Event Registration**: "Event registration form with name, email, t-shirt size, dietary restrictions, and emergency contact"
- **Survey**: "Customer satisfaction survey with rating, comments, and demographic questions"
- **Job Application**: "Job application form with personal info, experience, skills, and cover letter"
- **Feedback Form**: "Product feedback form with rating, suggestions, and contact preferences"

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user info

### Form Management
- `GET /api/forms` - Get user's forms
- `POST /api/generate-schema` - Generate form schema from description
- `POST /api/forms/save-draft` - Save form as draft
- `POST /api/forms/publish` - Publish form
- `GET /api/forms/:id` - Get specific form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form

### Response Management
- `GET /api/forms/:id/responses` - Get form responses
- `POST /api/save-response` - Submit form response
- `GET /api/forms/:id/export/csv` - Export responses as CSV
- `DELETE /api/responses/:id` - Delete response

### Public Endpoints
- `GET /api/public/forms/:id` - Get public form
- `GET /api/forms/:id/qr` - Generate QR code for form

## 🎯 Key Features Explained

### AI Form Generation
The AI analyzes your natural language description and creates:
- **Appropriate field types** (text, email, select, checkbox, etc.)
- **Validation rules** (required fields, formats, min/max values)
- **User-friendly labels** and placeholders
- **Smart defaults** based on context

### Template System
Choose from multiple templates:
- **Modern**: Clean, minimalist design
- **Professional**: Corporate-friendly styling
- **Creative**: Colorful, engaging layouts
- **Minimal**: Simple, focused design

### Response Management
- **Real-time collection** of form submissions
- **Search and filter** responses
- **Export to CSV** for analysis
- **Response analytics** and insights

## 🚀 Deployment

### Local Development
```bash
# Start both services
npm run dev:all
```

### Production Deployment

1. **Deploy Backend to Render**
   - Connect your GitHub repository
   - Set environment variables
   - Deploy automatically

2. **Deploy Frontend to Vercel/Netlify**
   - Connect repository
   - Set build command: `npm run build`
   - Set output directory: `dist`

3. **Set up Production Database**
   - Use Neon, Supabase, or Railway for PostgreSQL
   - Update DATABASE_URL in production environment

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenRouter** for AI model access
- **React JSON Schema Form** for dynamic form rendering
- **Prisma** for database management
- **Tailwind CSS** for styling

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-form-builder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-form-builder/discussions)
- **Email**: support@aiformbuilder.com

## 🔮 Roadmap

- [ ] **Multi-language Support**
- [ ] **Advanced Analytics Dashboard**
- [ ] **Form Templates Marketplace**
- [ ] **Integration with Popular Tools** (Zapier, Slack, etc.)
- [ ] **Mobile App**
- [ ] **Team Collaboration Features**
- [ ] **Advanced AI Features** (smart suggestions, auto-completion)

---

**Built with ❤️ by [Your Name]**

*Transform your ideas into beautiful, functional forms with the power of AI.*
