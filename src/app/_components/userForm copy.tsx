"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";

// Schema Zod

const userSchema = z.object({
  name: z.string().min(3, 'Minimo 3 caracteres'),
  email: z.email('Insira um e-mail válido')
})

type userFormData = z.infer<typeof userSchema>

interface userFormProps {
  user?: {
    id: number,
    name: string,
    email: string
  }
  onSucess: () => void
}

export default function userFormCopy ({user, onSucess}: userFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset
  } = useForm<userFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user ?? {
      name: "",
      email: ""
    }
  })

async function onSubmit(data: userFormData) {
  try {
    setLoading(true);
    if(user){
      await axios.put(`/api/users/${user.id}`, data)
    }else {
      await axios.post(`/api/users`, data)
    }

    reset()
    onSucess()
  } catch (error) {
    console.error(error)
  }finally {
    setLoading(false)
  }
  
}
}