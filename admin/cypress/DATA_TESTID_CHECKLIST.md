# Data-Testid Checklist for Media Manager Components

This checklist documents all required `data-testid` attributes for E2E tests. Developers should ensure these attributes are present in the actual components.

## 📋 MediaPage.tsx

### Grid & Layout

- [ ] `data-testid="media-grid"` - Main media grid container
- [ ] `data-testid="media-list"` - Alternative list view container
- [ ] `data-testid="media-count"` - Total media count display
- [ ] `data-testid="empty-state"` - Empty state message container
- [ ] `data-testid="error-message"` - Error message container
- [ ] `data-testid="retry-button"` - Retry button after error

### Search & Filters

- [ ] `data-testid="media-search"` - Search input field
- [ ] `data-testid="clear-search"` - Clear search button
- [ ] `data-testid="tag-filter-button"` - Tag filter dropdown trigger
- [ ] `data-testid="tag-filter-dropdown"` - Tag filter dropdown menu
- [ ] `data-testid="tag-option-{tagName}"` - Individual tag options (e.g., "tag-option-tour")
- [ ] `data-testid="active-tags"` - Active tags display
- [ ] `data-testid="clear-tags-button"` - Clear all tags button

### View Options

- [ ] `data-testid="view-toggle-grid"` - Grid view toggle button
- [ ] `data-testid="view-toggle-list"` - List view toggle button

### Pagination

- [ ] `data-testid="pagination"` - Pagination container
- [ ] `data-testid="next-page"` - Next page button
- [ ] `data-testid="prev-page"` - Previous page button

### Media Cards

- [ ] `data-testid="media-card"` - Individual media card
- [ ] `data-testid="media-card-{id}"` - Media card with specific ID
- [ ] `data-testid="media-thumbnail"` - Thumbnail image
- [ ] `data-testid="media-title"` - Media title text
- [ ] `data-testid="media-tags"` - Tags display on card

### Actions

- [ ] `data-testid="upload-button"` - Upload new media button
- [ ] `data-testid="upload-first-media-button"` - Upload button in empty state
- [ ] `data-testid="no-results"` - No search results message

---

## 📋 MediaUpload.tsx

### Dialog

- [ ] `data-testid="upload-dialog"` - Upload modal/dialog
- [ ] `data-testid="upload-dialog-title"` - Dialog title
- [ ] `data-testid="cancel-upload"` - Cancel button
- [ ] `data-testid="close-dialog"` - Close button

### File Input

- [ ] `data-testid="file-input"` - File input element
- [ ] `data-testid="file-preview"` - File preview container
- [ ] `data-testid="file-name"` - Selected filename display
- [ ] `data-testid="file-info"` - File size/type info
- [ ] `data-testid="image-preview"` - Image preview (when image selected)
- [ ] `data-testid="remove-file"` - Remove selected file button

### Form Fields

- [ ] `data-testid="title-input"` - Title input field
- [ ] `data-testid="title-error"` - Title validation error message
- [ ] `data-testid="description-input"` - Description textarea
- [ ] `data-testid="description-error"` - Description validation error
- [ ] `data-testid="tag-input"` - Tag input field
- [ ] `data-testid="tag-badge-{tagName}"` - Individual tag badge
- [ ] `data-testid="remove-tag-{tagName}"` - Remove tag button
- [ ] `data-testid="tag-suggestions"` - Tag suggestions dropdown
- [ ] `data-testid="tag-suggestion-{tagName}"` - Individual tag suggestion

### Validation Errors

- [ ] `data-testid="file-type-error"` - File type validation error
- [ ] `data-testid="file-size-error"` - File size validation error

### Upload Actions

- [ ] `data-testid="submit-upload"` - Submit/upload button
- [ ] `data-testid="upload-progress"` - Upload progress indicator
- [ ] `data-testid="upload-status"` - Upload status text

### Toasts

- [ ] `data-testid="toast-success"` - Success toast notification
- [ ] `data-testid="toast-error"` - Error toast notification

---

## 📋 MediaDetailsModal.tsx

### Modal Structure

- [ ] `data-testid="media-details-modal"` - Main modal container
- [ ] `data-testid="modal-backdrop"` - Modal backdrop (for close on click)
- [ ] `data-testid="close-modal"` - Close button

### Image Display

- [ ] `data-testid="modal-image"` - Full-size image
- [ ] `data-testid="zoom-in"` - Zoom in button
- [ ] `data-testid="zoom-out"` - Zoom out button
- [ ] `data-testid="zoom-reset"` - Reset zoom button

### Metadata Display (View Mode)

- [ ] `data-testid="modal-title"` - Media title
- [ ] `data-testid="modal-description"` - Media description
- [ ] `data-testid="modal-tags"` - Tags display
- [ ] `data-testid="modal-file-info"` - File info container
- [ ] `data-testid="upload-date"` - Upload date
- [ ] `data-testid="file-size"` - File size
- [ ] `data-testid="file-type"` - File type (JPEG, PNG, etc.)

### Edit Mode

- [ ] `data-testid="edit-button"` - Enter edit mode button
- [ ] `data-testid="edit-form"` - Edit form container
- [ ] `data-testid="title-input"` - Title input (edit mode)
- [ ] `data-testid="description-input"` - Description textarea (edit mode)
- [ ] `data-testid="tag-input"` - Tag input (edit mode)
- [ ] `data-testid="remove-tag-{tagName}"` - Remove tag button
- [ ] `data-testid="save-button"` - Save changes button
- [ ] `data-testid="cancel-edit"` - Cancel edit button
- [ ] `data-testid="confirm-discard"` - Confirm discard changes dialog

