"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ViewerLoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ViewerLoginModal({
  open,
  onClose,
}: ViewerLoginModalProps) {
  const [login, setLogin] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!login || !name) {
      return alert("Please enter both name and email.");
    }

    setLoading(true);
    const res = await signIn("credentials", {
      login,
      name,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      onClose();
      router.push("/custom-home");
    } else {
      alert("Login failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Viewer Login</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Input
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Your Login"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <Button onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login as Viewer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
