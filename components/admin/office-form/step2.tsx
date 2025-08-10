"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Euro } from "lucide-react";

// Step 2: Pricing and Capacity
interface Step2Props {
  form: any;
}

export default function Step2({ form }: Step2Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Euro className="w-5 h-5" />
          Prix et capacité
        </CardTitle>
        <CardDescription>
          Définissez la tarification et les paramètres du bureau
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="priceCents">Prix HT par mois (€) *</Label>
          <Input
            id="priceCents"
            type="number"
            min="0"
            step="0.01"
            {...form.register("priceCents", { valueAsNumber: true })}
            className={form.formState.errors.priceCents ? "border-red-500" : ""}
          />
          {form.formState.errors.priceCents && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.priceCents.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="nbPosts">Capacité (nombre de postes) *</Label>
          <Input
            id="nbPosts"
            type="number"
            min="1"
            {...form.register("nbPosts", { valueAsNumber: true })}
            className={form.formState.errors.nbPosts ? "border-red-500" : ""}
          />
          {form.formState.errors.nbPosts && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.nbPosts.message}
            </p>
          )}
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isFake">Bureau factice (test)</Label>
              <p className="text-sm text-gray-500">
                Utilisé uniquement pour les tests
              </p>
            </div>
            <Switch id="isFake" {...form.register("isFake")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
