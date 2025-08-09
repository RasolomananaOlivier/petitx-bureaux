"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Activity, TestTube } from "lucide-react";

export function AnalyticsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Top Bureaux (30 derniers jours)
          </CardTitle>
          <CardDescription>
            Bureaux les plus consultés et leur taux de conversion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: "Bureau Marais Cosy",
                views: 1234,
                leads: 45,
                conversion: 3.6,
                trend: "up",
              },
              {
                name: "Espace Montparnasse",
                views: 987,
                leads: 23,
                conversion: 2.3,
                trend: "down",
                isFake: true,
              },
              {
                name: "Studio Bastille",
                views: 856,
                leads: 31,
                conversion: 3.6,
                trend: "up",
              },
              {
                name: "Bureau République",
                views: 743,
                leads: 18,
                conversion: 2.4,
                trend: "up",
                isFake: true,
              },
            ].map((office, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{office.name}</span>
                    {office.isFake && (
                      <Badge variant="destructive" className="text-xs">
                        Test
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>{office.views} vues</span>
                  <span>{office.leads} leads</span>
                  <div className="flex items-center space-x-1">
                    {office.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span>{office.conversion}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TestTube className="w-5 h-5 mr-2" />
            Tests A/B en cours
          </CardTitle>
          <CardDescription>
            Performances des tests sur listings factices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Test Prix - Bureau Factice A</h4>
                  <p className="text-sm text-muted-foreground">
                    45€/jour vs 38€/jour
                  </p>
                </div>
                <Badge variant="default">Actif</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Variante A (45€)</span>
                  <span>65% - 234 vues</span>
                </div>
                <Progress value={65} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Variante B (38€)</span>
                  <span>35% - 126 vues</span>
                </div>
                <Progress value={35} className="h-2" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Confiance: 89%</span>
                <span>7 jours restants</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">
                    Test Description - Bureau Factice B
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Description courte vs longue
                  </p>
                </div>
                <Badge variant="secondary">En pause</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Courte</span>
                  <span>52% - 156 vues</span>
                </div>
                <Progress value={52} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Longue</span>
                  <span>48% - 144 vues</span>
                </div>
                <Progress value={48} className="h-2" />
              </div>
              <Button size="sm" variant="outline" className="w-full">
                Reprendre le test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
