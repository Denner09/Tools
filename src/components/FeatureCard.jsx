import React from 'react';
import Link from 'next/link';

const FeatureCard = ({ href, icon, title, description, buttonText = "Acessar" }) => {
    return (
        <Link href={href} className="group block h-full" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div 
                className="h-full p-10 rounded-3xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center relative overflow-hidden shadow-[0_10px_30px_-10px_rgba(234,88,12,0.05)]"
                style={{
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-main)'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent dark:from-gray-800/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 text-orange-600 dark:text-orange-500 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:bg-orange-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 relative z-10">
                    <i className={icon}></i>
                </div>
                <h3 className="text-2xl font-bold mb-4 has-text-main transition-colors relative z-10" style={{ color: 'var(--text-main)' }}>{title}</h3>
                <p className="leading-relaxed mb-8 flex-grow relative z-10" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>
                    {description}
                </p>
                <span className="relative z-10 px-6 py-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
                    {buttonText}
                </span>
            </div>
        </Link>
    );
};

export default FeatureCard;
