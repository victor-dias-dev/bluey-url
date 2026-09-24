# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-09-23

First public baseline. The version is 0.1 because the analytics worker and DNS verification are still open.

### Added

- MIT license, contribution guide, code of conduct, and security policy.
- GitHub Actions workflow for tests, lint, and type checking.
- Domain tests for plan limits, short codes, redirect decisions, cache payloads, and privacy.
- `package-lock.json`, so installs and the production image are reproducible.

### Fixed

- Redirect cache now stores the status code and expiration. Temporary links no longer fall back to a permanent redirect, and an expired link is not served from cache for the rest of the TTL.
- Custom aliases and custom domains follow the plan rules.
- Domain verification no longer marks a hostname as verified without a DNS check.
- Click IPs are anonymized before they are queued.
- Generated short codes use a cryptographic random source and retry on collision.

### Changed

- Documentation describes the system that is running today. Planned pieces live in the roadmap.
