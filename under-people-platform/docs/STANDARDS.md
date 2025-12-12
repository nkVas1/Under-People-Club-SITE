<!--
Add this to your GitHub repository settings for better documentation.
-->

# Project Standards

## Code Quality

### Frontend (TypeScript/React)

- **Linting**: ESLint with Next.js configuration
- **Formatting**: Prettier (100 char line length)
- **Type Safety**: Strict TypeScript mode
- **Testing**: Jest + React Testing Library

### Backend (Python)

- **Linting**: Pylint, Flake8
- **Formatting**: Black
- **Type Hints**: Full type annotations
- **Testing**: Pytest with asyncio support

## Commit Convention

```
[type]: short description

Optional longer description

Closes #issue_number
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Test addition/modification
- `chore`: Maintenance

## Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `docs/*`: Documentation

## Pull Request Process

1. Create feature branch from `develop`
2. Make changes with clear commits
3. Write/update tests
4. Update documentation
5. Request review from 2+ maintainers
6. Pass all CI checks
7. Merge with squash

## Documentation

- Keep README.md up-to-date
- Document all public APIs
- Add JSDoc for functions
- Include examples in docs
- Use markdown for all docs

## Testing

- Minimum 80% code coverage
- Write tests before/with code
- Test edge cases
- Mock external services
- Integration tests for APIs

## Performance

- Optimize images (WebP/AVIF)
- Code splitting for bundles
- Database query optimization
- Caching strategies
- Monitor Core Web Vitals

## Security

- No hardcoded secrets
- Validate all inputs
- Sanitize outputs
- Use HTTPS only
- Regular dependency updates
- Security headers enabled

---

Questions? Check [docs/](../) or ask maintainers.
