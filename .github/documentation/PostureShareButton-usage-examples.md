# PostureShareButton Usage Examples

## Overview

The `PostureShareButton` component supports sharing yoga content (asanas, series, and sequences) using a discriminated union pattern for type safety and extensibility.

## Basic Usage Examples

### Asana (Individual Pose) Sharing

```tsx
import PostureShareButton from '@app/clientComponents/postureShareButton'
import { FullAsanaData } from '@app/context/AsanaPostureContext'

const AsanaCard = ({ asana }: { asana: FullAsanaData }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{asana.englishName}</Typography>
        <Typography variant="body2">{asana.sanskritName}</Typography>

        <PostureShareButton
          content={{
            contentType: 'asana',
            data: asana,
          }}
        />
      </CardContent>
    </Card>
  )
}
```

### Series (Flow Collection) Sharing

```tsx
import PostureShareButton from '@app/clientComponents/postureShareButton'
import { FlowSeriesData } from '@app/context/AsanaSeriesContext'

const SeriesDetails = ({ series }: { series: FlowSeriesData }) => {
  return (
    <Box>
      <Typography variant="h4">{series.seriesName}</Typography>
      <Typography variant="body1">{series.description}</Typography>

      <PostureShareButton
        content={{
          contentType: 'series',
          data: series,
        }}
        showDetails={true}
      />
    </Box>
  )
}
```

### Sequence (Practice Flow) Sharing

```tsx
import PostureShareButton from '@app/clientComponents/postureShareButton'
import { SequenceData } from '@app/context/SequenceContext'

const SequencePractice = ({ sequence }: { sequence: SequenceData }) => {
  return (
    <Container>
      <Typography variant="h3">{sequence.name}</Typography>
      <Typography variant="subtitle1">
        {sequence.poses?.length} poses • {sequence.duration} minutes
      </Typography>

      <PostureShareButton
        content={{
          contentType: 'sequence',
          data: sequence,
        }}
        showDetails={true}
        enableContextIntegration={true}
      />
    </Container>
  )
}
```

## Advanced Usage Examples

### With Custom Share Details

```tsx
const DetailedAsanaView = ({ asana }: { asana: FullAsanaData }) => {
  return (
    <Paper elevation={3}>
      <CardMedia
        component="img"
        image={asana.imageUrl}
        alt={asana.englishName}
      />

      <CardContent>
        <Typography variant="h4">{asana.englishName}</Typography>
        <Typography variant="h6" color="text.secondary">
          {asana.sanskritName}
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          {asana.description}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <PostureShareButton
            content={{
              contentType: 'asana',
              data: asana,
            }}
            showDetails={true}
            enableContextIntegration={true}
          />
        </Box>
      </CardContent>
    </Paper>
  )
}
```

### Conditional Sharing Based on Data Availability

```tsx
const FlexibleShareButton = ({
  asana,
  series,
}: {
  asana?: FullAsanaData | null
  series?: FlowSeriesData | null
}) => {
  // Determine which content to share based on availability
  if (asana) {
    return (
      <PostureShareButton
        content={{
          contentType: 'asana',
          data: asana,
        }}
      />
    )
  }

  if (series) {
    return (
      <PostureShareButton
        content={{
          contentType: 'series',
          data: series,
        }}
      />
    )
  }

  return null // No shareable content available
}
```

### With Error Boundaries

```tsx
import { ErrorBoundary } from 'react-error-boundary'

const SafeShareButton = ({ content }: { content: ShareableContent }) => {
  return (
    <ErrorBoundary
      fallback={<Typography color="error">Sharing unavailable</Typography>}
      onError={(error) => console.error('Share button error:', error)}
    >
      <PostureShareButton content={content} showDetails={true} />
    </ErrorBoundary>
  )
}
```

## Context Integration Examples

### Using with AsanaPostureContext

```tsx
import { useAsanaPosture } from '@app/context/AsanaPostureContext'

const ContextAwareAsanaShare = ({ asanaId }: { asanaId: string }) => {
  const { getAsanaById } = useAsanaPosture()
  const asana = getAsanaById(asanaId)

  if (!asana) {
    return <Typography>Asana not found</Typography>
  }

  return (
    <PostureShareButton
      content={{
        contentType: 'asana',
        data: asana,
      }}
      enableContextIntegration={true}
    />
  )
}
```

