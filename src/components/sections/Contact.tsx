'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { submitContactForm } from '@/lib/supabase';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            await submitContactForm(formData);
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <section id="contact" className="section relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--neon-blue)] rounded-full blur-3xl" />
            </div>

            <div className="container relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        <span className="gradient-text">Get In Touch</span>
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Let's build something amazing together
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="glass-strong rounded-3xl p-8 border-2 border-[var(--neon-blue)]"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Input */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold mb-2 text-[var(--text-secondary)]">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--glass-border)] text-white focus:border-[var(--neon-blue)] focus:outline-none transition-colors"
                                    placeholder="Your name"
                                />
                            </div>

                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold mb-2 text-[var(--text-secondary)]">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--glass-border)] text-white focus:border-[var(--neon-blue)] focus:outline-none transition-colors"
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            {/* Message Input */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold mb-2 text-[var(--text-secondary)]">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--glass-border)] text-white focus:border-[var(--neon-blue)] focus:outline-none transition-colors resize-none"
                                    placeholder="Your message..."
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className={`w-full px-8 py-4 rounded-full font-semibold transition-all duration-300 ${status === 'loading'
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : status === 'success'
                                        ? 'bg-green-600'
                                        : status === 'error'
                                            ? 'bg-red-600'
                                            : 'bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] hover:scale-105 neon-glow'
                                    }`}
                            >
                                {status === 'loading' && 'Sending...'}
                                {status === 'success' && '✓ Message Sent!'}
                                {status === 'error' && '✗ Error. Try Again'}
                                {status === 'idle' && 'Send Message'}
                            </button>
                        </form>
                    </motion.div>

                    {/* Contact Info & Social Links */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col justify-between"
                    >
                        {/* Social Links */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold mb-6 gradient-text">Connect With Me</h3>

                            {/* LinkedIn */}
                            <a
                                href="https://linkedin.com/in/saswata-dey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-4 glass-strong rounded-2xl p-6 hover:border-[var(--neon-blue)] border-2 border-transparent transition-all duration-300 hover:scale-105"
                            >
                                <div className="w-12 h-12 rounded-full bg-[#0077b5]/20 border-2 border-[#0077b5] flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="#0077b5" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white group-hover:text-[#0077b5] transition-colors">
                                        LinkedIn
                                    </h4>
                                    <p className="text-sm text-[var(--text-tertiary)]">Let's connect professionally</p>
                                </div>
                            </a>

                            {/* GitHub */}
                            <a
                                href="https://github.com/codgamerofficial"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-4 glass-strong rounded-2xl p-6 hover:border-[var(--neon-purple)] border-2 border-transparent transition-all duration-300 hover:scale-105"
                            >
                                <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white group-hover:text-[var(--neon-purple)] transition-colors">
                                        GitHub
                                    </h4>
                                    <p className="text-sm text-[var(--text-tertiary)]">Check out my code</p>
                                </div>
                            </a>

                            {/* Phone */}
                            <a
                                href="tel:+917319280024"
                                className="group flex items-center gap-4 glass-strong rounded-2xl p-6 hover:border-[var(--neon-pink)] border-2 border-transparent transition-all duration-300 hover:scale-105"
                            >
                                <div className="w-12 h-12 rounded-full bg-[var(--neon-pink)]/20 border-2 border-[var(--neon-pink)] flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="var(--neon-pink)" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white group-hover:text-[var(--neon-pink)] transition-colors">
                                        Phone
                                    </h4>
                                    <p className="text-sm text-[var(--text-tertiary)]">+91 7319280024</p>
                                </div>
                            </a>

                            {/* Email */}
                            <a
                                href="mailto:saswatadey700@gmail.com"
                                className="group flex items-center gap-4 glass-strong rounded-2xl p-6 hover:border-[var(--neon-cyan)] border-2 border-transparent transition-all duration-300 hover:scale-105"
                            >
                                <div className="w-12 h-12 rounded-full bg-[var(--neon-cyan)]/20 border-2 border-[var(--neon-cyan)] flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="var(--neon-cyan)" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white group-hover:text-[var(--neon-cyan)] transition-colors">
                                        Email
                                    </h4>
                                    <p className="text-sm text-[var(--text-tertiary)]">saswatadey700@gmail.com</p>
                                </div>
                            </a>
                        </div>

                        {/* Resume Download */}
                        <motion.a
                            href="/resume.pdf"
                            download
                            whileHover={{ scale: 1.05 }}
                            className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)] text-white font-semibold text-center neon-glow-purple flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Resume
                        </motion.a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
