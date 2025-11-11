import React, { useState, useRef, useEffect, useCallback } from 'react';

// Icons
const ArrowLeftIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

enum SignUpStep {
  AddContact,
  CreatePassword,
  VerifyContact,
  Success,
}

interface SignUpFlowProps {
  onComplete: () => void;
  onBack: () => void;
}

const ProgressIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div className="flex justify-center items-center gap-2 mb-8">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <div
        key={index}
        className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
          index < currentStep ? 'w-12 bg-violet-600' : 'w-8 bg-gray-200'
        }`}
      />
    ))}
  </div>
);

const AddContactStep: React.FC<{ onSubmit: (contact: string, method: 'phone' | 'email') => void }> = ({ onSubmit }) => {
  const [signupMethod, setSignupMethod] = useState<'phone' | 'email'>('phone');
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const isPhoneValid = phoneInput.length === 10;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupMethod === 'phone' && isPhoneValid) {
      onSubmit(`+234${phoneInput}`, 'phone');
    } else if (signupMethod === 'email' && isEmailValid) {
      onSubmit(emailInput, 'email');
    }
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 10) {
      setPhoneInput(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full animate-fadeIn">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create your account</h2>
        <p className="text-gray-500 mb-6">Enter your contact information to get started</p>

        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => setSignupMethod('phone')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              signupMethod === 'phone'
                ? 'bg-violet-100 text-violet-700 shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Phone
          </button>
          <button
            type="button"
            onClick={() => setSignupMethod('email')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              signupMethod === 'email'
                ? 'bg-violet-100 text-violet-700 shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Email
          </button>
        </div>

        {signupMethod === 'phone' ? (
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="flex items-center p-4 border-2 border-gray-200 rounded-2xl focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100 transition-all bg-white">
              <span className="font-semibold text-gray-500 pr-3 border-r-2 border-gray-200">+234</span>
              <input
                id="phone"
                type="tel"
                value={phoneInput}
                onChange={handlePhoneInputChange}
                placeholder="801 234 5678"
                className="w-full pl-3 outline-none bg-transparent text-gray-800 text-lg"
                autoFocus
              />
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="flex items-center p-4 border-2 border-gray-200 rounded-2xl focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100 transition-all bg-white">
              <input
                id="email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="you@example.com"
                className="w-full outline-none bg-transparent text-gray-800 text-lg"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={signupMethod === 'phone' ? !isPhoneValid : !isEmailValid}
        className="w-full mt-6 py-4 px-6 bg-violet-600 text-white rounded-2xl font-semibold transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-violet-700 hover:shadow-lg active:scale-98"
      >
        Continue
      </button>
    </form>
  );
};

const CreatePasswordStep: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordValid = password.length >= 8;

  const getPasswordStrength = () => {
    if (password.length === 0) return { text: '', color: '' };
    if (password.length < 6) return { text: 'Weak', color: 'text-red-500' };
    if (password.length < 8) return { text: 'Fair', color: 'text-orange-500' };
    if (password.length < 12) return { text: 'Good', color: 'text-green-500' };
    return { text: 'Strong', color: 'text-green-600' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPasswordValid) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full animate-fadeIn">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create a password</h2>
        <p className="text-gray-500 mb-6">Secure your account with a strong password</p>

        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={isPasswordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter at least 8 characters"
            className="w-full p-4 pr-12 border-2 border-gray-200 rounded-2xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all bg-white text-gray-800 text-lg"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        </div>
        {password.length > 0 && (
          <div className="mt-3 flex items-center gap-2 animate-fadeIn">
            <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  password.length < 6
                    ? 'w-1/4 bg-red-500'
                    : password.length < 8
                    ? 'w-1/2 bg-orange-500'
                    : password.length < 12
                    ? 'w-3/4 bg-green-500'
                    : 'w-full bg-green-600'
                }`}
              />
            </div>
            <span className={`text-sm font-semibold ${strength.color}`}>{strength.text}</span>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-4">
          Password must be at least 8 characters long
        </p>
      </div>
      <button
        type="submit"
        disabled={!isPasswordValid}
        className="w-full mt-6 py-4 px-6 bg-violet-600 text-white rounded-2xl font-semibold transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-violet-700 hover:shadow-lg active:scale-98"
      >
        Continue
      </button>
    </form>
  );
};

