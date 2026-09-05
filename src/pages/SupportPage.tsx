import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Heart, AlertTriangle } from 'lucide-react';
import { support, brand } from '../data/lorapok';

export default function SupportPage() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Support | ${brand.name}`;
  }, []);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-16 px-4 max-w-3xl mx-auto w-full"
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-[#67ff8f]/10 rounded-full mb-6">
          <Heart size={32} className="text-[#67ff8f]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Support Lorapok Labs</h1>
        <p className="text-lg text-gray-400">
          Your support helps us maintain existing projects and build new open-source tools for the community.
        </p>
      </div>

      <div className="space-y-8">
        {/* bKash Section */}
        {support.bkash && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-[#e2136e] font-black">bKash</span>
            </h2>
            <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-white/5">
              <span className="font-mono text-lg text-white">{support.bkash}</span>
              <button 
                onClick={() => handleCopy(support.bkash)}
                className="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                title="Copy bKash Number"
              >
                {copiedAddress === support.bkash ? <Check size={20} className="text-[#67ff8f]" /> : <Copy size={20} />}
              </button>
            </div>
          </div>
        )}

        {/* Crypto Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
          <h2 className="text-2xl font-bold text-white mb-6">Cryptocurrency</h2>
          <div className="space-y-4">
            {support.addresses.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">{item.token} <span className="text-gray-600">({item.network})</span></span>
                </div>
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-white/5">
                  <span className="font-mono text-sm md:text-base text-white truncate mr-4">{item.address}</span>
                  <button 
                    onClick={() => handleCopy(item.address)}
                    className="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white shrink-0"
                    title={`Copy ${item.token} Address`}
                  >
                    {copiedAddress === item.address ? <Check size={20} className="text-[#67ff8f]" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Note */}
        {support.note && (
          <div className="flex gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/80">
            <AlertTriangle size={24} className="shrink-0 text-amber-500 mt-1" />
            <p className="text-sm md:text-base">{support.note}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
