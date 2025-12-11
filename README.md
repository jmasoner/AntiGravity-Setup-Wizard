# AntiGravity Setup Wizard

> **A personalized environment setup assistant and project architect that generates PowerShell scripts, scaffolds, and context files for AI-powered development workflows.**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Features](#features)
- [AI Model Support](#ai-model-support)
- [GitHub Integration](#github-integration)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contact](#contact)

---

## 🎯 Overview

The **AntiGravity Setup Wizard** is an intelligent project scaffolding tool that helps developers:

- **Set up development environments** with personalized configurations
- **Generate project architectures** through AI-powered interviews
- **Create standardized documentation** (README files, CONTEXT files)
- **Automate GitHub repository creation** and synchronization
- **Map cloud storage** (Google Drive, OneDrive) for seamless file management

This tool leverages multiple AI models (Gemini, Claude Sonnet, Claude Opus) to provide intelligent assistance throughout your development workflow.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Git** installed and configured
- **GitHub CLI** (`gh`) installed and authenticated
- **API Keys** for AI services (Gemini, Claude)

### Installation

1. **Clone or navigate to the project directory:**

   ```bash
   cd c:\Users\john\OneDrive\MyProjects\AntiGravity-Setup-Wizard
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.local` to `.env` if needed
   - Add your API keys to `.env`:

     ```
     VITE_GEMINI_API_KEY=your_gemini_key_here
     VITE_ANTHROPIC_API_KEY=your_claude_key_here
     ```

4. **Launch the application:**

   ```bash
   npm run dev
   ```

5. **Access the wizard:**
   - Open your browser to: `http://localhost:5173`

### 🖥️ Desktop Launcher

For quick access, use the desktop launcher:

1. **Double-click** `Launch-AntiGravity.bat` on your desktop
2. The application will automatically:
   - Open Windows Terminal
   - Navigate to the project directory
   - Start the development server
   - Open your default browser to the application

---

## ✨ Features

### 1. **Profile Management**

- Store your personal information, contact details, and file paths
- Configure OneDrive, Google Drive, and GitHub locations
- Set up hosting and SSH credentials

### 2. **Google Drive Mapping**

- Step-by-step guide to install Google Drive for Desktop
- Instructions for mapping to a drive letter (G:)
- Configuration for streaming files

### 3. **Environment Setup**

- Master setup guide for the "AntiGravity" development environment
- Installation instructions for Python, Node.js, Git
- API key management and CLI setup (Gemini, Claude)
- Folder structure creation across cloud storage

### 4. **Project Architect** 🏗️

The crown jewel of AntiGravity - an AI-powered project planning system:

- **Ideation Phase**: Describe your project idea
- **Interview Phase**: AI asks clarifying questions about scale, architecture, tech stack
- **Blueprint Phase**: AI generates a comprehensive project architecture
- **Fabrication Phase**: AI creates mission files:
  - `CONTEXT.md` - Project documentation and master prompt
  - `init_[project].ps1` - Ignition script to create the project structure
  - `resume_[project].ps1` - Orbit script to launch your development environment

### 5. **README Generator**

- Create professional README.md files
- Automatically includes your contact information
- Customizable project descriptions and tech stacks

### 6. **GitHub Integration**

- Automatic repository creation
- File synchronization with GitHub
- Git initialization and configuration
- Authentication handling with GitHub CLI

---

## 🤖 AI Model Support

AntiGravity supports multiple AI models for different use cases:

### **Google Gemini**

- **Model**: `gemini-2.5-flash`
- **Best for**: Fast responses, general-purpose tasks
- **Configuration**: Set `VITE_GEMINI_API_KEY` in `.env`

### **Claude Sonnet**

- **Model**: `claude-3-5-sonnet-20241022`
- **Best for**: Balanced performance and quality
- **Configuration**: Set `VITE_ANTHROPIC_API_KEY` in `.env`

### **Claude Opus**

- **Model**: `claude-3-opus-20240229`
- **Best for**: Complex reasoning, highest quality outputs
- **Configuration**: Set `VITE_ANTHROPIC_API_KEY` in `.env`

### Selecting Your AI Model

In the application settings, you can choose which AI model to use for different tasks:

- Navigate to the **Profile** tab
- Scroll to **AI Model Selection**
- Choose your preferred model from the dropdown

---

## 🔄 GitHub Integration

### How It Works

1. **Repository Name Input**: Provide the name for your GitHub repository
2. **Automatic Initialization**: The tool initializes a local Git repository
3. **GitHub CLI Integration**: Uses `gh repo create` to create the remote repository
4. **File Synchronization**: All generated files are automatically committed and pushed

### Setup Requirements

1. **Install GitHub CLI**:

   ```bash
   winget install GitHub.cli
   ```

2. **Authenticate**:

   ```bash
   gh auth login
   ```

3. **Configure Git**:

   ```bash
   gh auth setup-git
   ```

### Using GitHub Sync

When generating projects with the **Project Architect**:

1. Enter your desired repository name (e.g., `my-awesome-project`)
2. The tool will:
   - Create the local project structure
   - Initialize Git
   - Create `.gitignore` with sensible defaults
   - Create the GitHub repository
   - Push all files to the remote repository

---

## 📁 Project Structure

```
AntiGravity-Setup-Wizard/
├── components/              # React components
│   ├── Layout.tsx          # Main layout wrapper
│   ├── ProfileEditor.tsx   # User profile configuration
│   ├── ProjectArchitect.tsx # AI-powered project planning
│   ├── ResultViewer.tsx    # Display generated content
│   └── ui/                 # Reusable UI components
├── services/               # Business logic
│   ├── geminiService.ts    # Google Gemini integration
│   ├── claudeService.ts    # Anthropic Claude integration
│   └── aiService.ts        # Unified AI service layer
├── public/                 # Static assets
├── App.tsx                 # Main application component
├── index.tsx               # Application entry point
├── types.ts                # TypeScript type definitions
├── constants.ts            # Application constants
├── .env                    # Environment variables (DO NOT COMMIT)
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Anthropic Claude API Key
VITE_ANTHROPIC_API_KEY=your_claude_api_key_here

# Optional: GitHub Personal Access Token (if not using gh CLI)
VITE_GITHUB_TOKEN=your_github_token_here
```

### User Profile

Configure your profile in the **Profile** tab:

- **Personal Information**: Name, email, phone numbers
- **File Paths**: OneDrive, Google Drive, GitHub repository locations
- **Hosting Details**: SSH credentials for web hosting (optional)
- **AI Model Preference**: Choose your default AI model

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server (localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **AI Integration**: Google Gemini API, Anthropic Claude API
- **Icons**: Lucide React
- **Version Control**: Git + GitHub CLI

### Adding New Features

1. Create new components in `components/`
2. Add new AI modes in `types.ts` (GeneratorMode enum)
3. Implement AI logic in `services/aiService.ts`
4. Update the UI in `App.tsx` or relevant components

---

## 🐛 Troubleshooting

### Application Won't Start

**Problem**: `npm run dev` fails or shows errors

**Solutions**:

1. Delete `node_modules` and `package-lock.json`, then run `npm install`
2. Ensure Node.js version is 18 or higher: `node --version`
3. Check for port conflicts (port 5173 must be available)

### API Key Issues

**Problem**: AI features not working

**Solutions**:

1. Verify API keys are set in `.env` file
2. Ensure `.env` file is in the project root
3. Restart the development server after changing `.env`
4. Check API key validity on the provider's dashboard

### GitHub CLI Errors

**Problem**: Repository creation fails

**Solutions**:

1. Ensure GitHub CLI is installed: `gh --version`
2. Authenticate: `gh auth login`
3. Set up Git integration: `gh auth setup-git`
4. Check GitHub permissions and rate limits

### Port Already in Use

**Problem**: `Port 5173 is already in use`

**Solutions**:

1. Stop the existing process using port 5173
2. Or modify `vite.config.ts` to use a different port:

   ```typescript
   export default defineConfig({
     server: { port: 3000 }
   })
   ```

---

## 📞 Contact

**Lead Developer**: John Masoner  
**Email**: [Your Email]  
**Phone**: [Your Phone]  
**Office**: [Your Office Phone]  
**Address**: [Your Address]

---

## 📄 License

This project is private and proprietary.

---

## 🙏 Acknowledgments

- **Google Gemini** for AI-powered content generation
- **Anthropic Claude** for advanced reasoning capabilities
- **GitHub CLI** for seamless repository management
- **Vite** for lightning-fast development experience

---

## 🚀 Next Steps

1. **Configure your profile** in the Profile tab
2. **Try the Project Architect** to create your first AI-designed project
3. **Generate a README** for an existing project
4. **Set up your development environment** with the Setup Guide

**Happy Coding! 🎉**
