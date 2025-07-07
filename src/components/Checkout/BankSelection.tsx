'use client';


import Image from 'next/image';

export interface BankOption {
  id: string;
  name: string;
  code: string;
  logo: string;
  description?: string;
}

interface BankSelectionProps {
  selectedBank: string;
  onBankSelect: (bankCode: string) => void;
  banks?: BankOption[];
  disabled?: boolean;
  className?: string;
}

const defaultBanks: BankOption[] = [
  {
    id: 'bca',
    name: 'BCA Virtual Account',
    code: 'bca',
    logo: '/images/checkout/bca.svg',
    description: 'Bank Central Asia'
  },
  {
    id: 'bni',
    name: 'BNI Virtual Account',
    code: 'bni',
    logo: '/images/checkout/bni.svg',
    description: 'Bank Negara Indonesia'
  },
  {
    id: 'mandiri',
    name: 'Mandiri Virtual Account',
    code: 'mandiri',
    logo: '/images/checkout/mandiri.svg',
    description: 'Bank Mandiri'
  },
  {
    id: 'bri',
    name: 'BRI Virtual Account',
    code: 'bri',
    logo: '/images/checkout/bri.svg',
    description: 'Bank Rakyat Indonesia'
  },
  {
    id: 'permata',
    name: 'Permata Virtual Account',
    code: 'permata',
    logo: '/images/checkout/permata.svg',
    description: 'Bank Permata'
  }
];

const BankSelection: React.FC<BankSelectionProps> = ({
  selectedBank,
  onBankSelect,
  banks = defaultBanks,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Pilih Bank untuk Transfer
      </h3>
      
      <div className="grid grid-cols-1 gap-3">
        {banks.map((bank) => (
          <BankOptionCard
            key={bank.id}
            bank={bank}
            isSelected={selectedBank === bank.code}
            onSelect={() => onBankSelect(bank.code)}
            disabled={disabled}
          />
        ))}
      </div>
      
      {selectedBank && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Anda akan menerima instruksi pembayaran via {' '}
            <span className="font-semibold">
              {banks.find(b => b.code === selectedBank)?.name}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

interface BankOptionCardProps {
  bank: BankOption;
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
}

const BankOptionCard: React.FC<BankOptionCardProps> = ({
  bank,
  isSelected,
  onSelect,
  disabled
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`
        relative w-full p-3 border-1 rounded-lg transition-all duration-200
        ${isSelected 
          ? 'border-blue-500 bg-blue-light-5 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <Image
            src={bank.logo}
            alt={`${bank.name} logo`}
            width={40}
            height={40}
            className="w-16 h-10 object-contain"
          />
        </div>
        
        <div className="flex-1 text-left">
          <p className="font-medium text-gray-7 text-md">
            {bank.name}
          </p>
          {bank.description && (
            <p className="text-xs text-gray-6 mt-1">
              {bank.description}
            </p>
          )}
        </div>
        
        {isSelected && (
          <div className="flex-shrink-0">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

export default BankSelection; 