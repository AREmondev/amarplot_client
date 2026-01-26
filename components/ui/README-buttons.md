# Button Component System

This document provides an overview of the button component system, which includes various button types, variants, and usage examples.

## Table of Contents

- [Standard Button](#standard-button)
- [Button Group](#button-group)
- [Icon Button](#icon-button)
- [Link Button](#link-button)
- [Toggle Button](#toggle-button)
- [Split Button](#split-button)
- [Floating Action Button](#floating-action-button)
- [Best Practices](#best-practices)

## Standard Button

The `Button` component is the foundation of our button system. It supports multiple variants, sizes, and features.

### Features

- **Variants**: default, secondary, outline, ghost, link, destructive, success, warning, info, subtle, accent, outline-primary, outline-destructive
- **Sizes**: xs, sm, default, lg, xl
- **Rounded Styles**: none, sm, default, lg, xl, full
- **Loading State**: Displays a spinner and optional loading text
- **Icons**: Support for left and right icons
- **Full Width**: Option to make the button take up the full width of its container

### Usage

```tsx
// Basic usage
<Button>Default Button</Button>

// With variants
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>

// With sizes
<Button size="sm">Small Button</Button>
<Button size="lg">Large Button</Button>

// With icons
<Button leftIcon={<Search />}>Search</Button>
<Button rightIcon={<ArrowRight />}>Next</Button>

// Loading state
<Button isLoading>Loading</Button>
<Button isLoading loadingText="Saving...">Save</Button>

// Full width
<Button fullWidth>Full Width Button</Button>
```

## Button Group

The `ButtonGroup` component allows you to group related buttons together with consistent styling.

### Features

- **Variants**: default, attached, segmented
- **Orientation**: horizontal, vertical
- **Full Width**: Option to make the button group take up the full width of its container

### Usage

```tsx
// Attached buttons (default)
<ButtonGroup>
  <Button>Left</Button>
  <Button>Middle</Button>
  <Button>Right</Button>
</ButtonGroup>

// Segmented buttons
<ButtonGroup variant="segmented">
  <Button>Day</Button>
  <Button>Week</Button>
  <Button>Month</Button>
</ButtonGroup>

// Vertical orientation
<ButtonGroup orientation="vertical">
  <Button>Top</Button>
  <Button>Middle</Button>
  <Button>Bottom</Button>
</ButtonGroup>
```

## Icon Button

The `IconButton` component is designed for icon-only buttons with improved accessibility.

### Features

- **Variants**: Same as standard Button
- **Sizes**: xs, sm, default, lg
- **Rounded Styles**: none, sm, default, lg, xl, full
- **Loading State**: Displays a spinner when loading
- **Accessibility**: Requires aria-label for better accessibility

### Usage

```tsx
<IconButton 
  icon={<Search />} 
  aria-label="Search" 
/>

<IconButton 
  icon={<Heart />} 
  variant="secondary" 
  aria-label="Favorite" 
/>

<IconButton 
  icon={<Trash />} 
  variant="destructive" 
  size="sm" 
  aria-label="Delete" 
/>
```

## Link Button

The `LinkButton` component extends the standard Button styling but renders as an anchor tag.

### Features

- **Variants**: Same as standard Button
- **Sizes**: Same as standard Button
- **Rounded Styles**: Same as standard Button
- **Icons**: Support for left and right icons
- **External Links**: Support for opening links in new tabs

### Usage

```tsx
// Internal link
<LinkButton href="/dashboard">Dashboard</LinkButton>

// External link
<LinkButton 
  href="https://example.com" 
  external 
  rightIcon={<ArrowRight />}
>
  External Link
</LinkButton>

// With variants
<LinkButton 
  href="/profile" 
  variant="outline" 
  leftIcon={<User />}
>
  Profile
</LinkButton>
```

## Toggle Button

The `ToggleButton` component is a button that can be toggled on or off.

### Features

- **Variants**: default, outline, subtle, ghost, primary
- **Sizes**: xs, sm, default, lg, xl
- **Rounded Styles**: Same as standard Button
- **Controlled/Uncontrolled**: Support for both controlled and uncontrolled state
- **Icons**: Support for left and right icons

### Usage

```tsx
// Uncontrolled
<ToggleButton>Toggle Me</ToggleButton>

// Controlled
<ToggleButton 
  pressed={isPressed} 
  onChange={setIsPressed}
>
  {isPressed ? "On" : "Off"}
</ToggleButton>

// With icons
<ToggleButton 
  variant="outline" 
  leftIcon={<Filter />}
>
  Filter
</ToggleButton>
```

## Split Button

The `SplitButton` component combines a primary button action with a dropdown menu for related actions.

### Features

- **Variants**: Same as standard Button
- **Sizes**: Same as standard Button
- **Rounded Styles**: Same as standard Button
- **Loading State**: Displays a spinner and optional loading text
- **Icons**: Support for left and right icons

### Usage

```tsx
<SplitButton 
  menuItems={
    <>
      <DropdownMenuItem>Save as Draft</DropdownMenuItem>
      <DropdownMenuItem>Schedule</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Cancel</DropdownMenuItem>
    </>
  }
>
  Save
</SplitButton>
```

## Floating Action Button

The `FloatingActionButton` (FAB) component is a circular button that represents the primary action in an application.

### Features

- **Variants**: default, secondary, accent, destructive, success, warning, info
- **Sizes**: sm, default, lg, xl
- **Positions**: bottom-right, bottom-left, top-right, top-left, bottom-center, top-center
- **Extended**: Option to show a label alongside the icon
- **Elevation**: low, default, high

### Usage

```tsx
// Basic FAB
<FloatingActionButton 
  icon={<Plus />} 
  aria-label="Add item" 
/>

// Extended FAB with label
<FloatingActionButton 
  icon={<Edit />} 
  label="Edit" 
  extended 
  variant="secondary" 
/>

// Custom position
<FloatingActionButton 
  icon={<Upload />} 
  position="top-right" 
  elevation="high" 
/>
```

## Best Practices

1. **Consistency**: Use the same button variant for the same type of action across your application.

2. **Hierarchy**: Use button variants to establish a visual hierarchy:
   - Primary actions: `default` or `primary` variant
   - Secondary actions: `secondary` or `outline` variant
   - Destructive actions: `destructive` variant
   - Tertiary actions: `ghost` or `link` variant

3. **Accessibility**:
   - Always provide an `aria-label` for icon-only buttons
   - Ensure sufficient color contrast for all button variants
   - Use loading states to indicate when an action is being processed

4. **Sizing**:
   - Use consistent button sizes throughout your application
   - Consider using larger buttons for touch-friendly interfaces
   - Use smaller buttons for dense UIs or secondary actions

5. **Icons**:
   - Use icons to reinforce the button's action
   - Ensure icons are recognizable and have a clear meaning
   - Combine icons with text for better clarity when space allows

6. **Responsive Design**:
   - Consider how buttons will appear on different screen sizes
   - Use `fullWidth` for important actions on mobile devices
   - Consider using `IconButton` for space-constrained interfaces