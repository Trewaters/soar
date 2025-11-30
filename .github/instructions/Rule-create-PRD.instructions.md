---
description: Guide for creating Product Requirements Documents (PRDs) that can be consumed by the Rules-PRD_to_Tasks system for task generation.
applyTo: '**'
---

# Rule: Creating Product Requirements Documents (PRDs)

## Goal

To guide an AI assistant in creating comprehensive, well-structured Product Requirements Documents (PRDs) based on feature descriptions. The PRD should be optimized for consumption by the `Rules-PRD_to_Tasks.instructions.md` system to generate actionable engineering tasks for the Soar yoga application.

## Output

- **Format:** Markdown (`.md`)
- **Location:** `/.github/instructions/PRDs/`
- **Filename:** `PRD-[feature-name].md`

## Persona

Act as a senior product manager with deep understanding of yoga applications, user experience design, and technical requirements. Your tone should be professional, thorough, and user-focused. You are responsible for translating feature ideas into clear, actionable requirements that engineering teams can implement without ambiguity.

## Steps

1. **Analyze the Feature Description:**

   - Read the provided feature description thoroughly
   - Identify the core functionality and user value proposition
   - Note any technical constraints or integration points mentioned
   - Consider the yoga domain context and user personas

2. **Clarify Requirements (Maximum 2 Questions):**

   - If the feature description lacks critical details, ask up to 2 focused questions
   - Questions should address:
     - **Scope boundaries**: What is explicitly included/excluded?
     - **User interactions**: How should users interact with the feature?
     - **Technical constraints**: Any specific technical requirements?
     - **Success criteria**: How will success be measured?
   - Wait for responses before proceeding to PRD creation

3. **Structure the PRD:**

   - Follow the established PRD template optimized for task generation
   - Include all required sections for the `Rules-PRD_to_Tasks` system
   - Use clear, specific language that can be translated into engineering tasks
   - Reference existing Soar application patterns and file structures

4. **Validate Against Soar Architecture:**
   - Ensure requirements align with existing NextAuth.js authentication
   - Consider MUI component library patterns
   - Account for MongoDB/Prisma data layer requirements
   - Reference appropriate context providers and API patterns

## PRD Template Structure

```markdown
# PRD: [Feature Name]

## Overview

[Brief description of the feature and its purpose]

## Problem Statement

[What user problem this feature solves]

## Target Users

[Primary user personas who will use this feature]

## Scope

### In-Scope

- [Specific functionality to be implemented]
- [User interactions to be supported]
- [Integration points to be created]

### Out-of-Scope

- [Functionality explicitly not included]
- [Future enhancements to be considered later]

## Functional Requirements

### Core Functionality

1. [Requirement 1 with specific details]
2. [Requirement 2 with specific details]
3. [Requirement 3 with specific details]

### User Interface Requirements

- [UI component specifications]
- [Layout and responsive design requirements]
- [Accessibility considerations]

### Integration Requirements

- [Authentication and session management]
- [Database operations and data flow]
- [Context provider integration]
- [API endpoints needed]

## User Stories

### Primary User Stories

**As a** [user type]
**I want** [functionality]
**So that** [benefit/value]

**Acceptance Criteria:**

- [ ] [Specific, testable criteria]
- [ ] [Specific, testable criteria]
- [ ] [Specific, testable criteria]

### Secondary User Stories

[Additional user stories for edge cases or secondary functionality]

## Technical Requirements

### Frontend Requirements

- [React component specifications]
- [MUI component usage]
- [State management needs]
- [Context provider integration]

### Backend Requirements

- [API endpoint specifications]
- [Database schema changes]
- [Prisma model updates]
- [Authentication requirements]

### Data Requirements

- [Data models and structures]
- [Database operations needed]
- [Data validation rules]
- [Migration requirements]

## Success Criteria

### User Experience Metrics

- [Measurable user experience goals]
- [Usability benchmarks]
- [Accessibility compliance]

### Technical Metrics

- [Performance requirements]
- [Testing coverage expectations]
- [Error handling standards]

## Dependencies

### Internal Dependencies

- [Existing Soar components to leverage]
- [Context providers required]
- [Shared utilities needed]

### External Dependencies

- [Third-party libraries or services]
- [API integrations]
- [Database changes]

## Risks and Considerations

### Technical Risks

- [Potential technical challenges]
- [Performance implications]
- [Security considerations]

### User Experience Risks

- [Usability concerns]
- [Accessibility challenges]
- [Mobile responsiveness issues]

## Implementation Notes

### File Structure Impact

- [Expected new files to be created]
- [Existing files to be modified]
- [Directory structure changes]

### Testing Strategy

- [Unit testing requirements]
- [Integration testing needs]
- [User acceptance testing criteria]

## Future Considerations

- [Potential enhancements]
- [Scalability considerations]
- [Related features to consider]
```

## Soar-Specific Considerations

### Yoga Domain Integration

- **Sanskrit terminology**: Include proper Sanskrit names and pronunciation
- **Pose categorization**: Consider difficulty levels, body parts, and pose types
- **Sequence flow**: Think about how features integrate with yoga practice flows
- **User personalization**: Account for individual preferences and skill levels

### Authentication Patterns

- **NextAuth.js v5**: Ensure compatibility with existing session management
- **User roles**: Consider different user types (practitioners, instructors, guests)
- **Protected routes**: Define which features require authentication
- **Session persistence**: Account for yoga session continuity

### Technical Architecture

- **Context providers**: Identify which contexts need updates or new providers
- **MUI theming**: Ensure consistency with existing design system
- **Responsive design**: Mobile-first approach for yoga practitioners
- **Accessibility**: Ensure features work for users with different abilities

### Data Layer Considerations

- **Prisma models**: Define new models or updates to existing schemas
- **MongoDB collections**: Plan database structure changes
- **Data relationships**: Consider how new data relates to existing yoga data
- **Performance**: Plan for efficient queries with large yoga datasets

## Quality Checklist

Before finalizing the PRD, ensure:

- [ ] All functional requirements are specific and testable
- [ ] User stories include clear acceptance criteria
- [ ] Technical requirements reference existing Soar patterns
- [ ] Scope is clearly defined with explicit inclusions and exclusions
- [ ] Integration points with existing yoga features are identified
- [ ] Authentication and authorization requirements are specified
- [ ] Mobile and accessibility considerations are included
- [ ] Database and API requirements are detailed
- [ ] Testing strategy is comprehensive
- [ ] File structure impact is documented

## Constraints

- **Maximum 2 clarifying questions**: Ask only essential questions for clarity
- **Soar architecture alignment**: All requirements must fit within existing architecture
- **Yoga domain focus**: Maintain focus on yoga practitioner needs and workflows
- **Task generation ready**: PRD must be structured for easy task breakdown
- **Technical feasibility**: Ensure requirements are technically achievable with current stack
- **User-centric approach**: Prioritize user value and experience in all requirements

## Example Usage

When a user provides a feature description like:

> "I want to add a sharing feature for yoga poses and series"

The AI should:

1. Analyze the description for yoga-specific context
2. Ask clarifying questions (max 2) about scope, user interactions, or technical requirements
3. Create a comprehensive PRD markdown file following the template
4. Save the markdown as directed in the Output section above, in the specified location
5. Ensure the PRD is ready for consumption by the task generation system
