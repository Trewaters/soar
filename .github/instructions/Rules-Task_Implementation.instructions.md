---
description: Guide for implementing engineering tasks in the Soar yoga application with proper testing and documentation.
applyTo: '**'
---

# Rule: Soar Yoga App Task Implementation

## Goal

To guide an AI assistant in implementing engineering tasks for the Soar yoga application while following established patterns, creating comprehensive unit tests, and generating thorough documentation. This rule ensures consistent implementation across yoga-specific features while maintaining code quality and proper testing coverage.

## Output

- **Format:** Markdown (`.md`)
- **Location:** `/.github/coding/`
- **Filename:** `README-[task-list-name]-task-[task-number].md` where `[task-list-name]` is derived from the task list filename and `[task-number]` is the specific task being implemented
- **When to Generate:** Create this documentation file AFTER successfully completing each individual task AND its corresponding unit tests

## Persona

Act as a senior full-stack engineer with deep expertise in Next.js 14, React, MUI, MongoDB/Prisma, and yoga domain knowledge. You understand yoga terminology, practitioner needs, and the importance of accessible, mobile-first design for yoga applications. Balance rapid development with maintainable, well-tested code that serves the yoga community effectively.

## Steps

1. **Task Analysis and Soar Context Planning:**

   - Review the complete task list within the context of Soar's yoga domain
   - Identify dependencies with existing yoga contexts (AsanaPostureContext, AsanaSeriesContext, UserContext)
   - Plan integration with NextAuth.js authentication and MUI theming
   - Consider mobile-first design for yoga practitioners
   - Identify Sanskrit terminology and yoga-specific requirements

2. **Implementation Execution (Soar Patterns):**

   - Follow Soar's established file structure and naming conventions
   - Implement using Soar's context provider hierarchy (SessionProvider → ThemeProvider → UserStateProvider → Yoga contexts)
   - Apply MUI theming and responsive design patterns from `app/styles/theme.ts`
   - Ensure proper integration with Prisma models (UserData, Asana, AsanaSeries, AsanaSequence)
   - Use Soar's feature flag system from `app/FEATURES.ts` when appropriate
   - Implement proper error handling and loading states for yoga features

3. **Unit Testing Implementation (Required):**

   - Create comprehensive unit tests following Soar's testing patterns and the `Rule-create-unit-tests.instructions.md` guide
   - Mock all external dependencies (NextAuth, contexts, Prisma)
   - Use Soar's established mock structure and test utilities
   - Test yoga-specific functionality (pose rendering, sequence flow, breathing timers)
   - Ensure accessibility testing for yoga practitioners with different abilities
   - Validate mobile responsiveness in tests
   - **Limit test files to maximum 600 lines** of actual test code (describe blocks and it statements only - excluding imports, mocks, setup, and interface definitions)
   - **Each task MUST include unit tests before being considered complete**

4. **Documentation Generation (Required):**
   - Generate comprehensive documentation for each completed task
   - Include yoga domain context and practitioner impact
   - Document Sanskrit terminology and pronunciation guides where applicable
   - Provide integration examples with existing yoga features
   - Include mobile and accessibility considerations

## Soar-Specific Implementation Guidelines

### File Structure and Organization

Follow Soar's established patterns:

```
app/
├── [feature]/              # Yoga-specific features (breathwork, meditation, mantra, planner)
├── clientComponents/       # Interactive UI components
├── context/               # React contexts for yoga state management
├── providers/             # Context provider setup
├── utils/                 # Yoga-specific utility functions
└── views/                 # Page-level yoga components

__test__/                  # Mirror structure for tests
├── app/
│   ├── [feature]/         # Feature-specific tests
│   ├── clientComponents/  # Component tests
│   └── context/           # Context provider tests
```

### Authentication Integration

- Always check session state before accessing user yoga data
- Use NextAuth.js v5 patterns from `auth.ts`
- Implement proper redirects for protected yoga features
- Consider guest user experience for public yoga content

### Database and State Management

- Use Prisma models for yoga data (Asana, AsanaSeries, AsanaSequence, UserData)
- Follow established context patterns for yoga state
- Implement proper loading and error states
- Consider offline functionality for yoga practice sessions

### UI/UX Patterns

- Apply MUI theming from `app/styles/theme.ts`
- Ensure mobile-first responsive design
- Implement proper ARIA labels for yoga pose instructions
- Use semantic HTML for screen reader compatibility
- Consider touch-friendly interfaces for yoga practice

### Testing Requirements (Mandatory)

Every task implementation MUST include:

- **Follow the `Rule-create-unit-tests.instructions.md` guide** for comprehensive test creation patterns
- **Maximum 600 lines per test file** - counting only describe blocks and it statements (excludes imports, mocks, setup functions, and type definitions)
- **Split large test suites** - if a component requires extensive testing that would exceed 600 lines, split into multiple focused test files

