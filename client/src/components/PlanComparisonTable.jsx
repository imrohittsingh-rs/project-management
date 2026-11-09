import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiArrowRight } from 'react-icons/fi';

const PlanComparisonTable = () => {
  const categories = [
    {
      name: 'CORE',
      rows: [
        {
          label: 'Projects',
          starter: '3',
          growth: 'Unlimited',
          enterprise: 'Unlimited',
        },
        {
          label: 'Storage',
          starter: '2 GB',
          growth: '100 GB',
          enterprise: '1 TB+',
        },
        {
          label: 'API access',
          starter: false,
          growth: true,
          enterprise: true,
        },
        {
          label: 'Custom workflows',
          starter: false,
          growth: true,
          enterprise: true,
        },
      ],
    },
    {
      name: 'COLLABORATION',
      rows: [
        {
          label: 'Team members',
          starter: 'Up to 3',
          growth: 'Up to 50',
          enterprise: 'Unlimited',
        },
        {
          label: 'Real-time editing',
          starter: true,
          growth: true,
          enterprise: true,
        },
        {
          label: 'Guest access',
          starter: false,
          growth: true,
          enterprise: true,
        },
        {
          label: 'Roles & permissions',
          starter: 'Basic',
          growth: 'Advanced',
          enterprise: 'Granular',
        },
      ],
    },
    {
      name: 'SUPPORT',
      rows: [
        {
          label: 'Response time',
          starter: 'Community',
          growth: 'Under 24h',
          enterprise: 'Under 1h',
        },
        {
          label: 'Priority queue',
          starter: false,
          growth: true,
          enterprise: true,
        },
        {
          label: 'Dedicated manager',
          starter: false,
          growth: false,
          enterprise: true,
        },
        {
          label: '99.99% uptime SLA',
          starter: false,
          growth: false,
          enterprise: true,
        },
      ],
    },
  ];

  const renderValue = (val, isPopular = false) => {
    if (typeof val === 'boolean') {
      return val ? (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-[4px] bg-[#18181b] text-white shadow-2xs">
          <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
        </span>
      ) : (
        <span className="inline-flex items-center justify-center w-5 h-5 text-[#a1a1aa] text-sm select-none">
          ✕
        </span>
      );
    }
    return (
      <span
        className={`text-xs sm:text-sm ${
          isPopular
            ? 'font-semibold text-[#18181b]'
            : 'font-medium text-[#52525b]'
        }`}
      >
        {val}
      </span>
    );
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 font-geist">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-10 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#e5e5e5] text-[#18181b] shadow-2xs mb-4">
            <svg
              className="w-3.5 h-3.5 text-[#18181b]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
            </svg>
            <span>Compare plans</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#18181b]">
            Find the right plan for your team
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#71717a] max-w-2xl leading-relaxed">
            Every Projectub plan scales with you. Compare features side by side and upgrade the moment you need more.
          </p>
        </div>

        {/* Most Popular Tag above column */}
        <div className="relative">
          <div className="hidden md:flex justify-end pr-[24%] mb-1.5">
            <span className="bg-[#18181b] text-white text-[11px] font-semibold px-3 py-0.5 rounded-full shadow-2xs tracking-wide">
              Most Popular
            </span>
          </div>

          {/* Table Container */}
          <div className="border border-[#e5e5e5] rounded-2xl bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                {/* Column Headers */}
                <thead>
                  <tr className="border-b border-[#e5e5e5]">
                    <th className="w-[34%] px-6 py-6 align-bottom">
                      <span className="text-xs font-bold tracking-wider text-[#a1a1aa] uppercase">
                        FEATURES
                      </span>
                    </th>

                    {/* Starter */}
                    <th className="w-[22%] px-6 py-6 text-center align-bottom border-l border-[#e5e5e5]">
                      <div className="text-sm font-semibold text-[#18181b]">Starter</div>
                      <div className="text-2xl font-bold text-[#18181b] mt-1">$0</div>
                      <div className="text-xs text-[#71717a] mt-0.5 font-normal">
                        Free Forever
                      </div>
                    </th>

                    {/* Growth (Most Popular) */}
                    <th className="w-[22%] px-6 py-6 text-center align-bottom border-l border-[#e5e5e5] bg-[#fafafa]">
                      <div className="text-sm font-semibold text-[#18181b]">Growth</div>
                      <div className="text-2xl font-bold text-[#18181b] mt-1">$24</div>
                      <div className="text-xs text-[#71717a] mt-0.5 font-normal">
                        Per User / Month
                      </div>
                    </th>

                    {/* Enterprise */}
                    <th className="w-[22%] px-6 py-6 text-center align-bottom border-l border-[#e5e5e5]">
                      <div className="text-sm font-semibold text-[#18181b]">
                        Enterprise
                      </div>
                      <div className="text-2xl font-bold text-[#18181b] mt-1">Custom</div>
                      <div className="text-xs text-[#71717a] mt-0.5 font-normal">
                        Talk to Sales
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <React.Fragment key={category.name}>
                      {/* Category Header Row */}
                      <tr className="border-t border-b border-[#e5e5e5] bg-[#f8f9fa]">
                        <td
                          colSpan={4}
                          className="px-6 py-2.5 text-[11px] font-bold tracking-wider text-[#18181b] uppercase"
                        >
                          {category.name}
                        </td>
                      </tr>

                      {/* Category Rows */}
                      {category.rows.map((row, idx) => (
                        <tr
                          key={row.label}
                          className={`hover:bg-[#fafafa]/80 transition-colors ${
                            idx !== category.rows.length - 1
                              ? 'border-b border-[#f0f0f0]'
                              : ''
                          }`}
                        >
                          <td className="px-6 py-4 text-xs sm:text-sm font-medium text-[#18181b]">
                            {row.label}
                          </td>
                          <td className="px-6 py-4 text-center border-l border-[#f0f0f0]">
                            {renderValue(row.starter, false)}
                          </td>
                          <td className="px-6 py-4 text-center border-l border-[#f0f0f0] bg-[#fafafa]">
                            {renderValue(row.growth, true)}
                          </td>
                          <td className="px-6 py-4 text-center border-l border-[#f0f0f0]">
                            {renderValue(row.enterprise, false)}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}

                  {/* Bottom Action Row */}
                  <tr className="border-t border-[#e5e5e5] bg-white">
                    <td className="px-6 py-6"></td>
                    <td className="px-4 py-6 border-l border-[#e5e5e5]">
                      <Link
                        to="/signup"
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-[#f4f4f5] text-[#18181b] hover:bg-[#e4e4e7] transition-colors shadow-2xs"
                      >
                        Choose <FiArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                    <td className="px-4 py-6 border-l border-[#e5e5e5] bg-[#fafafa]">
                      <Link
                        to="/signup"
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-[#18181b] text-white hover:bg-[#27272a] transition-colors shadow-xs"
                      >
                        Choose <FiArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                    <td className="px-4 py-6 border-l border-[#e5e5e5]">
                      <Link
                        to="/contact"
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-[#f4f4f5] text-[#18181b] hover:bg-[#e4e4e7] transition-colors shadow-2xs"
                      >
                        Contact us <FiArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlanComparisonTable;

