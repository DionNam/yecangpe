"use client";

import { createClient } from "@repo/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

export function LogoutButton() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh(); // Clear server cache
  };

  return (
    <Button variant="ghost" onClick={handleLogout}>
      {t('userMenu.logout')}
    </Button>
  );
}
