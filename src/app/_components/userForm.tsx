"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";

// Schema Zod
const userSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.email("E-mail inválido"),
});

// tipo gerado automaticamente
type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: {
    id: number;
    name: string;
    email: string;
  };
  onSuccess: () => void;
}

export default function UserForm({ user, onSuccess }: UserFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user ?? {
      name: "",
      email: "",
    },
  });


  async function onSubmit(data: UserFormData) {
    try {
      setLoading(true);

      if (user) {
        // Editar usuário
        await axios.put(`/api/users/${user.id}`, data);
      } else {
        // Criar usuário
        await axios.post("/api/users", data);
      }

      reset();
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 shadow rounded-md"
    >
      <div>
        <label className="block font-medium">Nome</label>
        <input
          {...register("name")}
          className="w-full border px-3 py-2 rounded"
          placeholder="Digite o nome"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">E-mail</label>
        <input
          {...register("email")}
          className="w-full border px-3 py-2 rounded"
          placeholder="Digite o e-mail"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Salvando..." : user ? "Atualizar" : "Criar Usuário"}
      </button>
    </form>
  );
}