### Using with AsanaSeriesContext

```tsx
import { useFlowSeries } from '@app/context/AsanaSeriesContext'

const ContextAwareSeriesShare = ({ seriesId }: { seriesId: string }) => {
  const { getSeriesById } = useFlowSeries()
  const series = getSeriesById(seriesId)

  if (!series) {
    return <Typography>Series not found</Typography>
  }

  return (
    <PostureShareButton
      content={{
        contentType: 'series',
        data: series,
      }}
      enableContextIntegration={true}
    />
  )
}
```

## Styling Examples

### Minimal Button Style

```tsx
const MinimalShareButton = ({ content }: { content: ShareableContent }) => {
  return (
    <Box sx={{ display: 'inline-block' }}>
      <PostureShareButton content={content} showDetails={false} />
    </Box>
  )
}
```

### Full-Width Share Section

```tsx
const FullWidthShareSection = ({ content }: { content: ShareableContent }) => {
  return (
    <Paper
      sx={{
        p: 2,
        mt: 3,
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Share this {content.contentType}
      </Typography>

      <PostureShareButton
        content={content}
        showDetails={true}
        enableContextIntegration={true}
      />
    </Paper>
  )
}
```

## TypeScript Examples

### Type-Safe Content Creation

```tsx
import { ShareableContent } from '@/types/sharing'

const createAsanaContent = (asana: FullAsanaData): ShareableContent => {
  return {
    contentType: 'asana',
    data: asana,
  }
}

const createSeriesContent = (series: FlowSeriesData): ShareableContent => {
  return {
    contentType: 'series',
    data: series,
  }
}

// Usage with type safety
const MyComponent = ({ asana }: { asana: FullAsanaData }) => {
  const content = createAsanaContent(asana)

  return <PostureShareButton content={content} />
}
```

### Generic Share Component

```tsx
interface GenericShareProps<T extends ShareableContent> {
  content: T
  title?: string
  className?: string
}

const GenericShareComponent = <T extends ShareableContent>({
  content,
  title,
  className,
}: GenericShareProps<T>) => {
  return (
    <div className={className}>
      {title && <Typography variant="h6">{title}</Typography>}
      <PostureShareButton content={content} showDetails={true} />
    </div>
  )
}
```

## Accessibility Examples

### Screen Reader Friendly

```tsx
const AccessibleShareButton = ({ content }: { content: ShareableContent }) => {
  const getContentDescription = () => {
    switch (content.contentType) {
      case 'asana':
        return `${content.data.englishName} yoga pose`
      case 'series':
        return `${content.data.seriesName} yoga series`
      case 'sequence':
        return `${content.data.name} yoga sequence`
      default:
        return 'yoga content'
    }
  }

  return (
    <Box>
      <Typography variant="srOnly" component="span" id="share-description">
        Share {getContentDescription()} with others
      </Typography>

      <PostureShareButton
        content={content}
        aria-describedby="share-description"
      />
    </Box>
  )
}
```

## Props Reference

### Required Props

- `content: ShareableContent` - The yoga content to share using discriminated union pattern

### Optional Props

- `showDetails?: boolean` - Show detailed sharing information (default: false)
- `enableContextIntegration?: boolean` - Enable context provider integration (default: true)

### ShareableContent Type

```typescript
type ShareableContent =
  | { contentType: 'asana'; data: FullAsanaData }
  | { contentType: 'series'; data: FlowSeriesData }
  | { contentType: 'sequence'; data: SequenceData }
```

## Common Patterns

### Loading State

```tsx
const ShareWithLoading = ({
  content,
  isLoading,
}: {
  content?: ShareableContent
  isLoading: boolean
}) => {
  if (isLoading) {
    return <CircularProgress size={24} />
  }

  if (!content) {
    return <Typography color="text.secondary">No content to share</Typography>
  }

  return <PostureShareButton content={content} />
}
```

### Responsive Layout

```tsx
const ResponsiveShareButton = ({ content }: { content: ShareableContent }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Share this {content.contentType}:
      </Typography>

      <PostureShareButton content={content} showDetails={false} />
    </Box>
  )
}
```
