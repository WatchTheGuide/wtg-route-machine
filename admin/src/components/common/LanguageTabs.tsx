import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Copy } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { LocalizedString } from '@/types';

// Language configuration
const LANGUAGES = [
  { code: 'pl' as const, name: 'Polski', flag: '🇵🇱' },
  { code: 'en' as const, name: 'English', flag: '🇬🇧' },
  { code: 'de' as const, name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
  { code: 'uk' as const, name: 'Українська', flag: '🇺🇦' },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]['code'];

// Required languages (always marked as required)
const REQUIRED_LANGUAGES: LanguageCode[] = ['pl', 'en'];

export interface LanguageTabsProps {
  /** Current localized values */
  value: LocalizedString;
  /** Callback when any language value changes */
  onChange: (value: LocalizedString) => void;
  /** Type of input field */
  fieldType: 'input' | 'textarea';
  /** Label for the field */
  label?: string;
  /** Placeholder text (will be appended with language name) */
  placeholder?: string;
  /** Whether PL and EN are required (default: true) */
  required?: boolean;
  /** Number of rows for textarea (default: 3) */
  rows?: number;
  /** Additional class name */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * LanguageTabs - Reusable component for editing localized strings
 *
 * Displays tabs for each language (PL, EN, DE, FR, UK) with:
 * - Progress indicator showing completion
 * - Copy from Polish button
 * - Visual validation for required fields
 */
export function LanguageTabs({
  value,
  onChange,
  fieldType,
  label,
  placeholder,
  required = true,
  rows = 3,
  className,
  disabled = false,
}: LanguageTabsProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<LanguageCode>('pl');

  // Calculate completion stats
  const completionStats = useMemo(() => {
    let filled = 0;
    const total = LANGUAGES.length;

    LANGUAGES.forEach(({ code }) => {
      const langValue = value[code];
      if (langValue && langValue.trim() !== '') {
        filled++;
      }
    });

    return {
      filled,
      total,
      percentage: Math.round((filled / total) * 100),
    };
  }, [value]);

  // Check if a language field is filled
  const isFieldFilled = (code: LanguageCode): boolean => {
    const langValue = value[code];
    return langValue !== undefined && langValue.trim() !== '';
  };

  // Check if a language is required
  const isRequired = (code: LanguageCode): boolean => {
    return required && REQUIRED_LANGUAGES.includes(code);
  };

  // Check if a required field is empty (for error state)
  const hasError = (code: LanguageCode): boolean => {
    return isRequired(code) && !isFieldFilled(code);
  };

  // Handle value change for a specific language
  const handleChange = (code: LanguageCode, newValue: string) => {
    onChange({
      ...value,
      [code]: newValue,
    });
  };

  // Copy Polish value to all empty fields
  const handleCopyFromPolish = () => {
    const polishValue = value.pl;
    if (!polishValue || polishValue.trim() === '') return;

    const newValue: LocalizedString = { ...value };

    LANGUAGES.forEach(({ code }) => {
      if (code !== 'pl') {
        const currentValue = value[code];
        if (!currentValue || currentValue.trim() === '') {
          newValue[code] = polishValue;
        }
      }
    });

    onChange(newValue);
  };

  // Check if copy button should be enabled
  const canCopyFromPolish = useMemo(() => {
    const polishValue = value.pl;
    if (!polishValue || polishValue.trim() === '') return false;

    // Check if there are any empty fields to copy to
    return LANGUAGES.some(({ code }) => {
      if (code === 'pl') return false;
      const langValue = value[code];
      return !langValue || langValue.trim() === '';
    });
  }, [value]);

  // Get placeholder for a specific language
  const getPlaceholder = (langName: string): string => {
    if (placeholder) {
      return `${placeholder} (${langName})`;
    }
    return t('languageTabs.placeholder', {
      language: langName,
      defaultValue: `Enter text in ${langName}`,
    });
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header with label and progress */}
      <div className="flex items-center justify-between gap-4">
        {label && (
          <Label className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}

        {/* Completion indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="font-normal">
            {completionStats.filled}/{completionStats.total}
          </Badge>
          <Progress value={completionStats.percentage} className="w-20 h-1.5" />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as LanguageCode)}
        className="w-full">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <TabsList className="h-auto flex-wrap">
            {LANGUAGES.map(({ code, flag }) => (
              <TabsTrigger
                key={code}
                value={code}
                disabled={disabled}
                className={cn(
                  'relative gap-1 px-2.5 py-1.5 text-xs',
                  hasError(code) && 'text-destructive'
                )}>
                <span>{flag}</span>
                <span className="uppercase font-medium">{code}</span>

                {/* Required indicator */}
                {isRequired(code) && (
                  <span className="text-destructive text-[10px] absolute -top-0.5 -right-0.5">
                    *
                  </span>
                )}

                {/* Filled indicator */}
                {isFieldFilled(code) && (
                  <Check className="w-3 h-3 text-green-500 ml-0.5" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Copy from Polish button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyFromPolish}
            disabled={disabled || !canCopyFromPolish}
            className="text-xs h-7 gap-1">
            <Copy className="w-3 h-3" />
            {t('languageTabs.copyFromPolish', {
              defaultValue: 'Copy from Polish',
            })}
          </Button>
        </div>

        {/* Tab contents */}
        {LANGUAGES.map(({ code, name }) => (
          <TabsContent key={code} value={code} className="mt-3">
            {fieldType === 'input' ? (
              <Input
                value={value[code] ?? ''}
                onChange={(e) => handleChange(code, e.target.value)}
                placeholder={getPlaceholder(name)}
                disabled={disabled}
                className={cn(
                  hasError(code) &&
                    activeTab === code &&
                    'border-destructive focus-visible:ring-destructive'
                )}
              />
            ) : (
              <Textarea
                value={value[code] ?? ''}
                onChange={(e) => handleChange(code, e.target.value)}
                placeholder={getPlaceholder(name)}
                rows={rows}
                disabled={disabled}
                className={cn(
                  hasError(code) &&
                    activeTab === code &&
                    'border-destructive focus-visible:ring-destructive'
                )}
              />
            )}

            {/* Error message for required empty fields */}
            {hasError(code) && activeTab === code && (
              <p className="text-xs text-destructive mt-1.5">
                {t('languageTabs.requiredField', {
                  language: name,
                  defaultValue: `${name} is required`,
                })}
              </p>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default LanguageTabs;
