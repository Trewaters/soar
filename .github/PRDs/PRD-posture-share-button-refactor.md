# PRD: Posture Share Button Component Refactor

## Overview

Refactor the existing `PostureShareButton` component to support multiple yoga content types with extensible sharing functionality. The component currently handles individual asana postures and series flows but needs to be expanded to support sequence flows and future content types through a more flexible, type-safe architecture.

## Problem Statement

The current `PostureShareButton` component has several limitations:

1. **Limited content type support**: Only handles asana postures and series flows
2. **Hardcoded logic**: Share text generation is embedded in conditional logic making it difficult to extend
3. **Inconsistent formatting**: Series sharing doesn't match the desired format specification
4. **Poor extensibility**: Adding new content types requires modifying core component logic
5. **Type safety issues**: Uses optional props pattern which can lead to runtime errors

## Target Users

- **Yoga practitioners** sharing their favorite poses, series, and sequences with friends
- **Yoga instructors** sharing practice content with students
- **Soar app users** building community through content sharing

## Scope

### In-Scope

- Refactor component to use a discriminated union pattern for content types
- Implement proper series sharing format as specified in developer notes
- Add support for sequence flow sharing
- Create extensible architecture for future content types
- Maintain backward compatibility with existing usage
- Improve accessibility and user experience
- Add proper TypeScript typing for all content types

### Out-of-Scope

- Social media platform-specific sharing integrations
- Custom share templates or user-defined formats
- Analytics or tracking of share events
- Bulk sharing functionality
- Share history or saved shares

## Functional Requirements

### Core Functionality

1. **Multi-Content Type Support**

   - Support individual asana postures with description and practice information
   - Support series flows with formatted posture lists
   - Support sequence flows with series information
   - Extensible architecture for future content types (mantras, meditation, etc.)

2. **Standardized Share Format**

   - Series sharing must follow the specified format with proper structure
   - Include branded messaging ("Practice with Uvuyoga!")
   - Use appropriate URLs for different content types
   - Support both native sharing and clipboard fallback

3. **Type Safety**
   - Use discriminated union types for content specification
   - Eliminate optional prop patterns that can cause runtime errors
   - Provide compile-time validation of content requirements

### User Interface Requirements

- Maintain existing visual design and MUI styling
- Support optional detailed information display
- Provide clear accessibility labels for screen readers
- Handle loading and error states gracefully
- Show appropriate share button text based on content type

### Integration Requirements

- Integrate with existing context providers (AsanaPostureContext, AsanaSeriesContext)
- Support new SequenceData type from SequenceContext
- Maintain compatibility with NextAuth session management
- Work within existing MUI theme system

## User Stories

### Primary User Stories

**As a yoga practitioner**
**I want to share a yoga series with proper formatting**
**So that recipients can see the complete posture list and practice information**

**Acceptance Criteria:**

- [ ] Series sharing includes title with series name
- [ ] Postures are listed with bullet points and proper formatting
- [ ] Includes "Practice with Uvuyoga!" branding
- [ ] Links to appropriate practice page
- [ ] Handles both short and long posture lists

**As a yoga instructor**
**I want to share a complete sequence with my students**
**So that they can practice the full flow independently**

**Acceptance Criteria:**

- [ ] Sequence sharing includes sequence name and description
- [ ] Lists all series within the sequence
- [ ] Provides appropriate practice link
- [ ] Includes duration and difficulty information if available

**As a mobile user**
**I want sharing to work seamlessly across platforms**
**So that I can share yoga content regardless of my device or app**

**Acceptance Criteria:**

- [ ] Uses native Web Share API when available
- [ ] Falls back to clipboard copy on unsupported browsers
- [ ] Provides clear feedback about sharing action
- [ ] Handles sharing errors gracefully

### Secondary User Stories

**As a developer**
**I want to add new content types easily**
**So that the component can grow with new features**

**Acceptance Criteria:**

- [ ] New content types can be added with minimal code changes
- [ ] Type system enforces correct data structure
- [ ] Share formatting is configurable per content type

## Technical Requirements

### Frontend Requirements

- **React functional component** with TypeScript
- **Discriminated union pattern** for content type handling
- **MUI components** for consistent styling
- **Accessibility compliance** with proper ARIA labels
- **Error boundaries** for graceful failure handling

