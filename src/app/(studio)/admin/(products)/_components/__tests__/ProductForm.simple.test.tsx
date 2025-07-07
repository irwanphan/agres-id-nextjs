import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock all problematic dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

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

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: (fn: any) => fn,
    control: {},
    setValue: vi.fn(),
    watch: vi.fn(() => []),
    register: vi.fn(),
    reset: vi.fn(),
    formState: { errors: {} },
  }),
  Controller: ({ render }: any) => render({ field: {}, fieldState: {} }),
}));

// Sample categories for testing
const mockCategories = [
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
  categoryId: '1',
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

// Import the component after all mocks are set up
import ProductAddForm from '../ProductForm';

describe('ProductAddForm - Basic Tests', () => {
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

  it('has Add Variant button for product variants', () => {
    render(<ProductAddForm categories={mockCategories} />);

    // Check if Add Variant button exists
    expect(screen.getByRole('button', { name: /add variant/i })).toBeDefined();
  });

  it('has Add item buttons for custom attributes and additional info', () => {
    render(<ProductAddForm categories={mockCategories} />);

    // Check if Add item buttons exist
    const addItemButtons = screen.getAllByRole('button', { name: /add item/i });
    expect(addItemButtons.length).toBeGreaterThan(0);
  });

  it('shows correct button text based on mode', () => {
    // Create mode
    const { rerender } = render(<ProductAddForm categories={mockCategories} />);
    expect(screen.getByRole('button', { name: /save product/i })).toBeDefined();

    // Edit mode
    rerender(<ProductAddForm product={mockProduct} categories={mockCategories} />);
    expect(screen.getByRole('button', { name: /update product/i })).toBeDefined();
  });

  it('renders category options correctly', () => {
    render(<ProductAddForm categories={mockCategories} />);

    // Check if category options are rendered
    expect(screen.getByText('Electronics')).toBeDefined();
    expect(screen.getByText('Clothing')).toBeDefined();
  });

  it('renders form labels correctly', () => {
    render(<ProductAddForm categories={mockCategories} />);

    // Check if form labels are rendered
    expect(screen.getByText('Title')).toBeDefined();
    expect(screen.getByText('Slug')).toBeDefined();
    expect(screen.getByText('Price')).toBeDefined();
    expect(screen.getByText('Discounted Price')).toBeDefined();
    expect(screen.getByText('Short Description')).toBeDefined();
    expect(screen.getByText('SKU')).toBeDefined();
    expect(screen.getByText('Quantity')).toBeDefined();
    expect(screen.getByText('Category')).toBeDefined();
  });

  it('renders tag input labels correctly', () => {
    render(<ProductAddForm categories={mockCategories} />);

    // Check if tag input labels are rendered
    expect(screen.getByText('Enter Multiple Offers')).toBeDefined();
    expect(screen.getByText('Enter Multiple Tags')).toBeDefined();
  });
}); 