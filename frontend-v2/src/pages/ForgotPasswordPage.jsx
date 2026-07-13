import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FloatingInput } from '../components/ui/FloatingInput';
import { TactileButton } from '../components/ui/TactileButton';
import { api } from '../api/api';

const steps = [
  'Send code',
  'Verify code',
  'Set password'
];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const heading = useMemo(() => steps[step], [step]);

  const clearStatus = () => {
    setError('');
    setMessage('');
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    clearStatus();
    setLoading(true);

    try {
      const response = await api.forgotPassword(email);
      setMessage(response.data.message || 'If an account exists for this email, a verification code has been sent.');
      setStep(1);
    } catch (err) {
      setError(err.message || 'Unable to send verification code right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    clearStatus();
    setLoading(true);

    try {
      const response = await api.verifyResetCode(email, otp);
      setMessage(response.data.message || 'Verification code accepted.');
      setStep(2);
    } catch (err) {
      setError(err.message || 'The verification code is not valid.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    clearStatus();
    setLoading(true);

    try {
      const response = await api.resetPassword(email, otp, password);
      setMessage(response.data.message || 'Password updated successfully.');
      setStep(0);
      setOtp('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Unable to reset password right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <Link to="/login" className="absolute top-6 left-6 z-20">
        <TactileButton variant="secondary" className="px-4 py-2 flex items-center gap-2">
          <ArrowLeft size={20} /> Back
        </TactileButton>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
        animate={{ opacity: 1, scale: 1, rotate: 1 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="comic-panel p-8 bg-brand-cyan relative">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 8 }}
            className="absolute -top-6 -right-6 bg-brand-yellow text-brand-black border-[3px] border-brand-black px-4 py-2 rounded-full font-black uppercase text-sm shadow-comic-sm z-10 transform rotate-6"
          >
            Recover Access
          </motion.div>

          <div className="mb-8 text-center bg-white border-[3px] border-brand-black rounded-lg py-4 shadow-comic-sm transform -rotate-1">
            <h2 className="text-3xl font-black uppercase tracking-widest text-brand-black">Forgot Password</h2>
            <p className="mt-2 text-sm font-body font-bold text-brand-black/70">{heading}</p>
          </div>

          <div className="mb-6 flex items-center gap-2">
            {steps.map((label, index) => (
              <div key={label} className="flex-1">
                <div className={`h-3 rounded-full border-2 border-brand-black ${index <= step ? 'bg-brand-yellow' : 'bg-white'}`} />
              </div>
            ))}
          </div>

          {error && <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 rounded-lg text-red-600 font-bold font-body">{error}</div>}
          {message && <div className="mb-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg text-green-700 font-bold font-body">{message}</div>}

          {step === 0 && (
            <form onSubmit={handleSendCode} className="flex flex-col gap-6">
              <FloatingInput
                id="forgot-email"
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TactileButton type="submit" variant="primary" className="w-full py-4 text-lg" disabled={loading}>
                {loading ? 'SENDING...' : 'SEND VERIFICATION CODE'}
              </TactileButton>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={handleVerifyCode} className="flex flex-col gap-6">
              <FloatingInput
                id="verify-email"
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FloatingInput
                id="verify-otp"
                type="text"
                label="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <TactileButton type="submit" variant="primary" className="w-full py-4 text-lg" disabled={loading}>
                {loading ? 'VERIFYING...' : 'VERIFY CODE'}
              </TactileButton>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
              <FloatingInput
                id="reset-email"
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FloatingInput
                id="reset-otp"
                type="text"
                label="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <FloatingInput
                id="reset-password"
                type="password"
                label="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-sm font-body font-bold text-brand-black/70">
                Use 8-128 characters with at least one letter and one number.
              </p>
              <TactileButton type="submit" variant="primary" className="w-full py-4 text-lg" disabled={loading}>
                {loading ? 'UPDATING...' : 'RESET PASSWORD'}
              </TactileButton>
            </form>
          )}

          <div className="mt-8 text-center font-body font-bold text-brand-black">
            Remembered it?{' '}
            <Link to="/login" className="text-brand-purple hover:underline underline-offset-4 decoration-2 decoration-brand-black">
              Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
