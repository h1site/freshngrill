'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  link?: {
    href: string;
    label: string;
  };
  icon?: ReactNode;
  align?: 'left' | 'center';
}

export function SectionHeader({
  eyebrow,
  title,
  link,
  icon,
  align = 'left',
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <div className={`mb-12 ${isCenter ? 'text-center' : ''}`}>
      <div className={`${isCenter ? '' : 'flex flex-col md:flex-row md:items-end justify-between'}`}>
        <div>
          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[#F77313] text-sm font-medium uppercase tracking-widest flex items-center gap-2"
            style={{ justifyContent: isCenter ? 'center' : 'flex-start' }}
          >
            {icon}
            {eyebrow}
          </motion.span>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-display text-black mt-2"
          >
            {title}
          </motion.h2>
        </div>

        {/* Link */}
        {link && !isCenter && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 md:mt-0"
          >
            <Link
              href={link.href}
              className="group flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-[#F77313] transition-colors"
            >
              {link.label}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`w-16 h-1 bg-[#F77313] mt-6 origin-left ${isCenter ? 'mx-auto' : ''}`}
      />
    </div>
  );
}
