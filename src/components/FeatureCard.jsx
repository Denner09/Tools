import React from 'react';
import Link from 'next/link';

const FeatureCard = ({ href, icon, title, description, buttonText = "Acessar" }) => {
    return (
        <Link href={href} className="group block h-full" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="h-full bg-[#111] border border-[#333] p-10 rounded-3xl transition-all duration-300 hover:border-gray-600 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)] hover:-translate-y-2 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity border border-white/5 rounded-3xl"></div>
                <div className="w-16 h-16 bg-[#1a1a1a] text-orange-500 rounded-2xl flex items-center justify-center text-3xl mb-8 border border-[#333] group-hover:bg-orange-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 relative z-10">
                    <i className={icon}></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 transition-colors relative z-10">{title}</h3>
                <p className="text-gray-400 leading-relaxed mb-8 flex-grow relative z-10" style={{ textDecoration: 'none' }}>
                    {description}
                </p>
                <span className="relative z-10 px-6 py-3 rounded-full bg-[#1a1a1a] border border-[#333] text-gray-300 text-sm font-bold group-hover:bg-orange-600 group-hover:text-white group-hover:border-transparent transition-all shadow-md">
                    {buttonText}
                </span>
            </div>
        </Link>
    );
};

export default FeatureCard;
