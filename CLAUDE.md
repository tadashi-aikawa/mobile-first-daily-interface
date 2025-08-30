# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build & Development
- `bun dev` - Start development build with hot reload and vault integration
- `bun run build` - Production build with TypeScript checking
- `bun run test` - Run Jest tests with Obsidian mocking
- `bun run pre:push` - TypeScript check + tests (pre-push validation)
- `bun run ci` - Full CI pipeline (install + build + test)

### Version Management
- `bun version-bump.mjs` - Update version in manifest.json and versions.json
- `bun run release` - Complete release process with git tagging

### Testing
- Tests use Jest with esbuild-jest transformer
- Obsidian API is mocked in `src/__mocks__/obsidian.ts`
- Run individual test files with standard Jest patterns

## Project Architecture

### Core Plugin Structure
This is an Obsidian plugin built with TypeScript and React:

- **Main Plugin**: `src/main.ts` - Entry point extending Obsidian's Plugin class
- **Settings**: `src/settings.ts` - Plugin configuration with enhanced daily note options
- **View System**: `src/ui/MDFIView.tsx` - Custom ItemView that renders React components
- **App Helper**: `src/app-helper.ts` - Obsidian API wrapper with file operations and task management

### UI Architecture
- **React Integration**: Uses `react-dom/client` with `createRoot` for modern React rendering
- **UI Framework**: Chakra UI (@chakra-ui/react) with Emotion for styling
- **Component Structure**: 
  - `ReactView.tsx` - Main React container with enhanced functionality
  - `PostCardView.tsx` - Message/post display components
  - `TaskView.tsx` - Task management interface
  - Various card components for different content types (HTML, Image, Twitter)

### Daily Notes Integration
- **Core Module**: `src/obsutils/daily-notes.ts` - Enhanced daily note operations
- Uses `obsidian-daily-notes-interface` for standard daily note functionality
- **Custom Directory Support**: Override Obsidian's daily note folder setting
- **Section-Based Appending**: Append content under specific headings with boundary control
- **Advanced Features**:
  - Custom timestamp formats for posts
  - Section end delimiters for precise content placement
  - Auto-heading demotion based on target section level

### Enhanced Post Formats
Supports multiple post formats including:
- Code blocks
- Headings (H1-H6) with auto-demotion
- List format (new addition)
- Timestamp integration with configurable formats

### Key Features
- **Mobile-First Design**: SNS/chat-like interface optimized for mobile
- **Daily Note Integration**: Automatic daily note creation with enhanced section handling
- **Task Management**: Task creation, completion toggle, and mark management
- **External Integrations**: Bluesky social media posting
- **Flexible Display**: Supports left/right sidebar or current leaf display
- **Advanced Content Management**: Section delimiters, custom timestamps, heading auto-adjustment

### Build System
- **Runtime**: Bun for package management and build execution
- **Bundler**: esbuild with TypeScript compilation
- **Development**: Hot reload with file watching for Obsidian plugin directory
- **Testing**: Jest with comprehensive mocking of Obsidian API
- **Target**: ES2018, CommonJS format for Obsidian compatibility

### Utility Modules
- `src/utils/markdown.ts` - Markdown parsing and heading manipulation
- `src/utils/strings.ts` - String processing utilities
- `src/utils/collections.ts` - Collection helper functions
- `src/utils/types.ts` - TypeScript type definitions

### Plugin Manifest
- Plugin ID: `mobile-first-daily-interface`
- Name: `Mobile First Daily Interface`
- Supports both desktop and mobile platforms
- Minimum Obsidian version: 1.2.8