#### Essential Mock Setup for Soar Tests

```typescript
// Standard Soar test mocks - ALWAYS include these
jest.mock('next/navigation')
jest.mock('next-auth/react')
jest.mock('@/app/context/UserContext')
jest.mock('@/app/context/AsanaPostureContext')
jest.mock('@/app/context/AsanaSeriesContext')

// Mock Prisma for yoga data operations
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    asana: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    asanaSeries: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    userData: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  })),
}))
```

#### Test Wrapper for Yoga Components

```typescript
const SoarTestWrapper = ({ children }: { children: ReactNode }) => (
  <SessionProvider session={mockYogaSession}>
    <ThemeProvider theme={soarTheme}>
      <CssBaseline />
      <UserStateProvider>
        <AsanaPostureProvider>
          <FlowSeriesProvider>
            {children}
          </FlowSeriesProvider>
        </AsanaPostureProvider>
      </UserStateProvider>
    </ThemeProvider>
  </SessionProvider>
)
```

#### Required Test Categories

1. **Rendering Tests**: Verify components render without errors
2. **Props Tests**: Test yoga-specific props (pose names, difficulty levels, etc.)
3. **User Interaction Tests**: Test practice flows and user actions
4. **Context Integration Tests**: Verify proper yoga context usage
5. **Accessibility Tests**: Ensure components work for all practitioners
6. **Mobile Responsiveness Tests**: Verify touch-friendly interfaces
7. **Sanskrit Content Tests**: Test proper rendering of yoga terminology

### Yoga Domain Considerations

#### Sanskrit Terminology

- Use proper Sanskrit names with pronunciation guides
- Provide English translations and descriptions
- Ensure proper diacritical marks where applicable
- Test rendering of special characters

#### Accessibility for Yoga Practitioners

- Provide audio cues for visually impaired practitioners
- Ensure keyboard navigation for poses and sequences
- Test with screen readers for pose instructions
- Consider colorblind-friendly visual cues

#### Mobile Yoga Practice

- Design for practice mats and mobile devices
- Ensure touch targets are appropriate for yoga positions
- Test landscape and portrait orientations
- Consider device placement during practice

## Documentation Structure for Soar Tasks

Use this enhanced structure for yoga-specific documentation:

