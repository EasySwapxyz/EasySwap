# Contributing to EasySwap

First off, thank you for considering contributing to EasySwap! It's people like you that make EasySwap such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by the EasySwap Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots and animated GIFs if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain the behavior you expected to see
* Explain why this enhancement would be useful

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible
* Follow the TypeScript and React styleguides
* Include thoughtfully-worded, well-structured tests
* Document new code based on the Documentation Styleguide
* End all files with a newline

## Development Process

### Setting Up Development Environment

1. Fork the repo
2. Clone your fork
3. Create a new branch
4. Install dependencies
   ```bash
   cd backend && npm install
   cd frontend && npm install
   ```
5. Set up environment variables
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

### Coding Standards

#### TypeScript Style Guide

* Use TypeScript for all new code
* Follow the Google TypeScript Style Guide
* Use strict type checking
* Document complex types

#### React Style Guide

* Use functional components with hooks
* Follow React best practices
* Use proper component composition
* Implement proper error boundaries

#### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

Example:
```
feat: add user authentication system

- Implement JWT authentication
- Add login and registration endpoints
- Create user entity and repository
- Add authentication middleware

Closes #123
```

### Testing

* Write unit tests for all new code
* Ensure all tests pass before submitting PR
* Include integration tests for new features
* Add E2E tests for critical paths

### Documentation

* Update README.md with details of changes to the interface
* Update API documentation for endpoint changes
* Add JSDoc comments for new functions
* Update TypeScript types and interfaces

## Project Structure

```
EasySwap/
├── backend/                 # NestJS backend
├── frontend/               # React frontend
└── shared/                 # Shared utilities
```

### Backend Structure

* Controllers handle HTTP requests
* Services contain business logic
* Repositories manage data access
* DTOs define data transfer objects
* Entities define database models

### Frontend Structure

* Components are reusable UI elements
* Pages contain route-specific logic
* Services handle API communication
* Hooks contain reusable logic
* Utils contain helper functions

## Review Process

1. Create a pull request
2. Wait for CI checks to pass
3. Address review comments
4. Update based on feedback
5. Get approval from maintainers
6. Merge after approval

## Community

* Join our Discord server
* Participate in discussions
* Help others in issues
* Share your ideas
* Contribute to documentation

## Getting Help

If you need help, you can:

* Check the documentation
* Ask in Discord
* Open a GitHub issue
* Email the maintainers

## Recognition

Contributors will be:

* Listed in CONTRIBUTORS.md
* Mentioned in release notes
* Given credit in documentation
* Invited to join the core team

---

Thank you for contributing to EasySwap! ❤️ 