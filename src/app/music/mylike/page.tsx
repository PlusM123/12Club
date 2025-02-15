'use client'
import React from 'react'
import { motion } from 'framer-motion'

export default function Music() {
  return (
    <motion.div
      className="h-[200vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <h1 className="text-2xl font-bold">我喜欢</h1>
      <p>这里是我喜欢的内容。</p>
    </motion.div>
  )
}
