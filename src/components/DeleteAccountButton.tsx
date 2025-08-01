"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteUserAccountAction } from "@/src/lib/actions";
import { useRouter } from "next/navigation";

export function DeleteAccountButton() {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (!window.confirm("정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    if (!window.confirm("모든 게시물과 데이터가 영구적으로 삭제됩니다. 계속하시겠습니까?")) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteUserAccountAction();

      if (result.success) {
        alert("계정이 성공적으로 삭제되었습니다.");
        router.push("/");
      } else {
        alert(`계정 삭제 실패: ${result.error}`);
      }
    } catch (error) {
      console.error("Delete account error:", error);
      alert("계정 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDeleteAccount}
      disabled={isDeleting}
      className="flex items-center space-x-1"
    >
      <Trash2 className="w-4 h-4" />
      <span>{isDeleting ? "삭제 중..." : "회원탈퇴"}</span>
    </Button>
  );
}