import { LoadingScreen } from "@/components/ui/LoadingScreen";

export default function AdminLoading() {
  return (
    <LoadingScreen
      variant="admin"
      title="Yonetim paneli yukleniyor"
      description="Veriler ve duzenleme arayuzu hazirlaniyor. Birkac saniye icinde kaldigin yerden devam edebilirsin."
    />
  );
}