### Backend Requirements

- **No new API endpoints** required
- **Existing data models** (FullAsanaData, FlowSeriesData, SequenceData)
- **Type definitions** for new sharing interfaces

### Data Requirements

```typescript
// Content type discriminated union
type ShareableContent =
  | { type: 'asana'; data: FullAsanaData }
  | { type: 'series'; data: FlowSeriesData }
  | { type: 'sequence'; data: SequenceData }

// Share configuration per content type
interface ShareConfig {
  title: string
  text: string
  url: string
  shareType: string
}
```

## Success Criteria

### User Experience Metrics

- Share completion rate increases by maintaining consistent UX
- Error rate decreases through improved type safety
- User feedback indicates clear, properly formatted shared content

### Technical Metrics

- TypeScript compilation with zero type errors
- 100% test coverage for all content types
- Accessibility audit passes with WCAG 2.1 AA compliance

## Dependencies

### Internal Dependencies

- **FullAsanaData** from AsanaPostureContext
- **FlowSeriesData** from AsanaSeriesContext
- **SequenceData** from SequenceContext
- **MUI theme system** for consistent styling
- **Next.js routing** for URL generation

### External Dependencies

- **Web Share API** for native sharing capabilities
- **Clipboard API** for fallback sharing method
- **Navigator interface** for feature detection

## Risks and Considerations

### Technical Risks

- **Browser compatibility** with Web Share API varies across platforms
- **Content length limits** may affect sharing on some platforms
- **URL format changes** could break existing shared links

### User Experience Risks

- **Share format changes** might confuse existing users
- **Content truncation** on platforms with character limits
- **Link accessibility** on devices without the app installed

## Implementation Notes

### File Structure Impact

- **Modify existing file**: `app/clientComponents/postureShareButton.tsx`
- **Create new type file**: `types/sharing.ts` for sharing interfaces
- **Update test file**: `__test__/app/clientComponents/postureShareButton.spec..tsx`

### Testing Strategy

- **Unit tests** for each content type sharing format
- **Integration tests** with context providers
- **Accessibility tests** for screen reader compatibility
- **Cross-browser tests** for Web Share API fallbacks

### Series Share Format Implementation

The series sharing must implement this exact format:

```
Sharing a video of
the yoga series
"[Series Name]"

Below are the postures in this series:

* [Posture 1],
* [Posture 2],
* [Posture 3],

Practice with Uvuyoga!

https://www.happyyoga.app/navigator/flows/practiceSeries

(www.happyyoga.app)
```

### Asana Share Format Implementation

The asana sharing must implement this exact format:

```
The yoga posture [Asana Posture sort name] was shared with you. Below is the description:

  [asana description]

Practice with Uvuyoga!

https://www.happyyoga.app/navigator/flows/practiceSeries

(www.happyyoga.app)
```

### Architecture Pattern

```typescript
// Share strategy pattern for extensibility
interface ShareStrategy {
  generateShareData(content: ShareableContent): ShareConfig
}

class AsanaShareStrategy implements ShareStrategy {
  generateShareData(content: {
    type: 'asana'
    data: FullAsanaData
  }): ShareConfig
}

class SeriesShareStrategy implements ShareStrategy {
  generateShareData(content: {
    type: 'series'
    data: FlowSeriesData
  }): ShareConfig
}

class SequenceShareStrategy implements ShareStrategy {
  generateShareData(content: {
    type: 'sequence'
    data: SequenceData
  }): ShareConfig
}
```

## Future Considerations

- **Custom share templates** for advanced users
- **Social platform optimization** with Open Graph meta tags
- **Share analytics** to understand content popularity
- **Collaborative features** for shared practice sessions
- **Internationalization** for multi-language share content

## Validation Criteria

Before implementation is complete, ensure:

- [ ] All three content types (asana, series, sequence) are fully supported
- [ ] Series sharing matches the exact format specification
- [ ] Component uses discriminated union pattern for type safety
- [ ] Backward compatibility is maintained for existing usage
- [ ] Accessibility requirements are met
- [ ] Error handling covers all edge cases
- [ ] Tests cover all content types and sharing scenarios
- [ ] Documentation includes usage examples for all content types
