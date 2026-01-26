import React from 'react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';

const FileDropzone = ({ onDrop, activeTool, ocrMode }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: activeTool === 'merge' || (activeTool === 'ocr' && ocrMode === 'compare')
    });

    return (
        <div 
            {...getRootProps()} 
            className={clsx(
                "flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-300 min-h-[400px]",
                isDragActive ? "border-orange-500 bg-orange-50 dark:bg-orange-900/10" : "hover:border-orange-400"
            )}
            style={{ 
                backgroundColor: isDragActive ? undefined : 'var(--bg-card-hover)',
                borderColor: isDragActive ? undefined : 'var(--border-card)'
            }}
        >
            <input {...getInputProps()} />
            <div className="text-center p-10">
                <div className={clsx(
                    "w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 transition-all",
                    isDragActive ? "bg-white dark:bg-gray-800 text-orange-600 shadow-md" : "bg-gray-400 dark:bg-gray-600 text-white"
                )}>
                    <i className="fas fa-cloud-upload-alt text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
                    {isDragActive ? "Solte para enviar" : "Clique ou arraste seus arquivos aqui"}
                </h3>
                <p className="font-medium uppercase text-sm tracking-wide" style={{ color: 'var(--text-muted)' }}>
                        PDF Suportado
                        {activeTool === 'compare' && ' (Necessário 2 arquivos)'}
                </p>
            </div>
        </div>
    );
};

export default FileDropzone;
