import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ProductAddForm from '../ProductForm';
import { Category } from '@prisma/client';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the actions
vi.mock('@/app/actions/product', () => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
}));

// Mock QuillEditor component
vi.mock('../../_components/QuillEditor', () => ({
  default: ({ label, value, onChange }: any) => (
    <div>
      <label>{label}</label>
      <textarea
        data-testid={`quill-${label.toLowerCase()}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  ),
}));

// Mock ThumbImageModal component
vi.mock('../ThumbImageModal', () => ({
  default: ({ isOpen, closeModal }: any) =>
    isOpen ? (
      <div data-testid="thumb-modal">
        <button onClick={closeModal}>Close Modal</button>
      </div>
    ) : null,
}));

// Mock CustomProjectModal component
vi.mock('../CustomProjectModal', () => ({
  default: ({ isOpen, closeModal }: any) =>
    isOpen ? (
      <div data-testid="custom-attr-modal">
        <button onClick={closeModal}>Close Modal</button>
      </div>
    ) : null,
}));

// Mock AdditionalInfoModal component
vi.mock('../AdditionalInfoModal', () => ({
  default: ({ isOpen, closeModal }: any) =>
    isOpen ? (
      <div data-testid="additional-info-modal">
        <button onClick={closeModal}>Close Modal</button>
      </div>
    ) : null,
}));

// Mock TagInput component
vi.mock('@/components/ui/input/TagInput', () => ({
  TagInput: ({ name, label }: any) => (
    <div>
      <label>{label}</label>
      <input data-testid={`tag-input-${name}`} />
    </div>
  ),
}));

// Mock InputGroup component
vi.mock('@/components/ui/input', () => ({
  InputGroup: ({ label, type, placeholder, required, error, errorMessage, ...props }: any) => (
    <div>
      <label>
        {label} {required && <span>*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...props}
        data-testid={`input-${label.toLowerCase().replace(/\s+/g, '-')}`}
      />
      {error && errorMessage && <span data-testid={`error-${label.toLowerCase().replace(/\s+/g, '-')}`}>{errorMessage}</span>}
    </div>
  ),
}));

// Mock Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock icons
vi.mock('@/assets/icons', () => ({
  ChevronDownIcon: () => <span>ChevronDown</span>,
  CircleXIcon: () => <span>CircleX</span>,
  PlusIcon: () => <span>Plus</span>,
}));

// Mock utils
vi.mock('@/utils/cn', () => ({
  default: (...classes: string[]) => classes.join(' '),
}));

vi.mock('@/utils/slugGenerate', () => ({
  generateSlug: (title: string) => title.toLowerCase().replace(/\s+/g, '-'),
}));

// Mock file validation
vi.mock('@/utils/fileValidation', () => ({
  validateFiles: vi.fn(() => ({ isValid: true, error: null })),
}));

// Sample categories for testing
const mockCategories: Category[] = [
  {
    id: 1,
    title: 'Electronics',
    img: 'electronics.jpg',
    description: 'Electronic devices',
    slug: 'electronics',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: 'Clothing',
    img: 'clothing.jpg',
    description: 'Clothing items',
    slug: 'clothing',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Sample product for edit mode
const mockProduct = {
  id: '1',
  title: 'Test Product',
  price: 100,
  discountedPrice: 80,
  categoryId: '1', // Changed to string to match IProductAllField type
  tags: ['test', 'product'],
  description: 'Test description',
  shortDescription: 'Short test description',
  productVariants: [
    {
      color: 'Red',
      size: 'M',
      weight: 100,
      length: 10,
      width: 5,
      height: 2,
      image: 'test-image.jpg',
      isDefault: true,
    },
  ],
  additionalInformation: [
    { name: 'Material', description: 'Cotton' },
  ],
  customAttributes: [
    {
      attributeName: 'Size',
      attributeValues: [
        { id: '1', title: 'Small' },
        { id: '2', title: 'Medium' },
      ],
    },
  ],
  offers: ['Free shipping'],
  slug: 'test-product',
  sku: 'TEST001',
  quantity: 10,
  body: 'Product body content',
};

describe('ProductAddForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly in create mode', () => {
    render(<ProductAddForm categories={mockCategories} />);

    // Check if main form fields are rendered
    expect(screen.getByTestId('input-title')).toBeDefined();
    expect(screen.getByTestId('input-slug')).toBeDefined();
    expect(screen.getByTestId('input-price')).toBeDefined();
    expect(screen.getByTestId('input-discounted-price')).toBeDefined();
    expect(screen.getByTestId('input-short-description')).toBeDefined();
    expect(screen.getByTestId('input-sku')).toBeDefined();
    expect(screen.getByTestId('input-quantity')).toBeDefined();

    // Check if category select is rendered
    expect(screen.getByDisplayValue('Select a category')).toBeDefined();

    // Check if tag inputs are rendered
    expect(screen.getByTestId('tag-input-offers')).toBeDefined();
    expect(screen.getByTestId('tag-input-tags')).toBeDefined();

    // Check if QuillEditor components are rendered
    expect(screen.getByTestId('quill-description')).toBeDefined();
    expect(screen.getByTestId('quill-body')).toBeDefined();

    // Check if submit button is rendered
    expect(screen.getByRole('button', { name: /save product/i })).toBeDefined();
  });

  it('renders form fields with product data in edit mode', () => {
    render(<ProductAddForm product={mockProduct} categories={mockCategories} />);

    // Check if form is populated with product data
    expect(screen.getByDisplayValue('Test Product')).toBeDefined();
    expect(screen.getByDisplayValue('test-product')).toBeDefined();
    expect(screen.getByDisplayValue('100')).toBeDefined();
    expect(screen.getByDisplayValue('80')).toBeDefined();
    expect(screen.getByDisplayValue('Short test description')).toBeDefined();
    expect(screen.getByDisplayValue('TEST001')).toBeDefined();
    expect(screen.getByDisplayValue('10')).toBeDefined();

    // Check if submit button shows "Update Product"
    expect(screen.getByRole('button', { name: /update product/i })).toBeDefined();
  });

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup();
    render(<ProductAddForm categories={mockCategories} />);

    // Try to submit form without filling required fields
    const submitButton = screen.getByRole('button', { name: /save product/i });
    await user.click(submitButton);

    // Check if validation errors are shown
    await waitFor(() => {
      expect(screen.getByTestId('error-title')).toBeDefined();
      expect(screen.getByTestId('error-price')).toBeDefined();
      expect(screen.getByTestId('error-short-description')).toBeDefined();
      expect(screen.getByTestId('error-quantity')).toBeDefined();
    });
  });

  it('validates that discounted price cannot be greater than price', async () => {
    const user = userEvent.setup();
    render(<ProductAddForm categories={mockCategories} />);

    // Fill in required fields
    await user.type(screen.getByTestId('input-title'), 'Test Product');
    await user.type(screen.getByTestId('input-price'), '100');
    await user.type(screen.getByTestId('input-discounted-price'), '150');
    await user.type(screen.getByTestId('input-short-description'), 'Short description');
    await user.type(screen.getByTestId('input-quantity'), '10');
    
    // Select category
    const categorySelect = screen.getByDisplayValue('Select a category');
    await user.selectOptions(categorySelect, '1');

    // Try to submit form
    const submitButton = screen.getByRole('button', { name: /save product/i });
    await user.click(submitButton);

    // Check if error toast is called
    await waitFor(() => {
      const { error } = require('react-hot-toast');
      expect(error).toHaveBeenCalledWith('Discounted Price cannot be greater than Price');
    });
  });

  it('opens ThumbImageModal when Add Variant button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductAddForm categories={mockCategories} />);

    // Click Add Variant button
    const addVariantButton = screen.getByRole('button', { name: /add variant/i });
    await user.click(addVariantButton);

    // Check if modal is opened
    expect(screen.getByTestId('thumb-modal')).toBeDefined();
  });

  it('opens CustomProjectModal when Add item button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductAddForm categories={mockCategories} />);

    // Click Add item button for custom attributes
    const addCustomAttrButton = screen.getByRole('button', { name: /add item/i });
    await user.click(addCustomAttrButton);

    // Check if modal is opened
    expect(screen.getByTestId('custom-attr-modal')).toBeDefined();
  });

  it('opens AdditionalInfoModal when Add item button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductAddForm categories={mockCategories} />);

    // Find the second "Add item" button (for additional info)
    const addItemButtons = screen.getAllByRole('button', { name: /add item/i });
    await user.click(addItemButtons[1]); // Second button is for additional info

    // Check if modal is opened
    expect(screen.getByTestId('additional-info-modal')).toBeDefined();
  });

  it('displays existing product variants in edit mode', () => {
    render(<ProductAddForm product={mockProduct} categories={mockCategories} />);

    // Check if existing variant is displayed
    expect(screen.getByText('Red')).toBeDefined();
    expect(screen.getByText('M')).toBeDefined();
    expect(screen.getByAltText('Thumbnail')).toBeDefined();
  });

  it('displays existing custom attributes in edit mode', () => {
    render(<ProductAddForm product={mockProduct} categories={mockCategories} />);

    // Check if existing custom attribute is displayed
    expect(screen.getByText('Size')).toBeDefined();
    expect(screen.getByText('1. Small')).toBeDefined();
    expect(screen.getByText('2. Medium')).toBeDefined();
  });

  it('displays existing additional information in edit mode', () => {
    render(<ProductAddForm product={mockProduct} categories={mockCategories} />);

    // Check if existing additional info is displayed
    expect(screen.getByText('Material')).toBeDefined();
    expect(screen.getByText('Cotton')).toBeDefined();
  });

  it('generates slug automatically when title is entered and slug is empty', async () => {
    const user = userEvent.setup();
    render(<ProductAddForm categories={mockCategories} />);

    // Enter title
    await user.type(screen.getByTestId('input-title'), 'Test Product Title');

    // Check if slug is generated automatically
    await waitFor(() => {
      expect(screen.getByDisplayValue('test-product-title')).toBeDefined();
    });
  });

  it('shows loading state during form submission', async () => {
    const user = userEvent.setup();
    
    // Mock createProduct to return a promise that doesn't resolve immediately
    const { createProduct } = require('@/app/actions/product');
    createProduct.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<ProductAddForm categories={mockCategories} />);

    // Fill in required fields
    await user.type(screen.getByTestId('input-title'), 'Test Product');
    await user.type(screen.getByTestId('input-price'), '100');
    await user.type(screen.getByTestId('input-short-description'), 'Short description');
    await user.type(screen.getByTestId('input-quantity'), '10');
    
    // Select category
    const categorySelect = screen.getByDisplayValue('Select a category');
    await user.selectOptions(categorySelect, '1');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save product/i });
    await user.click(submitButton);

    // Check if button shows loading state
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /saving/i })).toBeDefined();
    });
  });
}); 