```markdown
# [Yoga Feature Name] - Implementation Documentation

## Overview

Brief description of the yoga feature implemented and its value to practitioners.

## Yoga Domain Context

- Sanskrit terminology used
- Yoga practice principles applied
- Practitioner personas served
- Integration with yoga sequences/practices

## Implementation Summary

High-level summary of components and services created for yoga functionality.

## Architecture & Design Decisions

### Yoga-Specific Technical Approach

- Integration with existing yoga contexts and state management
- Approach to handling yoga data (poses, sequences, series)
- Mobile-first design decisions for yoga practice
- Accessibility considerations for diverse practitioners

### Component Structure

- Yoga-specific component hierarchy and data flow
- Reusable patterns for yoga UI components
- Integration with MUI theming for yoga aesthetics

### Yoga Data Layer Design

- Prisma model usage for yoga data (Asana, AsanaSeries, etc.)
- Yoga state management patterns
- Data validation for yoga content

## Detailed Implementation

### Files Created/Modified

List all files with descriptions of yoga-specific changes:

- `app/[feature]/[component].tsx` - New yoga component
- `app/context/[YogaContext].tsx` - Yoga state management
- `__test__/app/[feature]/[component].spec..tsx` - Unit tests
- `prisma/schema.prisma` - Yoga data model updates

### Key Yoga Components

#### YogaComponentName

- **Purpose:** Specific yoga functionality provided
- **Sanskrit Terms:** Any Sanskrit terminology used
- **Props Interface:** Yoga-specific props and their meanings
- **Accessibility Features:** How it serves practitioners with different abilities
- **Mobile Considerations:** Touch-friendly features for practice
- **Usage Example:** Code snippet showing yoga context integration

### Yoga Services & Data Layer

#### YogaServiceName

- **Responsibility:** Yoga data operations handled
- **Yoga Data Models:** Asana, AsanaSeries, AsanaSequence usage
- **Practice Integration:** How it supports yoga practice flows
- **User Personalization:** Adaptation to practitioner preferences

## Testing Implementation (Required)

### Unit Test Coverage

- **Rendering Tests:** Component mounts and displays yoga content correctly
- **Yoga Data Tests:** Proper handling of asana, series, and sequence data
- **User Interaction Tests:** Practice flows and yoga-specific interactions
- **Context Integration Tests:** Proper yoga context provider usage
- **Accessibility Tests:** Screen reader and keyboard navigation
- **Mobile Tests:** Touch interfaces and responsive behavior
- **Sanskrit Content Tests:** Proper rendering of yoga terminology

### Test Files Created

- `__test__/app/[feature]/[component].spec..tsx`
- **Each test file limited to 600 lines maximum** (describe and it blocks only)
- Description of yoga-specific test scenarios
- Mock strategies for yoga contexts and data
- Edge cases for yoga practice scenarios
- **Large components split into multiple focused test files** when needed

### Yoga-Specific Test Scenarios

- Different skill levels (beginner, intermediate, advanced)
- Various yoga styles and preferences
- Practice session flows and timing
- Error handling for yoga instruction delivery
- Offline practice functionality

## Integration with Soar Architecture

### Context Provider Integration

- How the feature integrates with existing yoga contexts
- New context providers created for yoga functionality
- Data flow between yoga contexts and components

### Authentication & User Data

- Integration with NextAuth.js for personalized yoga features
- User yoga preferences and practice history
- Protected vs. public yoga content access

### Database Integration

- Prisma model usage and relationships
- Yoga data seeding and migration considerations
- Performance optimization for large yoga databases

## Yoga Practitioner Guidelines

### For Yoga Instructors

- How to use new features in teaching contexts
- Customization options for different yoga styles
- Integration with existing yoga curriculum

### For Practitioners

- How to personalize the yoga experience
- Accessibility features available
- Mobile practice recommendations

### Yoga Content Management

- Adding new poses and sequences
- Organizing yoga content by difficulty/style
- Managing Sanskrit terminology and translations

## Accessibility & Inclusivity

### Screen Reader Support

- ARIA labels for yoga poses and instructions
- Semantic markup for practice sequences
- Audio cues for timing and transitions

### Motor Accessibility

- Keyboard navigation for all yoga features
- Alternative interaction methods for poses
- Adaptive interfaces for different abilities

### Cultural Sensitivity

- Respectful use of Sanskrit terminology
- Acknowledgment of yoga's cultural origins
- Inclusive language for all practitioners

## Performance Considerations

### Yoga Content Loading

- Lazy loading for large pose libraries
- Efficient rendering of practice sequences
- Offline caching for practice sessions

### Mobile Performance

- Touch response optimization
- Battery usage during practice sessions
- Network efficiency for yoga content

## Future Yoga Enhancements

- Advanced pose detection and feedback
- AI-powered sequence recommendations
- Community features for yoga practitioners
- Integration with wearable devices for practice tracking

## Troubleshooting Yoga Features

### Common Practice Issues

- Audio/video synchronization problems
- Pose instruction clarity
- Sequence timing and flow issues

### Technical Debugging

- Yoga context state debugging
- Mobile-specific yoga feature issues
- Accessibility feature troubleshooting

### Development Tips for Yoga Features

- Best practices for yoga component development
- Testing strategies for yoga interactions
- Performance optimization for practice sessions
```

## Quality Checklist for Soar Tasks

Before completing any task, verify:

- [ ] **Unit tests created and passing** for all new yoga functionality (following `Rule-create-unit-tests.instructions.md`)
- [ ] **Test files under 600 lines** (describe and it blocks only - excluding imports, mocks, setup)
- [ ] All yoga contexts properly integrated and tested
- [ ] Mobile responsiveness tested for yoga practice scenarios
- [ ] Accessibility features verified for diverse practitioners
- [ ] Sanskrit terminology properly rendered and tested
- [ ] NextAuth.js integration working for personalized features
- [ ] Prisma yoga data models properly used and tested
- [ ] MUI theming applied consistently
- [ ] Error handling implemented for yoga-specific scenarios
- [ ] Documentation generated following Soar yoga template
- [ ] Feature flags updated if needed in `app/FEATURES.ts`
- [ ] Integration with existing yoga components verified

## Soar-Specific Anti-Patterns to Avoid

- **Yoga Domain:** Don't oversimplify Sanskrit terms or cultural context
- **Testing:** Never skip unit tests for yoga-critical functionality
- **Mobile:** Don't assume desktop-first interactions for yoga practice
- **Accessibility:** Don't ignore screen reader users in yoga instruction
- **Context:** Don't bypass established yoga context patterns
- **Authentication:** Don't implement yoga features without session consideration
- **Performance:** Don't load entire yoga databases without pagination
- **Cultural:** Don't appropriate or misrepresent yoga traditions

## Testing Command Reference

```bash
# Run specific yoga feature tests
npm test app/breathwork
npm test app/meditation
npm test app/mantra
npm test app/planner

# Run all yoga context tests
npm test app/context

# Run yoga component tests
npm test clientComponents

# Check test coverage for yoga features
npm run test:coverage

# Run accessibility tests
npm test -- --testNamePattern="accessibility"
```

This rule ensures that all Soar yoga application development maintains high quality, proper testing, and comprehensive documentation while respecting the yoga domain and serving practitioners effectively.
