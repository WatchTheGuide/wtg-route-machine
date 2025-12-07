import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuthStore } from '@/stores/authStore';

const loginSchema = z.object({
  email: z.string().email('auth.validation.invalidEmail'),
  password: z.string().min(6, 'auth.validation.passwordMin'),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError, isAuthenticated } =
    useAuthStore();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    '/admin';

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) as never,
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const onSubmit = async (data: LoginFormValues) => {
    await login(data.email, data.password, data.rememberMe);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/icon.png"
              alt="WTG Route Machine"
              className="h-16 w-16 rounded-xl"
            />
          </div>
          <CardTitle className="text-2xl">{t('auth.login.title')}</CardTitle>
          <CardDescription>{t('auth.login.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{t(error)}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.login.email')}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t('auth.login.emailPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.email?.message &&
                        t(form.formState.errors.email.message)}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.login.password')}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t('auth.login.passwordPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.password?.message &&
                        t(form.formState.errors.password.message)}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0 font-normal cursor-pointer">
                      {t('auth.login.rememberMe')}
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('auth.login.submit')}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>{t('auth.login.demoCredentials')}</p>
            <p className="font-mono text-xs mt-1">admin@wtg.pl / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
