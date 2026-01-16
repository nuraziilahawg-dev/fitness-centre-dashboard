export default function Button({
    children,
    loading,
    variant = 'primary',
    type = 'button',
    onClick,
    className = '',
    disabled
}) {
    const variants = {
        primary: 'flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100 cursor-pointer',
        danger: 'flex-1 bg-red-600 hover:bg-red-700 text-white shadow-red-100 cursor-pointer',
        secondary: 'flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 shadow-none cursor-pointer'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading || disabled}
            className={`
                px-5 py-2.5 rounded-xl font-semibold transition-all active:scale-[0.98] 
                disabled:opacity-50 
                ${variants[variant]} ${className}
            `}
        >
            {children}
        </button>
    );
}