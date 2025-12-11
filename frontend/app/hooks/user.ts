import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { scanLicensePlate } from "@/lib/scan";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export function useScanner(isLoggedIn: boolean = false) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScanClick = () => {
    if (!isLoggedIn) {
      setErrorMsg(
        "⚠️ Silakan login terlebih dahulu untuk menggunakan fitur scan."
      );
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await scanLicensePlate(formData);

      if (data && data.success) {
        const base64Img = await fileToBase64(file);
        const dataToSave = { ...data, imageUrl: base64Img };

        sessionStorage.setItem("scanResult", JSON.stringify(dataToSave));
        router.push("/result");
      } else {
        setErrorMsg("Plat nomor tidak terbaca atau gagal.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Gagal memproses gambar. Pastikan backend nyala.");
    } finally {
      setIsLoading(false);
      e.target.value = "";
    }
  };

  return {
    isLoading,
    errorMsg,
    fileInputRef,
    handleScanClick,
    handleFileChange,
  };
}
