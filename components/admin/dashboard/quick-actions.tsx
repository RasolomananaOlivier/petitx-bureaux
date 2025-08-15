"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Settings,
  UserPlus,
  Activity,
  Building,
  FileText,
  Users,
  Edit,
} from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  recentActivity: Array<{
    id: number;
    action: string;
    targetTable: string;
    targetId: number;
    actorName: string;
    createdAt: string;
  }>;
}

const ACTION_LABELS = {
  create: "Créé",
  update: "Modifié",
  delete: "Supprimé",
  publish: "Publié",
  unpublish: "Dépublié",
};

const TABLE_LABELS = {
  offices: "Bureau",
  leads: "Lead",
  accounts: "Compte",
  services: "Service",
};

const ACTION_ICONS = {
  offices: Building,
  leads: FileText,
  accounts: Users,
  services: Settings,
};

export function QuickActions({ recentActivity }: QuickActionsProps) {
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;

    return date.toLocaleDateString("fr-FR");
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "bg-green-100 text-green-800";
      case "update":
        return "bg-blue-100 text-blue-800";
      case "delete":
        return "bg-red-100 text-red-800";
      case "publish":
        return "bg-green-100 text-green-800";
      case "unpublish":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full justify-start py-6"
              variant="outline"
              asChild
            >
              <Link href="/admin/offices/new">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un bureau
              </Link>
            </Button>

            <Button
              size="lg"
              className="w-full justify-start py-6"
              variant="outline"
              asChild
            >
              <Link href="/admin/services">
                <Settings className="w-4 h-4 mr-2" />
                Gérer les services
              </Link>
            </Button>

            <Button
              size="lg"
              className="w-full justify-start py-6"
              variant="outline"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Inviter un admin/éditeur
            </Button>

            <Link href="/admin/leads">
              <Button
                size="lg"
                className="w-full justify-start py-6"
                variant="outline"
              >
                <FileText className="w-4 h-4 mr-2" />
                Voir tous les leads
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Activité récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 flex flex-col">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4 min-h-[200px] flex justify-center items-center">
                Aucune activité récente
              </p>
            ) : (
              recentActivity.map((activity) => {
                const IconComponent =
                  ACTION_ICONS[
                    activity.targetTable as keyof typeof ACTION_ICONS
                  ] || Activity;
                const actionLabel =
                  ACTION_LABELS[
                    activity.action as keyof typeof ACTION_LABELS
                  ] || activity.action;
                const tableLabel =
                  TABLE_LABELS[
                    activity.targetTable as keyof typeof TABLE_LABELS
                  ] || activity.targetTable;

                return (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border"
                  >
                    <div className="flex-shrink-0">
                      <IconComponent className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {activity.actorName}
                        </span>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getActionColor(
                            activity.action
                          )}`}
                        >
                          {actionLabel}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {tableLabel} #{activity.targetId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
