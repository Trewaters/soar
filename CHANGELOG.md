# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Unified ActivityTracker component for asana, series, and sequence activity tracking
- Prisma integrated to handle user login and accounts.
- MongoDB connection for storing data.
- Created User profile to manage user accounts.
- Created Registration, Logout and Login pages.
- Added Google Authentication
- Added "Practitioner Details" user information component.

### Changed

- Consolidated three separate activity tracker implementations (SeriesActivityTracker, SequenceActivityTracker, and inline asana tracking) into a single reusable ActivityTracker component
- Reduced codebase by approximately 620 lines through component consolidation
- Improved consistency across all activity tracking features

### Removed

- Deprecated SeriesActivityTracker component (~234 lines)
- Deprecated SequenceActivityTracker component (~220 lines)
- Removed inline activity tracking code from pose detail page (~170 lines)

## [0.1.0] - 2024-06-01 09:27:07

### Added

- version 0.1.0 setup Changelog ([**@trewaters**](https://github.com/trewaters))

### Fixed

- not tracked until now

### Changed

- not tracked until now

### Removed

- not tracked until now

## Versions

<!-- UPDATE "unreleased once I create release milestones" -->

[unreleased]: https://github.com/Level/level/releases/tag/0.9.0
[1.0.0]: https://github.com/Trewaters/soar/releases/tag/v1.0.0
[0.1.0]: https://github.com/Trewaters/soar/compare/version_stable...HEAD

# TEMPLATE

## [0.1.0] - 2024-06-01 09:27:07

### Added

- not tracked until now

### Fixed

- not tracked until now

### Changed

- not tracked until now

### Removed

- not tracked until now
