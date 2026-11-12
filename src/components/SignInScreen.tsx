import React, { useState } from 'react';
import { ShieldCheck, Truck } from 'lucide-react';

interface SignInScreenProps {
  defaultEmail: string;
  companyName: string;
  usdot: string;
  mc: string;
  onSignIn: (email: string) => void;
  onResetDemo: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  defaultEmail,
  companyName,
  usdot,
  mc,
  onSignIn,
  onResetDemo,
}) => {
  const [email, setEmail] = useState(defaultEmail || 'dispatch@apexhauling.com');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter a valid carrier email address.');
      return;
    }
    setError('');
    onSignIn(trimmed);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full bg-[#F6F8FC] px-4 py-6 justify-between overflow-y-auto">
      <div className="my-auto space-y-5">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0F2A3F] text-white flex items-center justify-center shadow-sm">
            <Truck className="w-7 h-7 text-[#14B8A6]" />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#0F2A3F]">
            REVAS
          </h1>
          <p className="text-[13px] text-[#5F5E5A]">
            Commercial Trucking Insurance & Compliance
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-[16px] p-4 space-y-4 shadow-[0_1px_3px_rgba(15,42,63,0.06)]"
          style={{ border: '0.5px solid #E1E5EC' }}
        >
          <div className="rounded-xl bg-[#0F2A3F] text-white px-3.5 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#5EEAD4]" />
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold truncate">{companyName}</div>
              <div className="text-[12px] text-[#93C5FD] truncate">
                USDOT {usdot} · {mc}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="revas-signin-email"
              className="block text-[13px] font-medium text-[#0F2A3F] mb-1.5"
            >
              Carrier portal email
            </label>
            <input
              id="revas-signin-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="dispatch@apexhauling.com"
              className="w-full h-[44px] rounded-[12px] px-3.5 text-[16px] text-[#0F2A3F] bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6B5A]/30"
              style={{ border: error ? '1px solid #DC2626' : '0.5px solid #CBD5E1' }}
            />
            {error && (
              <p className="mt-1.5 text-[12px] font-medium text-[#DC2626]" role="alert">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-[44px] rounded-[12px] bg-[#0F2A3F] hover:bg-[#163854] text-white text-[14px] font-medium transition-colors cursor-pointer"
          >
            Sign in to portal
          </button>
        </form>
      </div>

      <div className="pt-4 text-center">
        <button
          type="button"
          onClick={onResetDemo}
          className="min-h-[44px] px-3 text-[13px] font-medium text-[#5F5E5A] hover:text-[#0F2A3F] cursor-pointer"
        >
          Reset demo data
        </button>
      </div>
    </div>
  );
};

