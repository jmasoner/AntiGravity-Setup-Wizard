# AntiGravity Setup Wizard - User Guide

**Version:** 1.0.0  
**Last Updated:** December 11, 2025  
**Author:** John Masoner

---

## 📍 Quick Reference

### How to Launch the Application

**Method 1: Desktop Shortcut (Recommended)**

1. Copy `Launch-AntiGravity.bat` from the project folder to your Desktop
2. Double-click the shortcut to launch
3. The application will automatically open in your browser at `http://localhost:5173`

**Method 2: Manual Launch**

1. Open Windows Terminal or PowerShell
2. Navigate to: `C:\Users\john\OneDrive\MyProjects\AntiGravity-Setup-Wizard`
3. Run: `npm run dev`
4. Open browser to: `http://localhost:5173`

**Method 3: PowerShell Script**

1. Navigate to the project folder
2. Right-click `Launch-AntiGravity.ps1`
3. Select "Run with PowerShell"

---

## 🎯 What is AntiGravity?

AntiGravity Setup Wizard is your personal AI-powered development assistant that helps you:

- **Set up development environments** with personalized configurations
- **Design project architectures** through intelligent AI interviews
- **Generate professional documentation** automatically
- **Create GitHub repositories** and sync files
- **Manage cloud storage** (OneDrive, Google Drive) seamlessly

---

## 🤖 AI Model Support

AntiGravity supports three powerful AI models:

### 1. **Google Gemini 2.5 Flash** (Default)

- **Speed:** ⚡⚡⚡ Very Fast
- **Quality:** ⭐⭐⭐ Good
- **Cost:** 💰 Low
- **Best For:** Quick responses, general tasks, rapid prototyping

### 2. **Claude 3.5 Sonnet**

- **Speed:** ⚡⚡ Fast
- **Quality:** ⭐⭐⭐⭐ Excellent
- **Cost:** 💰💰 Medium
- **Best For:** Balanced performance, most development tasks, code generation

### 3. **Claude 3 Opus**

- **Speed:** ⚡ Moderate
- **Quality:** ⭐⭐⭐⭐⭐ Outstanding
- **Cost:** 💰💰💰 High
- **Best For:** Complex reasoning, critical architecture decisions, production code

### How to Switch Models

1. Navigate to the **Profile** tab
2. Scroll to **AI Model Selection**
3. Choose your preferred model from the dropdown
4. The selected model will be used for all AI operations

---

## 🔑 Setting Up API Keys

### Required API Keys

1. **Google Gemini API Key** (for Gemini model)
   - Get it from: <https://makersuite.google.com/app/apikey>
   - Free tier available

2. **Anthropic API Key** (for Claude models)
   - Get it from: <https://console.anthropic.com/>
   - Requires payment setup

### Configuration Steps

1. Navigate to the project folder:

   ```
   C:\Users\john\OneDrive\MyProjects\AntiGravity-Setup-Wizard
   ```

2. Create or edit the `.env` file:

   ```env
   VITE_GEMINI_API_KEY=your_gemini_key_here
   VITE_ANTHROPIC_API_KEY=your_claude_key_here
   ```