### Validation

- [ ] `data-testid="title-error"` - Title validation error

### Deletion

- [ ] `data-testid="delete-button"` - Delete media button
- [ ] `data-testid="delete-confirm-dialog"` - Delete confirmation dialog
- [ ] `data-testid="confirm-delete"` - Confirm deletion button
- [ ] `data-testid="cancel-delete"` - Cancel deletion button

### Copy Actions

- [ ] `data-testid="copy-url"` - Copy URL button
- [ ] `data-testid="copy-markdown"` - Copy markdown link button

### Navigation (Future)

- [ ] `data-testid="next-image"` - Next image button
- [ ] `data-testid="prev-image"` - Previous image button

---

## 📋 MediaPicker.tsx

### Picker Container

- [ ] `data-testid="media-picker"` - Media picker section in form
- [ ] `data-testid="select-media-button"` - Open picker button
- [ ] `data-testid="media-picker-dialog"` - Picker dialog/modal
- [ ] `data-testid="media-picker-grid"` - Media grid inside picker

### Picker Items

- [ ] `data-testid="media-picker-item"` - Individual media item in picker
- [ ] `data-testid="selected-count"` - Selected items count

### Search & Filter in Picker

- [ ] `data-testid="picker-search"` - Search input in picker
- [ ] `data-testid="picker-tag-filter"` - Tag filter in picker
- [ ] `data-testid="picker-tag-option-{tagName}"` - Tag options in picker
- [ ] `data-testid="picker-no-results"` - No results message in picker

### Upload in Picker

- [ ] `data-testid="picker-upload-button"` - Upload button in picker

### Selection Actions

- [ ] `data-testid="confirm-selection"` - Confirm selection button
- [ ] `data-testid="cancel-selection"` - Cancel selection button
- [ ] `data-testid="max-selection-warning"` - Max selection warning message

### Selected Media Display

- [ ] `data-testid="selected-media-preview"` - Selected media preview container
- [ ] `data-testid="selected-media-item"` - Individual selected media item
- [ ] `data-testid="remove-media-{index}"` - Remove media button (by index)

---

## 📋 TourForm.tsx / POIForm.tsx

### Tabs

- [ ] `data-testid="tab-media"` - Media tab in form

---

## 🎯 Implementation Tips

### 1. Consistent Naming

```tsx
// Good: Descriptive and unique
<button data-testid="upload-button">Upload</button>
<input data-testid="title-input" />
<div data-testid="media-grid">...</div>

// Bad: Too generic or missing
<button>Upload</button>
<input id="title" />
<div className="grid">...</div>
```

### 2. Dynamic IDs

```tsx
// For items in lists, include unique identifier
{
  media.map((item) => (
    <div key={item.id} data-testid={`media-card-${item.id}`}>
      {/* ... */}
    </div>
  ));
}

// For tags, include tag name
{
  tags.map((tag) => (
    <span key={tag} data-testid={`tag-badge-${tag}`}>
      {tag}
      <button data-testid={`remove-tag-${tag}`}>×</button>
    </span>
  ));
}
```

### 3. Error Messages

```tsx
{
  errors.title && (
    <span data-testid="title-error" className="error">
      {errors.title.message}
    </span>
  );
}
```

### 4. Conditional Elements

```tsx
{
  isLoading ? (
    <div data-testid="loading-spinner">Loading...</div>
  ) : (
    <div data-testid="media-grid">{/* ... */}</div>
  );
}
```

### 5. Toasts (with Sonner)

```tsx
import { toast } from 'sonner';

toast.success(<div data-testid="toast-success">Upload successful!</div>);

toast.error(<div data-testid="toast-error">Upload failed</div>);
```

---

## ✅ Validation Checklist

After adding data-testid attributes, verify:

- [ ] All attributes are lowercase with hyphens (kebab-case)
- [ ] Dynamic IDs use template literals with unique values
- [ ] No duplicate data-testids in the same view
- [ ] data-testid is separate from className/id
- [ ] All interactive elements have data-testid
- [ ] Error messages have data-testid
- [ ] Loading states have data-testid

---

## 🧪 Testing the Attributes

### Quick Test (Browser Console)

```javascript
// Check if all required testids exist
const requiredIds = [
  'media-grid',
  'media-search',
  'upload-button',
  // ... add all required IDs
];

requiredIds.forEach((id) => {
  const element = document.querySelector(`[data-testid="${id}"]`);
  console.log(`${id}: ${element ? '✅' : '❌'}`);
});
```

### Cypress Test

```typescript
// In cypress/e2e/media/check-testids.cy.tsx
describe('Data-testid Validation', () => {
  it('should have all required testids', () => {
    cy.visit('/admin/media');

    const requiredIds = ['media-grid', 'media-search', 'upload-button'];

    requiredIds.forEach((id) => {
      cy.get(`[data-testid="${id}"]`).should('exist');
    });
  });
});
```

---

## 📝 Notes

1. **Consistency**: Use the exact data-testid values listed here
2. **Dynamic Values**: For loops, use template literals (e.g., `data-testid={`media-card-${id}`}`)
3. **Optional Elements**: Elements that may not always render should still have data-testid when present
4. **Third-party Components**: If using libraries (like shadcn/ui), wrap or extend to add data-testid

---

## 🔄 Updates

When adding new features, remember to:

1. Add new data-testid attributes
2. Update this checklist
3. Update E2E tests
4. Document in TEST_REPORT.md

---

**Status**: ⚠️ These attributes need to be added to actual components before tests can run successfully.

**Estimated Time**: ~2-3 hours to add all attributes across 4 components.
