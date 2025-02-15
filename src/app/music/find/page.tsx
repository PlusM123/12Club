'use client'
import React from 'react'
import { motion } from 'framer-motion'

export default function Music() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <h1 className="text-2xl font-bold">发现</h1>
      <p>这里是发现的内容。</p>
    </motion.div>
  )
}
