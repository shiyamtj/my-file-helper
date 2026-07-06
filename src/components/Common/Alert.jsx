import { cn } from '../../utils/cn';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const Alert = ({ children, className, variant = 'default', onDismiss }) => {
  const variants = {
    default: 'bg-background text-foreground border-border',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    success: 'bg-green-50 text-green-900 border-green-200',
  };

  const icons = {
    default: Info,
    destructive: AlertCircle,
    warning: AlertCircle,
    success: CheckCircle,
  };

  const Icon = icons[variant];

  return (
    <div
      className={cn(
        'relative w-full rounded-lg border p-4',
        variants[variant],
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">{children}</div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
