# Contributing to Slot Machine Expert Power

Thank you for your interest in contributing to this project! This document provides guidelines and information for contributors.

## How to Contribute

### Reporting Issues

- Use GitHub Issues to report bugs or suggest features
- Include steps to reproduce any issues
- Specify your environment (OS, Node.js version, Kiro version)

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature or content addition
- `fix:` — Bug fix or content correction
- `docs:` — Documentation changes
- `test:` — Adding or modifying tests
- `chore:` — Maintenance tasks (dependencies, configs)

### Content Guidelines

When contributing to steering files or POWER.md:

1. **Cite official sources** — All regulatory/compliance information must reference official documentation
2. **Verify URLs** — Ensure all referenced URLs are accessible and point to the correct content
3. **Use precise terminology** — Follow industry-standard terminology (GLI, UKGC, MGA, etc.)
4. **Maintain language consistency** — Steering files are in Traditional Chinese with technical terms in English
5. **Test your changes** — Run `npm test` to ensure all property-based tests pass

### Running Tests

```bash
npm install
npm test              # Run all tests
npx tsc --noEmit     # TypeScript type checking
```

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run tests: `npm test`
4. Verify TypeScript: `npx tsc --noEmit`

## Project Structure

- `POWER.md` — Main Power definition file (entry point for Kiro)
- `steering/` — Domain knowledge workflow guides
- `tests/` — Property-based tests (fast-check + vitest)
- `hooks/` — IDE automation hooks
- `templates/` — Reusable configuration templates

## Security Issue Notifications

If you discover a potential security issue in this project, we ask that you notify us via GitHub Issues with the label `security`. Please do **not** create a public issue for security vulnerabilities.

Instead:
1. Create a private security advisory via GitHub's Security tab
2. Or email the maintainer directly

We will work with you to address the issue before any public disclosure.

## Code of Conduct

This project follows the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
