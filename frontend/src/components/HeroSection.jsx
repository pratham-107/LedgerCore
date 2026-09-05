import React from 'react';
import { motion } from 'framer-motion';
import HeroNotionWindow from './HeroNotionWindow';
import { BeanOutline } from './FloatingBean';
import { PieChart, Send, ArrowRight } from 'lucide-react';

export default function HeroSection({ onOpenApp }) {
  // Stagger variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const windowVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative pt-16 pb-24 overflow-hidden bg-gradient-to-b from-white via-[#fbfbfa] to-white">
      {/* Decorative Floating Shapes in Background with Framer Motion float */}
      <motion.div 
        animate={{ y: [0, -12, 0], rotate: [-25, -20, -25] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 left-8 md:left-24 opacity-80 pointer-events-none"
      >
        <BeanOutline color="#f59e0b" size={80} rotation={-25} />
      </motion.div>

      <motion.div 
        animate={{ y: [0, 14, 0], rotate: [40, 45, 40] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-36 left-4 md:left-12 opacity-70 pointer-events-none"
      >
        <BeanOutline color="#ef4444" size={90} rotation={40} />
      </motion.div>

      <motion.div 
        animate={{ y: [0, -10, 0], rotate: [-15, -10, -15] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-64 left-10 md:left-28 opacity-65 pointer-events-none"
      >
        <BeanOutline color="#3b82f6" size={75} rotation={-15} />
      </motion.div>

      <motion.div 
        animate={{ y: [0, 12, 0], rotate: [30, 35, 30] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-96 left-6 md:left-16 opacity-70 pointer-events-none"
      >
        <BeanOutline color="#10b981" size={85} rotation={30} />
      </motion.div>

      <motion.div 
        animate={{ y: [0, 15, 0], rotate: [35, 30, 35] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        className="absolute top-16 right-8 md:right-24 opacity-80 pointer-events-none"
      >
        <BeanOutline color="#f97316" size={85} rotation={35} />
      </motion.div>

      <motion.div 
        animate={{ y: [0, -12, 0], rotate: [-45, -40, -45] }}
        transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute top-44 right-4 md:right-12 opacity-70 pointer-events-none"
      >
        <BeanOutline color="#0284c7" size={75} rotation={-45} />
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0], rotate: [15, 20, 15] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute top-72 right-12 md:right-28 opacity-65 pointer-events-none"
      >
        <BeanOutline color="#10b981" size={90} rotation={15} />
      </motion.div>

      <motion.div 
        animate={{ y: [0, -14, 0], rotate: [-25, -30, -25] }}
        transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
        className="absolute top-96 right-6 md:right-16 opacity-70 pointer-events-none"
      >
        <BeanOutline color="#ef4444" size={80} rotation={-25} />
      </motion.div>

      {/* Main Hero Container with Staggered Entrance */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 relative z-10 text-center"
      >
        {/* Title */}
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-6xl font-black tracking-tight text-gray-950 mb-5 leading-tight"
        >
          Your{' '}
          <motion.span 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60 align-middle text-3xl md:text-5xl cursor-default"
          >
            <PieChart className="w-8 h-8 md:w-11 md:h-11 inline-block" /> finances
          </motion.span>{' '}
          &{' '}
          <motion.span 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/60 align-middle text-3xl md:text-5xl cursor-default"
          >
            <Send className="w-8 h-8 md:w-10 md:h-10 inline-block -rotate-12" /> invoices
          </motion.span><br />
          powered by LedgerCore
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants}
          className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-8 font-normal leading-relaxed"
        >
          Connect your workspace to generate structured invoices you can send and automated double-entry reports to understand and scale your business.
        </motion.p>

        {/* Primary CTA */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-center gap-4 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenApp}
            className="group bg-black hover:bg-gray-800 text-white font-semibold text-sm px-8 py-4 rounded-full transition-colors shadow-lg flex items-center gap-2.5 cursor-pointer"
          >
            <span>Launch LedgerCore Workspace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Hero Interactive Window */}
        <motion.div
          variants={windowVariants}
        >
          <HeroNotionWindow onOpenApp={onOpenApp} />
        </motion.div>
      </motion.div>
    </section>
  );
}