3. **Important:** Never commit the `.env` file to Git (it's already in `.gitignore`)

4. Restart the application for changes to take effect

---

## 🔄 GitHub Integration

### How It Works

AntiGravity can automatically create GitHub repositories and sync your project files.

### Prerequisites

1. **Install GitHub CLI:**

   ```powershell
   winget install GitHub.cli
   ```

2. **Authenticate with GitHub:**

   ```powershell
   gh auth login
   ```

3. **Configure Git integration:**

   ```powershell
   gh auth setup-git
   ```

### Using GitHub Sync

When creating projects with the **Project Architect**:

1. Enter your desired repository name (e.g., `my-awesome-project`)
2. The tool will:
   - Create the local project structure
   - Initialize Git repository
   - Create `.gitignore` with sensible defaults
   - Create the GitHub repository (public or private)
   - Push all files to the remote repository

### Troubleshooting GitHub Issues

**Problem:** "gh: command not found"

- **Solution:** Install GitHub CLI using the command above

**Problem:** "Authentication failed"

- **Solution:** Run `gh auth login` and follow the prompts

**Problem:** "Permission denied (403)"

- **Solution:** Run `gh auth refresh -s repo` to refresh permissions

---

## 📁 Project Structure

```
AntiGravity-Setup-Wizard/
├── Launch-AntiGravity.bat      ← Desktop launcher (copy to Desktop)
├── Launch-AntiGravity.ps1      ← PowerShell launcher script
├── README.md                    ← Main documentation
├── USER-GUIDE.md               ← This file
├── package.json                 ← Dependencies and scripts
├── .env                         ← API keys (DO NOT COMMIT)
├── App.tsx                      ← Main application
├── components/                  ← React components
│   ├── Layout.tsx
│   ├── ProfileEditor.tsx
│   ├── ProjectArchitect.tsx
│   └── ResultViewer.tsx
├── services/                    ← AI integration
│   ├── geminiService.ts        ← Google Gemini
│   ├── claudeService.ts        ← Anthropic Claude
│   └── aiService.ts            ← Unified AI service
└── types.ts                     ← TypeScript definitions
```

---

## 🎨 Features Guide

### 1. Profile Management

**Location:** Profile tab

Configure your personal information and preferences:

- **Personal Details:** Name, email, phone numbers, address
- **File Paths:** OneDrive, Google Drive, GitHub locations
- **Hosting Details:** SSH credentials for web hosting (optional)
- **AI Model:** Select your preferred AI model

**Tip:** Save your profile settings - they'll be used across all features!

### 2. Google Drive Mapping

**Location:** Drive tab

Get step-by-step instructions to:

- Install Google Drive for Desktop
- Map Google Drive to a drive letter (G:)
- Configure streaming vs. mirroring

### 3. Environment Setup

**Location:** Setup tab

Generate a complete setup guide for:

- Installing development tools (Python, Node.js, Git)
- Setting up AI CLI tools (Gemini, Claude)
- Creating folder structures
- Managing API keys securely

### 4. Project Architect 🏗️

**Location:** Project tab

The most powerful feature! Create entire project architectures through AI conversation:

#### Phase 1: Ideation

- Describe your project idea in plain English
- No need to be technical - just explain what you want to build

#### Phase 2: Interview

- AI asks clarifying questions about:
  - Project scale (small, medium, enterprise)
  - Architecture type (modular, flat, microservices)
  - Technology constraints
  - Long-term goals
- Answer naturally - the AI adapts to your responses

#### Phase 3: Blueprint

- AI generates a comprehensive project architecture
- Includes:
  - Folder structure
  - Technology stack recommendations
  - Development phases
  - Architecture rationale

#### Phase 4: Fabrication

- AI creates "Mission Files":
  - **CONTEXT.md** - Project documentation and master prompt
  - **init_[project].ps1** - Script to create the project structure
  - **resume_[project].ps1** - Script to launch your dev environment

**Tip:** Use Claude Opus for complex projects, Gemini for quick prototypes!

### 5. README Generator

**Location:** README tab

Generate professional README.md files:

- Automatically includes your contact information
- Customizable project description
- Technology stack listing
- Professional formatting

---

## 🛠️ Troubleshooting

### Application Won't Start

**Symptom:** Error when running `npm run dev`

**Solutions:**

1. Delete `node_modules` folder and `package-lock.json`
2. Run `npm install` again
3. Ensure Node.js version is 18 or higher: `node --version`
4. Check if port 5173 is available (close other apps using it)

### API Features Not Working

**Symptom:** AI generation fails or shows errors

**Solutions:**

1. Check `.env` file exists in project root
2. Verify API keys are correct (no extra spaces)
3. Test API keys on provider websites
4. Restart the development server
5. Check your API quota/billing status

### Browser Doesn't Open Automatically

**Symptom:** Server starts but browser doesn't open

**Solutions:**

1. Manually open browser to `http://localhost:5173`
2. Check if default browser is set in Windows
3. Try a different browser

### GitHub CLI Errors

**Symptom:** Repository creation fails

**Solutions:**

1. Verify GitHub CLI is installed: `gh --version`
2. Re-authenticate: `gh auth login`
3. Check GitHub permissions: `gh auth status`
4. Ensure you're not hitting rate limits

### Port Already in Use

**Symptom:** "Port 5173 is already in use"

**Solutions:**

1. Close other instances of the application
2. Find and kill the process using port 5173:

   ```powershell
   Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
   ```

3. Or change the port in `vite.config.ts`

---

## 💡 Tips & Best Practices

### For Best Results

1. **Keep Your Profile Updated**
   - Accurate paths ensure scripts work correctly
   - Update contact info for generated documentation

2. **Choose the Right AI Model**
   - Gemini: Quick iterations, testing ideas
   - Claude Sonnet: Production code, balanced tasks
   - Claude Opus: Critical decisions, complex architecture

3. **Use Project Architect Effectively**
   - Be specific in your project description
   - Answer interview questions thoroughly
   - Review the blueprint before fabrication

4. **Manage API Keys Securely**
   - Never commit `.env` to Git
   - Rotate keys periodically
   - Use separate keys for development and production

5. **Leverage GitHub Integration**
   - Let the tool create repos for you
   - Review generated `.gitignore` files
   - Use meaningful repository names

### Common Workflows

**Starting a New Project:**

1. Open AntiGravity
2. Go to Project Architect
3. Describe your project
4. Answer AI questions
5. Review blueprint
6. Generate mission files
7. Run the init script
8. Start coding!

**Documenting an Existing Project:**

1. Go to README tab
2. Fill in project details
3. Generate README
4. Copy to your project
5. Customize as needed

**Setting Up a New Machine:**

1. Go to Setup tab
2. Generate environment setup guide
3. Follow the instructions
4. Install all tools
5. Configure API keys

---

## 📞 Support & Contact

**Developer:** John Masoner  
**Email:** <john@masoner.us>  
**Phone:** 360-513-4238  
**Office:** 850-359-8005

For issues or feature requests, create an issue in the GitHub repository.

---

## 🔄 Keeping AntiGravity Updated

### Updating Dependencies

```powershell
cd C:\Users\john\OneDrive\MyProjects\AntiGravity-Setup-Wizard
npm update
```

### Pulling Latest Changes (if using Git)

```powershell
git pull origin main
npm install
```

---

## 📝 Changelog

### Version 1.0.0 (December 11, 2025)

- Initial release
- Multi-AI model support (Gemini, Claude Sonnet, Claude Opus)
- GitHub integration with automatic repo creation
- Desktop launcher scripts
- Comprehensive documentation

---

## 🎓 Learning Resources

### AI Model Documentation

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Anthropic Claude API Docs](https://docs.anthropic.com/)

### Development Tools

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [GitHub CLI Manual](https://cli.github.com/manual/)

---

**Happy Building! 🚀**
