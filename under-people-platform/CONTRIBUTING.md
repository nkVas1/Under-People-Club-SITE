# Contributing to Under People Club

Thank you for your interest in contributing to Under People Club! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## How to Contribute

### 1. Setting Up Development Environment

```bash
git clone https://github.com/yourusername/under-people-platform.git
cd under-people-platform
```

**Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

**Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python -m app.main
```

### 2. Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following code style guidelines
3. Test your changes thoroughly
4. Commit with clear messages:
   ```bash
   git commit -m "Add: brief description of changes"
   ```

### 3. Submitting Changes

1. Push to your fork
2. Open a Pull Request with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Test results

## Code Style

### Frontend (TypeScript/React)
- Use TypeScript for type safety
- Follow ESLint configuration
- Format with Prettier
- Component names in PascalCase
- Hooks with `use` prefix

### Backend (Python)
- Follow PEP 8 style guide
- Type hints for functions
- Docstrings for modules/functions
- Use meaningful variable names
- Maximum line length: 100 characters

## Commit Message Format

```
[Type]: Brief description

[Optional detailed explanation]

Closes #[issue-number]
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

## Pull Request Process

1. Update documentation
2. Add/update tests
3. Ensure CI passes
4. Request review from maintainers
5. Address feedback
6. Merge when approved

## Reporting Issues

- Use issue templates
- Provide reproducible examples
- Include browser/OS information
- Attach screenshots if relevant

## Questions?

Open a discussion or contact the maintainers.

---

**Thank you for contributing to Under People Club!** 🎭
