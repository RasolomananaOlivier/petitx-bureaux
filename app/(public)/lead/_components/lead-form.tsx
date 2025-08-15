// File: app/components/LeadForm.tsx
// Lead form using shadcn/ui components, Tailwind, React Hook Form, and Zod validation.

"use client";

import { useState, useRef, useEffect } from "react";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { adminLeadsApi } from "@/lib/api/leads";

declare global {
  interface Window {
    grecaptcha?: any;
  }
}

const formSchema = z.object({
  firstname: z.string().min(1, "Prénom manquant"),
  lastname: z.string().min(1, "Nom manquant"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(1, "Numéro de portable manquant"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface LeadFormProps {
  officeId?: number;
}

export default function LeadForm({ officeId }: LeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const recaptchaRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  useEffect(() => {
    let mounted = true;
    const tryRender = () => {
      if (!mounted) return;
      const grecaptcha = window.grecaptcha;
      if (grecaptcha && recaptchaRef.current && widgetIdRef.current === null) {
        try {
          widgetIdRef.current = grecaptcha.render(recaptchaRef.current, {
            sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
            size: "invisible",
            callback: (token: string) => onRecaptchaToken(token),
            "expired-callback": () => setStatusMessage("reCAPTCHA expired."),
            "error-callback": () => setStatusMessage("reCAPTCHA error."),
          });
        } catch {
          setTimeout(tryRender, 300);
        }
      } else if (!grecaptcha) {
        setTimeout(tryRender, 300);
      }
    };
    tryRender();
    return () => {
      mounted = false;
    };
  }, []);

  const onRecaptchaToken = async (token: string) => {
    try {
      const values = form.getValues();
      const payload = { ...values, token, officeId: officeId! };

      const res = await adminLeadsApi.createLead(payload);
      if (!res.success) throw new Error(res.message || "Échec de l'envoi");
      setStatusMessage("Merci! Votre demande a été envoyée.");
      form.reset();
    } catch (err: any) {
      setStatusMessage(err?.message || "Échec de l'envoi");
    } finally {
      setLoading(false);
      if (window.grecaptcha && widgetIdRef.current !== null) {
        window.grecaptcha.reset(widgetIdRef.current);
      }
    }
  };

  const onSubmit = () => {
    if (!officeId) {
      setStatusMessage("L'ID de l'office est requis.");
      return;
    }
    setStatusMessage(null);
    setLoading(true);
    if (window.grecaptcha && widgetIdRef.current !== null) {
      window.grecaptcha.execute(widgetIdRef.current);
    } else {
      setLoading(false);
      setStatusMessage("reCAPTCHA non prêt.");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8">
      <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="afterInteractive"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-bold">Prénom *</FormLabel>
                  <FormControl>
                    <Input placeholder="Camille" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-bold">Nom *</FormLabel>
                  <FormControl>
                    <Input placeholder="Dupont" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  Email professionnel *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@company.com"
                    className="h-11"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  Numéro de portable *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="06 00 00 00 00"
                    type="tel"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Message (optionnel)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Détails ou questions"
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="py-6 text-base px-4 w-full"
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Envoi en cours..." : "Envoyer ma demande"}
          </Button>

          {statusMessage && (
            <p className="text-sm mt-2 text-gray-700">{statusMessage}</p>
          )}

          <div ref={recaptchaRef} />
        </form>
      </Form>
    </div>
  );
}
