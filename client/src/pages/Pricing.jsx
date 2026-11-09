import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'motion/react';
import PlanComparisonTable from '../components/PlanComparisonTable';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'STARTER',
      badge: null,
      priceMonthly: 0,
      priceAnnual: 0,
      period: '/ per month',
      billedNote: 'Free forever to get started',
      features: [
        'Up to 3 projects',
        'Task & subtask management',
        'Todo, In Progress, Done workflows',
        'Basic team collaboration',
        'Community support',
        'Standard security',
      ],
      ctaText: 'Get Started',
      ctaLink: '/signup',
      isPrimary: false,
      footerNote: 'Perfect for individuals and small projects',
    },
    {
      id: 'pro',
      name: 'PROFESSIONAL',
      badge: '★ Popular',
      priceMonthly: 99,
      priceAnnual: 79,
      period: '/ per month',
      billedNote: isAnnual ? 'billed annually ($948/yr)' : 'billed monthly',
      features: [
        'Unlimited projects',
        'Role-based access (Admin, Project Admin, Member)',
        'Embedded project notes & documentation',
        'Task file attachments',
        '24-hour support response time',
        'Team collaboration & mentions',
        'Full API access',
      ],
      ctaText: 'Start Free Trial',
      ctaLink: '/signup',
      isPrimary: true,
      footerNote: 'Ideal for growing teams and businesses',
    },
    {
      id: 'enterprise',
      name: 'ENTERPRISE',
      badge: null,
      priceMonthly: 299,
      priceAnnual: 239,
      period: '/ per month',
      billedNote: isAnnual ? 'billed annually ($2,868/yr)' : 'billed monthly',
      features: [
        'Everything in Professional',
        'Custom workspace solutions',
        'Dedicated account manager',
        '1-hour support response time',
        'SSO Authentication & audit logs',
        'Advanced security & role controls',
        'Custom contracts & invoicing',
        '99.9% uptime SLA agreement',
      ],
      ctaText: 'Contact Sales',
      ctaLink: '/contact',
      isPrimary: false,
      footerNote: 'For large organizations with custom requirements',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] font-geist selection:bg-[#171717] selection:text-white">
      {/* Header section */}
      <section className="px-4 pt-16 pb-12 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#171717]">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#525252] leading-relaxed max-w-2xl mx-auto">
            Choose the plan that works for you. All plans include access to our platform, team collaboration tools, and dedicated support.
          </p>

          {/* Billing Switch */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={isAnnual}
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[#d4d4d8] transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#171717]/20 data-[state=checked]:bg-[#171717]"
              data-state={isAnnual ? 'checked' : 'unchecked'}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              onClick={() => setIsAnnual(!isAnnual)}
              className="text-sm font-medium text-[#171717] cursor-pointer select-none"
            >
              Annual billing{' '}
              <span className="text-[#16a34a] font-semibold">(Save 20%)</span>
            </span>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards Section */}
      <section className="px-4 pb-12 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const currentPrice = isAnnual ? plan.priceAnnual : plan.priceMonthly;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`relative flex flex-col justify-between bg-white rounded-2xl transition-all duration-200 ${
                  plan.isPrimary
                    ? 'border-2 border-[#171717] shadow-xl md:-translate-y-2'
                    : 'border border-[#e5e5e5] shadow-xs'
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute top-0 right-0 z-10">
                    <span className="inline-flex items-center gap-1 bg-[#171717] text-white text-xs font-semibold px-3.5 py-1.5 rounded-tr-[14px] rounded-bl-xl shadow-xs">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="p-7 sm:p-8 flex-1 flex flex-col">
                  {/* Plan Name */}
                  <div className="text-center">
                    <h3 className="text-xs font-bold tracking-widest text-[#737373] uppercase">
                      {plan.name}
                    </h3>

                    {/* Price display with animated transition */}
                    <div className="mt-4 flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-extrabold tracking-tight text-[#171717]">
                        $
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={currentPrice}
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.2 }}
                          >
                            {currentPrice}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                      <span className="text-xs sm:text-sm text-[#737373] font-normal">
                        {plan.period}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-[#8f8f8f] font-normal">
                      {plan.billedNote}
                    </p>
                  </div>

                  {/* Features list */}
                  <div className="mt-8 flex-1">
                    <ul className="space-y-3.5 text-xs sm:text-sm text-[#404040]">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <FiCheck className="w-4 h-4 text-[#171717] shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Action & Subtext */}
                  <div className="mt-8 pt-6 border-t border-[#f0f0f0]">
                    <Link
                      to={plan.ctaLink}
                      className={`w-full inline-flex items-center justify-center h-11 px-5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        plan.isPrimary
                          ? 'bg-[#171717] text-white hover:bg-[#333333] shadow-xs'
                          : 'bg-white border border-[#e5e5e5] text-[#171717] hover:border-[#171717] hover:bg-[#fafafa]'
                      }`}
                    >
                      {plan.ctaText}
                    </Link>

                    <p className="mt-3 text-center text-xs text-[#8f8f8f] leading-normal">
                      {plan.footerNote}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Pricing;