const VerifyContactStep: React.FC<{ contact: string; method: 'phone' | 'email'; onVerified: () => void }> = ({
  contact,
  method,
  onVerified,
}) => {
  const [code, setCode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const CODE_LENGTH = 6;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= CODE_LENGTH) {
      setCode(value);
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const onVerifiedCallback = useCallback(onVerified, [onVerified]);

  useEffect(() => {
    if (code.length === CODE_LENGTH) {
      setTimeout(() => onVerifiedCallback(), 500);
    }
  }, [code, onVerifiedCallback]);

  return (
    <div className="flex flex-col h-full animate-fadeIn">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify your {method}</h2>
        <p className="text-gray-500 mb-8">
          We sent a {CODE_LENGTH}-digit code to{' '}
          <span className="font-semibold text-gray-800">{contact}</span>
        </p>

        <label className="block text-sm font-semibold text-gray-700 mb-4">Verification Code</label>
        <div className="flex justify-center gap-3 cursor-text" onClick={handleContainerClick}>
          {Array.from({ length: CODE_LENGTH }).map((_, index) => (
            <div
              key={index}
              className={`w-14 h-16 flex items-center justify-center text-2xl font-bold rounded-2xl transition-all duration-300 ${
                code.length > index
                  ? 'bg-violet-600 text-white border-2 border-violet-600 scale-105 shadow-lg'
                  : code.length === index
                  ? 'border-2 border-violet-500 bg-violet-50 scale-105'
                  : 'border-2 border-gray-200 bg-white'
              }`}
            >
              {code[index] || ''}
            </div>
          ))}
        </div>
        <input
          ref={inputRef}
          type="tel"
          value={code}
          onChange={handleInputChange}
          maxLength={CODE_LENGTH}
          className="absolute opacity-0 w-0 h-0"
          autoFocus
        />

        <button
          type="button"
          className="w-full mt-8 text-center text-violet-600 font-semibold hover:text-violet-700 transition-colors"
        >
          Resend code
        </button>
      </div>
    </div>
  );
};

const SuccessStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 100);
  }, []);

  return (
    <div className="flex flex-col h-full justify-center items-center text-center px-4 animate-fadeIn">
      <div className={`transition-all duration-700 ${showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-violet-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce-once">
          <CheckIcon />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">All set!</h2>
        <p className="text-gray-500 max-w-sm mx-auto mb-8">
          Your account has been successfully created. Welcome aboard!
        </p>
      </div>

      <div className="w-full max-w-sm">
        <button
          onClick={onComplete}
          className="w-full py-4 px-6 bg-violet-600 text-white rounded-2xl font-semibold hover:bg-violet-700 transition-all duration-300 hover:shadow-lg active:scale-98 mb-4"
        >
          Get Started
        </button>
        <p className="text-xs text-gray-400">
          By continuing, you agree to our{' '}
          <a href="#" className="underline hover:text-gray-600">
            Terms
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-gray-600">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

const SignUpFlow: React.FC<SignUpFlowProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<SignUpStep>(SignUpStep.AddContact);
  const [contactInfo, setContactInfo] = useState({ value: '', method: 'phone' as 'phone' | 'email' });

  const titles = ['Sign up', 'Create Password', 'Verify Contact'];
  const currentTitle = titles[step] || '';

  const handleBack = () => {
    if (step === SignUpStep.AddContact) {
      onBack();
    } else if (step > SignUpStep.AddContact && step < SignUpStep.Success) {
      setStep(step - 1);
    }
  };

  const handleContactSubmit = useCallback((submittedContact: string, method: 'phone' | 'email') => {
    setContactInfo({ value: submittedContact, method });
    setStep(SignUpStep.CreatePassword);
  }, []);

  const handlePasswordSubmit = useCallback(() => {
    setStep(SignUpStep.VerifyContact);
  }, []);

  const handleCodeVerified = useCallback(() => {
    setStep(SignUpStep.Success);
  }, []);

  if (step === SignUpStep.Success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <SuccessStep onComplete={onComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <header className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
          >
            <ArrowLeftIcon />
          </button>
          <span className="text-sm font-semibold text-gray-400">
            Step {step + 1} of 3
          </span>
          <div className="w-10"></div>
        </header>

        <ProgressIndicator currentStep={step + 1} totalSteps={3} />

        <main className="min-h-fit flex flex-col">
          {step === SignUpStep.AddContact && <AddContactStep onSubmit={handleContactSubmit} />}
          {step === SignUpStep.CreatePassword && <CreatePasswordStep onSubmit={handlePasswordSubmit} />}
          {step === SignUpStep.VerifyContact && (
            <VerifyContactStep
              contact={contactInfo.value}
              method={contactInfo.method}
              onVerified={handleCodeVerified}
            />
          )}
        </main>
      </div>
    </div>
  );
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes bounceOnce {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }

  .animate-bounce-once {
    animation: bounceOnce 0.6s ease-out;
  }

  .active\\:scale-98:active {
    transform: scale(0.98);
  }
`;
document.head.appendChild(style);

export default SignUpFlow;
